import User from "../models/User";
import connectMongoDB from "../Connection";
export async function POST(request) {
  await connectMongoDB();
  try {
    const { userId, productId } = await request.json();
    const user = await User.findOne({ userId });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }
    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
      await user.save();
    }
    return Response.json(
      { message: "Product added to wishlist", wishlist: user.wishlist },
      { status: 200 }
    );
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}
export async function DELETE(request) {
  await connectMongoDB();
  try {
    const { userId, productId } = await request.json();
    const user = await User.findOne({ userId });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
    await user.save();

    return Response.json(
      { message: "Product removed from wishlist", wishlist: user.wishlist },
      { status: 200 }
    );
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}