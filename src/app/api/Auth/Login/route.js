import jwt from "jsonwebtoken";
import connectMongoDB from "../../Connection";
import User from "../../Model/Authentication";

export async function POST(request) {
  await connectMongoDB();

  try {
    const body = await request.json();
    console.log(body);

    const trimmedBody = Object.keys(body).reduce((acc, key) => {
      acc[key.trim()] = body[key];
      return acc;
    }, {});

    const { email } = trimmedBody;

    console.log("email:", email);

    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
      });
    }
    let user = await User.findOne({ email });
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    console.log("User found:", user);

    const { name, picture, _id: id } = user;

    const token = jwt.sign(
      { email, name, picture, id },
      process.env.JWT_SECRET,
      {
        expiresIn: "5d",
      }
    );

    console.log("Generated token:", token);

    return Response.json({ token, user }, { status: 200 });
  } catch (error) {
    console.error("Error processing login request:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
