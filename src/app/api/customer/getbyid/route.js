import mongoose from "mongoose";
import connectMongoDB from "../../Connection";
export async function GET(req) {
  try {
    await connectMongoDB();
    const url = new URL(req.url);
    const clientId = url.searchParams.get("clientId");
    console.log("consoling the client id :",clientId);
    if (!clientId) {
      return new Response(JSON.stringify({ error: "clientId is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const user = await mongoose.connection.db
      .collection("users")
      .findOne({ _id: new mongoose.Types.ObjectId(clientId) });
    if (!user) {
      return new Response(JSON.stringify({ error: "Client not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log("Fetched Client:", user);

    return new Response(
      JSON.stringify({
        message: "Customer data fetched successfully",
        user,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching customer data:", error);

    return new Response(
      JSON.stringify({ error: "Error fetching the customer data" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}