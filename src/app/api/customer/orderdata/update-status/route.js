import mongoose from "mongoose";
import connectMongoDB from "@/app/api/Connection";

export async function POST(request) {
  console.log("HTTP Method:", request.method);

  try {
    await connectMongoDB();
    const body = await request.json();
    const { userId, purchaseId, status } = body;

    console.log("Request Body: ", body);

    if (!userId || !purchaseId) {
      return new Response(
        JSON.stringify({ error: "userId and purchaseId are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const result = await mongoose.connection.db.collection("users").updateOne(
      {
        _id: new mongoose.Types.ObjectId(userId),
        "purchaseHistory._id": new mongoose.Types.ObjectId(purchaseId),
      },
      { $set: { "purchaseHistory.$.status": status } }
    );

    console.log("Update Result: ", result);

    if (result.modifiedCount > 0) {
      return new Response(
        JSON.stringify({ message: "Status updated successfully" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } else {
      return new Response(
        JSON.stringify({
          error: "No matching document found or already updated",
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    console.error("Error updating status:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export function OPTIONS() {
  // This allows pre-flight requests for CORS compliance
  return new Response(null, { status: 204 });
}
