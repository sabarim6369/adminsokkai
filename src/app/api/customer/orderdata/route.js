import mongoose from "mongoose";
import connectMongoDB from "../../Connection";

export async function GET() {
  try {
    await connectMongoDB();

    const users = await mongoose.connection.db
      .collection("users")
      .find({})
      .toArray();

    const usersWithPendingOrders = [];
    const mergedProducts = [];

    for (const user of users) {
      if (user.purchaseHistory) {
        const pendingOrders = user.purchaseHistory.filter(
          (order) => order.status === "pending"
        );

        if (pendingOrders.length > 0) {
          const enrichedOrders = await Promise.all(
            pendingOrders.map(async (order) => {
              const address = user.address?.find(
                (addr) => addr._id.toString() === order.addressId.toString()
              );

              const products = await Promise.all(
                order.products.map(async (product) => {
                  const productDetails = await mongoose.connection.db
                    .collection("products")
                    .findOne(
                      { _id: new mongoose.Types.ObjectId(product.productId) },
                      { projection: { reviews: 0, images: 0 } }
                    );

                  if (!productDetails) {
                    console.error(
                      `Product details not found for product ID: ${product.productId}`
                    );
                    return product; // Return the existing product data if details are not found
                  }

                  // Merge existing product data with fetched product details
                  const mergedProduct = {
                    ...product,
                    productDetails,
                  };

                  // Store merged product for response
                  mergedProducts.push(mergedProduct);

                  console.log("Merged Product:", mergedProduct);

                  return mergedProduct;
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

    console.log("Users with pending orders:", usersWithPendingOrders);

    return new Response(
      JSON.stringify({
        message: "Pending orders fetched successfully",
        users: usersWithPendingOrders,
        mergedProducts, 
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching pending orders:", error);

    return new Response(
      JSON.stringify({ error: "Error fetching pending orders" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
