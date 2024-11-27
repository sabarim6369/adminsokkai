export async function POST(request) {
  await connectMongoDB();

  try {
    const { userId, productId, price } = await request.json();
    const user = await User.findOne({ userId });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    user.history.push(productId);
    user.totalPurchasePrice += price;
    await user.save();

    return Response.json(
      { message: "Purchase added to history", history: user.history },
      { status: 200 }
    );
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}

export async function GET(request) {
  await connectMongoDB();

  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");
    const user = await User.findOne({ userId }).populate("history");

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json({ history: user.history }, { status: 200 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}
