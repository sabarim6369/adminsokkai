import {Wishlist} from "../../../Model/customerdata";
import connectMongoDB from "@/app/api/Connection";

export async function POST(request) {
  console.log("wishlist : ", request);
  await connectMongoDB();
  const { userid, productid } = await request.json();

  if (!userid || !productid) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const wishlist = await Wishlist.findOneAndUpdate(
      { userid },
      { $addToSet: { products: productid } },
      { upsert: true, new: true }
    );
    return new Response(JSON.stringify(wishlist), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

export async function GET(request) {
  await connectMongoDB();
  const { searchParams } = new URL(request.url);
  const userid = searchParams.get("userid");

  if (!userid) {
    return new Response(JSON.stringify({ error: "Missing userid" }), {
      status: 400,
    });
  }

  try {
    const wishlist = await Wishlist.findOne({ userid });
    return new Response(JSON.stringify(wishlist || {}), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

export async function DELETE(request) {
  await connectMongoDB();
  const { userid, productid } = await request.json();

  if (!userid || !productid) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400,
    });
  }

  try {
    const wishlist = await Wishlist.findOneAndUpdate(
      { userid },
      { $pull: { products: productid } },
      { new: true }
    );
    return new Response(JSON.stringify(wishlist), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
