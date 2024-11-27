import connectMongoDB from "../Connection";
import jwt from "jsonwebtoken";
import User from "../Model/Authentication";
export async function POST(request) {
  await connectMongoDB();

  try {
    const body = await request.json();
    console.log(body);

    const trimmedBody = Object.keys(body).reduce((acc, key) => {
      acc[key.trim()] = body[key];
      return acc;
    }, {});

    const { email, name, picture } = trimmedBody;

    console.log("email:", email);

    if (!email) {
      return new Response(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ email });
    }
    console.log("consoling the user : ", user);
    const id = user._id;
    console.log("id :", id);
    const token = jwt.sign(
      { email, picture, name, id },
      process.env.JWT_SECRET,
      {
        expiresIn: "5d",
      }
    );
    console.log("token : ", token);

    return Response.json({ token, user }, { status: 200 });
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response({ error: error.message }, { status: 500 });
  }
}
