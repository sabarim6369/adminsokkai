import connectMongoDB from "../Connection";
import axios from "axios";
import cloudinary from "cloudinary";
import dotenv from "dotenv";
import gifts from "../Model/gifts";

dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
export async function POST(request) {
  await connectMongoDB();

  try {
    const form = await request.formData();
    const name = form.get("name");
    const price = form.get("price");
    const files = form.getAll("images");

    if (!files || files.length === 0) {
      return Response.json(
        { error: "No files were uploaded" },
        { status: 400 }
      );
    }

    const images = await Promise.all(
      files.map(async (file) => {
        const buffer = await file.arrayBuffer();
        const base64 = Buffer.from(buffer).toString("base64");
        const uploadedImage = await uploadToCloudinary(
          `data:${file.type};base64,${base64}`
        );

        return {
          url: uploadedImage.url,
          public_id: uploadedImage.public_id,
        };
      })
    );

    const newProduct = new gifts({
      photos: images,
      name,
      price,
      // status: "active",
    });

    const savedProduct = await newProduct.save();

    return Response.json(savedProduct, { status: 201 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}

export async function PATCH(request) {
  try {
    const { id, name, price, photo, oldPhotoPublicId, status } =
      await request.json();
    const updateData = { name, price, status };

    if (photo) {
      const uploadResponse = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/image/upload`,
        {
          file: photo,
          upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
          folder: "ecommerce/products",
        }
      );

      if (!uploadResponse.data.secure_url || !uploadResponse.data.public_id) {
        return new Response(
          JSON.stringify({ error: "Failed to upload photo" }),
          { status: 500 }
        );
      }

      updateData.photos = [
        {
          url: uploadResponse.data.secure_url,
          public_id: uploadResponse.data.public_id,
        },
      ];

      if (oldPhotoPublicId) {
        await deleteFromCloudinary(oldPhotoPublicId);
      }
    }

    const updatedGift = await gifts.findByIdAndUpdate(id, updateData, {
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
  console.log("Request URL: ", request.url);
  const url = request.url;
  let fullUrl = url;
  try {
    const { searchParams } = new URL(fullUrl);
    const id = searchParams.get("id");
    console.log("id reached : ", id);
    console.log("endpoint reached");

    const giftToDelete = await gifts.findById(id);

    if (!giftToDelete) {
      console.log("gift not found in console");
      return new Response(JSON.stringify({ error: "Gift not found" }), {
        status: 404,
      });
    }

    giftToDelete.status = "disabled";
    await giftToDelete.save();

    return new Response(
      JSON.stringify({ message: "Gift marked as disabled successfully" }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error disabling gift" }), {
      status: 500,
    });
  }
}
export async function GET(request) {
  try {
    const giftsList = await gifts.find();
    return new Response(JSON.stringify(giftsList), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error fetching gifts" }), {
      status: 500,
    });
  }
}
const uploadToCloudinary = async (file) => {
  const result = await cloudinary.v2.uploader.upload(file, {
    folder: "ecommerce/products",
  });
  return { url: result.secure_url, public_id: result.public_id };
};

const deleteFromCloudinary = async (public_id) => {
  await cloudinary.v2.uploader.destroy(public_id);
};
