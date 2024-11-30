import mongoose from "mongoose";
import connectMongoDB from "../../Connection";

export async function GET() {
  try {
    await connectMongoDB();

    const users = await mongoose.connection.db
      .collection("users")
      .find({})
      .toArray();

    console.log("Fetched Users:", users);

    return Response.json(
      { message: "Customer data fetched successfully", users },
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching customer data:", error);

    return Response.json(
      { error: "Error fetching the customer data" },
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
