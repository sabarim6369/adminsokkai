import mongoose from "mongoose";
import connectMongoDB from "../../Connection";

export async function GET() {
  try {
    await connectMongoDB();

    const users = await mongoose.connection.db
      .collection("users")
      .find({})
      .toArray();

    // Array to hold filtered user data
    const usersWithPendingOrders = [];

    for (const user of users) {
      if (user.purchaseHistory) {
        const pendingOrders = user.purchaseHistory.filter(
          (order) => order.status === "pending"
        );

        if (pendingOrders.length > 0) {
          const enrichedOrders = await Promise.all(
            pendingOrders.map(async (order) => {
              // Get address details
              const address = user.address?.find(
                (addr) => addr._id === order.addressId
              );

              // Get product details for each product in the order
              const products = await Promise.all(
                order.products.map(async (product) => {
                  const productDetails = await mongoose.connection.db
                    .collection("products")
                    .findOne(
                      { _id: new mongoose.Types.ObjectId(product.productId) },
                      { projection: { reviews: 0, images: 0 } } // Exclude reviews and images
                    );

                  return {
                    ...product,
                    productDetails,
                  };
                })
              );

              return {
                ...order,
                address,
                products,
              };
            })
          );

          usersWithPendingOrders.push({
            ...user,
            purchaseHistory: enrichedOrders,
          });
        }
      }
    }

    return Response.json(
      {
        message: "Pending orders fetched successfully",
        users: usersWithPendingOrders,
      },
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching pending orders:", error);

    return Response.json(
      { error: "Error fetching pending orders" },
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
