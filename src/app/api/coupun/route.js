import Coupun from "../Model/Coupun";
import connectMongoDB from "../Connection";
import mongoose from "mongoose";
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

export async function GET(request) {
  await connectMongoDB();

  if (request.method === "GET") {
    try {
      const coupons = await Coupun.find({});

      if (!coupons || coupons.length === 0) {
        return Response.json({ message: "No coupons found" }, { status: 404 });
      }

      const couponsWithUserData = await Promise.all(
        coupons.map(async (coupon) => {
          if (coupon.usedBy) {
            const user = await mongoose.connection.db
              .collection("users")
              .findOne({ _id: new mongoose.Types.ObjectId(coupon.usedBy) });

            return {
              ...coupon.toObject(),
              user: user || null,
            };
          } else {
            return coupon;
          }
        })
      );

      return Response.json(
        {
          message: "Coupons fetched successfully",
          coupons: couponsWithUserData,
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error fetching coupons:", error);
      return Response.json(
        { error: "Internal server error", details: error.message },
        { status: 500 }
      );
    }
  } else {
    return Response.json(
      { error: `Method ${request.method} not allowed` },
      { status: 405 }
    );
  }
}
