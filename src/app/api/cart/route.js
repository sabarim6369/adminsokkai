export async function POST(request) {
  await connectMongoDB();

  try {
    const { userId, productId, quantity } = await request.json();
    const user = await User.findOne({ userId });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const productInCart = user.cart.find(
      (item) => item.productId.toString() === productId
    );
    if (productInCart) {
      productInCart.quantity += quantity;
    } else {
      user.cart.push({ productId, quantity });
    }

    await user.save();
    return Response.json(
      { message: "Product added to cart", cart: user.cart },
      { status: 200 }
    );
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}

export async function PATCH(request) {
  await connectMongoDB();

  try {
    const { userId, productId, quantity } = await request.json();
    const user = await User.findOne({ userId });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const productInCart = user.cart.find(
      (item) => item.productId.toString() === productId
    );
    if (productInCart) {
      productInCart.quantity = quantity;
      await user.save();
      return Response.json(
        { message: "Cart updated", cart: user.cart },
        { status: 200 }
      );
    }

    return Response.json(
      { error: "Product not found in cart" },
      { status: 404 }
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

    user.cart = user.cart.filter(
      (item) => item.productId.toString() !== productId
    );
    await user.save();

    return Response.json(
      { message: "Product removed from cart", cart: user.cart },
      { status: 200 }
    );
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}
