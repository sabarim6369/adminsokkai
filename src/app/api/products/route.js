import cloudinary from "cloudinary";
import Product from "../Model/Product";
import dotenv from "dotenv";
import connectMongoDB from "../Connection";
dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
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

const deleteFromCloudinary = async (public_id) => {
  try {
    await cloudinary.v2.uploader.destroy(public_id);
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    throw new Error("Failed to delete image from Cloudinary");
  }
};
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "60mb",
    },
  },
};
export async function POST(request) {
  console.log("endpoint reached");
  await connectMongoDB();
  try {
    const form = await request.formData();
    console.log("Form data raw:", form);

    const name = form.get("name");
    console.log("Name:", name);

    const originalprice = form.get("originalprice");
    console.log("Original Price:", originalprice);

    const description = form.get("description");
    console.log("Description:", description);

    const price = form.get("price");
    console.log("Price:", price);

    const sizes = form.get("sizes");
    console.log("Sizes:", sizes);

    const color = form.get("color");
    console.log("Color:", color);

    const category = form.get("category");
    console.log("Category raw:", category);

    // Convert category string to an array of numbers
    let categoryNumbers;
    try {
      // Attempt to parse as JSON first
      categoryNumbers = JSON.parse(category);
      // Ensure all elements are valid numbers
      categoryNumbers = categoryNumbers.map((cat) => {
        const num = BigInt(cat);
        if (isNaN(Number(num))) {
          throw new Error(
            "Invalid category value. All values must be valid numbers."
          );
        }
        return Number(num);
      });
    } catch (error) {
      // If JSON parsing fails, try to split and parse as integers
      categoryNumbers = category
        .replace(/^\[|\]$/g, "") // Remove square brackets if present
        .split(",")
        .map((cat) => {
          const num = BigInt(cat.trim());
          if (isNaN(Number(num))) {
            throw new Error(
              "Invalid category value. All values must be valid numbers."
            );
          }
          return Number(num);
        });
    }

    console.log("Category Numbers:", categoryNumbers);

    // Validate categoryNumbers
    if (categoryNumbers.some((cat) => isNaN(cat))) {
      return new Response(
        JSON.stringify({
          error: "Invalid category value. All values must be numbers.",
        }),
        { status: 400 }
      );
    }

    const stock = form.get("stock");
    console.log("Stock:", stock);

    const brand = form.get("brand");
    console.log("Brand:", brand);

    const giftId = form.get("selectedGift");
    console.log("Selected Gift ID:", giftId);

    const files = form.getAll("images");
    console.log("Files:", files);

    if (!files || files.length === 0) {
      return new Response(JSON.stringify({ error: "No files were uploaded" }), {
        status: 400,
      });
    }

    const images = await Promise.all(
      files.map(async (file) => {
        const buffer = await file.arrayBuffer();
        const base64 = Buffer.from(buffer).toString("base64");
        try {
          return await uploadToCloudinary(`data:${file.type};base64,${base64}`);
        } catch (uploadError) {
          return { error: uploadError.message };
        }
      })
    );

    console.log("Images after upload:", images);

    const successfulImages = images.filter((image) => !image.error);
    console.log("Successful Images:", successfulImages);

    if (successfulImages.length === 0) {
      return new Response(
        JSON.stringify({ error: "All image uploads failed" }),
        { status: 400 }
      );
    }

    const newProduct = new Product({
      name,
      sizes,
      color,
      originalprice,
      description,
      price,
      category: categoryNumbers,
      stock,
      brand,
      images: successfulImages,
      selectedGift: giftId,
    });

    console.log("New product:", newProduct);

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
    const color = JSON.parse(form.get("color") || "[]");
    const originalprice = form.get("originalprice");
    const description = form.get("description");
    const price = form.get("price");
    const stock = form.get("stock");
    const sizes = JSON.parse(form.get("sizes") || "[]");
    const brand = form.get("brand");

    // Parse category correctly as an array of numbers
    const categoryRaw = form.get("category");
    const category = categoryRaw
      ? JSON.parse(categoryRaw).map((cat) => Number(cat))
      : [];

    console.log("Parsed category:", category);

    // Fetch the existing product
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return new Response(JSON.stringify({ error: "Product not found" }), {
        status: 404,
      });
    }
    const updatedData = {
      name,
      originalprice,
      description,
      price,
      category,
      stock,
      sizes,
      brand,
      color,
      updatedAt: Date.now(),
    };

    console.log("Updated data:", updatedData);
    const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    console.log("Updated product:", updatedProduct);

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

    const product = await Product.findById(id);

    if (!product) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }

    product.status = "inactive";
    await product.save();

    return Response.json(
      { message: "Product status updated to inactive successfully" },
      { status: 200 }
    );
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
