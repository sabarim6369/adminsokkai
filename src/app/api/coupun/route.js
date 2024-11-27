import connectMongoDB from "../Connection";
import Gift from "../Model/gifts";
import axios from "axios";

connectMongoDB();

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
  try {
    const { name, price, photo } = await request.json();

    if (!name || !price || !photo) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        { status: 400 }
      );
    }

    const uploadResponse = await axios.post(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/image/upload`,
      {
        file: photo,
        upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
        folder: "gifts",
      }
    );

    const photoUrl = uploadResponse.data.secure_url;

    const newGift = new Gift({ name, price, photo: photoUrl });
    await newGift.save();

    return new Response(
      JSON.stringify({ message: "Gift added successfully", gift: newGift }),
      { status: 201 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error adding gift" }), {
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
