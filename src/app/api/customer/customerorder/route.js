import CustomerOrder from "../../Model/CustomerOrder";
import connectMongoDB from "../../Connection";

export async function POST(request) {
  try {
    // Connect to MongoDB
    await connectMongoDB();

    // Parse request body
    const body = await request.json();
    console.log("Request Body:", body);

    const { userid, totalprice, coupun_name, coupunamount, payment_type } =
      body;

    // Validate required fields
    if (!userid || !totalprice || !payment_type) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Create a new customer order
    const order = await CustomerOrder.create({
      userid,
      totalprice,
      coupun_name,
      coupunamount,
      payment_type,
    });

    // Return success response
    return new Response(
      JSON.stringify({ message: "Order created successfully", order }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error creating customer order:", error);

    // Return error response
    return new Response(
      JSON.stringify({ error: "Error creating customer order" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
