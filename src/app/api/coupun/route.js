import Coupun from "../Model/Coupun";
import connectMongoDB from "../Connection";
export async function POST(request) {
  await connectMongoDB();

  if (request.method === "POST") {
    try {
      const { coupun, pricing, status } = await request.json();

      if (!coupun || !pricing) {
        return new Response(
          JSON.stringify({ error: "Coupun and pricing are required" }),
          { status: 400 }
        );
      }

      const newCoupun = await Coupun.create({
        coupun,
        pricing,
        status: status || "pending",
      });

      return new Response(
        JSON.stringify({ message: "Coupun created successfully", newCoupun }),
        { status: 201 }
      );
    } catch (error) {
      console.error("Error creating coupun:", error);
      return new Response(
        JSON.stringify({
          error: "Internal server error",
          details: error.message,
        }),
        { status: 500 }
      );
    }
  } else {
    return new Response(
      JSON.stringify({ error: `Method ${request.method} not allowed` }),
      { status: 405 }
    );
  }
}
