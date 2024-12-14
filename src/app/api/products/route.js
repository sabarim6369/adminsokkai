import cloudinary from "cloudinary";
import Product from "../Model/Product";
import dotenv from "dotenv";
import connectMongoDB from "../Connection";
dotenv.config();

// Cloudinary Configuration
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to upload image to Cloudinary
const uploadToCloudinary = async (file) => {
  try {
    const result = await cloudinary.v2.uploader.upload(file, {
      folder: "ecommerce/products",
    });
    return { url: result.secure_url, public_id: result.public_id };
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw new Error("Failed to upload image to Cloudinary");
  }
};

// Function to delete image from Cloudinary
const deleteFromCloudinary = async (public_id) => {
  try {
    await cloudinary.v2.uploader.destroy(public_id);
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    throw new Error("Failed to delete image from Cloudinary");
  }
};

// Main POST request handler
export async function POST(request) {
  await connectMongoDB(); // Ensure database connection

  try {
    // Parse form data
    const form = await request.formData();

    const name = form.get("name");
    const originalprice = form.get("originalprice");
    const description = form.get("description");
    const price = form.get("price");
    const sizes = form.get("sizes");
    const category = form.get("category");
    const stock = form.get("stock");
    const brand = form.get("brand");

    // Get uploaded images
    const files = form.getAll("images");

    // Log form entries for debugging
    for (let [key, value] of form.entries()) {
      console.log(`${key}:`, value);
    }

    // Validate if files were uploaded
    if (!files || files.length === 0) {
      return new Response(JSON.stringify({ error: "No files were uploaded" }), {
        status: 400,
      });
    }

    // Upload images to Cloudinary
    const images = await Promise.all(
      files.map(async (file) => {
        const buffer = await file.arrayBuffer();
        const base64 = Buffer.from(buffer).toString("base64");
        try {
          return await uploadToCloudinary(`data:${file.type};base64,${base64}`);
        } catch (uploadError) {
          return { error: uploadError.message }; // Handle individual file upload failures
        }
      })
    );

    const successfulImages = images.filter((image) => !image.error);
    if (successfulImages.length === 0) {
      return new Response(
        JSON.stringify({ error: "All image uploads failed" }),
        { status: 400 }
      );
    }

    const newProduct = new Product({
      name,
      sizes,
      originalprice,
      description,
      price,
      category,
      stock,
      brand,
      images: successfulImages, 
    });
    const savedProduct = await newProduct.save();

    console.log("Saved product:", savedProduct);
    return new Response(JSON.stringify(savedProduct), { status: 201 });
  } catch (error) {
    console.error("Error while creating product:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Something went wrong" }),
      { status: 400 }
    );
  }
}

export async function GET() {
  await connectMongoDB();

  try {
    const products = await Product.find();
    return Response.json(products, { status: 200 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  await connectMongoDB();

  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    console.log("Product ID:", id);

    const form = await request.formData();

    const name = form.get("name");
    const originalprice = form.get("originalprice");
    const description = form.get("description");
    const price = form.get("price");
    const category = form.get("category");
    const stock = form.get("stock");
    const sizes = JSON.parse(form.get("sizes") || "[]");
    const brand = form.get("brand");

    const sentImagePublicIds = JSON.parse(form.get("sentImages") || "[]");
    const files = form.getAll("images");
    console.log("New images from frontend:", files);
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return new Response(JSON.stringify({ error: "Product not found" }), {
        status: 404,
      });
    }
    const retainedImages = existingProduct.images.filter((img) =>
      sentImagePublicIds.includes(img.public_id)
    );
    const imagesToRemove = existingProduct.images.filter(
      (img) => !sentImagePublicIds.includes(img.public_id)
    );

    if (imagesToRemove.length > 0) {
      try {
        await Promise.all(
          imagesToRemove.map(async (img) => {
            console.log(`Deleting image: ${img.public_id}`);
            await deleteFromCloudinary(img.public_id);
          })
        );
      } catch (error) {
        console.error("Error while removing images from Cloudinary:", error);
        return new Response(
          JSON.stringify({ error: "Failed to remove unused images" }),
          { status: 500 }
        );
      }
    }

    const newImages = await Promise.all(
      files.map(async (file) => {
        try {
          console.log("Uploading new image:", file.name || "Unnamed file");
          const buffer = await file.arrayBuffer();
          const base64 = Buffer.from(buffer).toString("base64");
          const uploadedImage = await uploadToCloudinary(
            `data:${file.type};base64,${base64}`
          );
          console.log("Uploaded image successfully:", uploadedImage);
          return uploadedImage;
        } catch (err) {
          console.error("Error uploading image:", err);
          throw err;
        }
      })
    );

    const updatedImages = [...retainedImages, ...newImages];
    console.log("Final updated images:", updatedImages);

    const updatedData = {
      name,
      originalprice,
      description,
      price,
      category,
      stock,
      sizes,
      brand,
      images: updatedImages,
      updatedAt: Date.now(),
    };

    const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    return new Response(JSON.stringify(updatedProduct), { status: 200 });
  } catch (error) {
    console.error("Error updating product:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to update product",
        details: error.message,
      }),
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  await connectMongoDB();

  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    console.log("id destructureing form the db : ", url, id);

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }
    await Promise.all(
      product.images.map(async (image) => {
        await deleteFromCloudinary(image.public_id);
      })
    );

    return Response.json(
      { message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
