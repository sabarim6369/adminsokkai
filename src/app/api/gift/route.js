import connectMongoDB from "../Connection";
import Gift from "../Model/gifts";
import axios from "axios";
import cloudinary from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
export async function GET(request) {
  try {
    const gifts = await Gift.find();
    return new Response(JSON.stringify(gifts), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error fetching gifts" }), {
      status: 500,
    });
  }
}
export async function POST(request) {
  console.log("data posted came here");

  try {
    const form = await request.formData();
    const name = form.get("name");
    const price = form.get("price");
    console.log("names : ", name, "price : ", price);

    const files = form.getAll("images");
    if (!name || !price || files.length === 0) {
      return new Response(
        JSON.stringify({
          error:
            "All fields are required, and at least one image must be uploaded",
        }),
        { status: 400 }
      );
    }

    // Upload each file to Cloudinary and return the image URL and public_id
    const uploadPromises = files.map(async (file) => {
      const buffer = await file.arrayBuffer(); // Convert to buffer if needed

      // Using Cloudinary upload method that returns a promise
      const result = await cloudinary.uploader.upload(
        Buffer.from(buffer), // Upload image from buffer
        { folder: "ecommerce/products" }
      );

      return { url: result.secure_url, public_id: result.public_id };
    });

    const imageUrls = await Promise.all(uploadPromises);
    console.log("Image URLs:", imageUrls);

    // Assuming Gift is a valid model and you are saving it to a DB
    const newGift = new Gift({ name, price, photos: imageUrls });
    await newGift.save();

    return new Response(
      JSON.stringify({ message: "Gift added successfully", gift: newGift }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding gift:", error);
    return new Response.json({ error: "Error adding gift" }), {
      status: 500,
    });
  }
}

export async function PATCH(request) {
  try {
    const { id, name, price, photo } = await request.json();
    const updateData = { name, price };

    if (photo) {
      const uploadResponse = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/image/upload`,
        {
          file: photo,
          upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
          folder: "gifts",
        }
      );
      updateData.photo = uploadResponse.data.secure_url;
    }

    const updatedGift = await Gift.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedGift) {
      return new Response(JSON.stringify({ error: "Gift not found" }), {
        status: 404,
      });
    }
    return new Response(
      JSON.stringify({
        message: "Gift updated successfully",
        gift: updatedGift,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error updating gift" }), {
      status: 500,
    });
  }
}

export async function DELETE(request) {
  try {
    const { id } = new URL(request.url).searchParams;

    const deletedGift = await Gift.findByIdAndDelete(id);

    if (!deletedGift) {
      return new Response(JSON.stringify({ error: "Gift not found" }), {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({ message: "Gift deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error deleting gift" }), {
      status: 500,
    });
  }
}
