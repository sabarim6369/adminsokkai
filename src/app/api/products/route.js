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
  const result = await cloudinary.v2.uploader.upload(file, {
    folder: "ecommerce/products",
  });
  return { url: result.secure_url, public_id: result.public_id };
};

const deleteFromCloudinary = async (public_id) => {
  await cloudinary.v2.uploader.destroy(public_id);
};

// Create Product
export async function POST(request) {
  await connectMongoDB();

  console.log("data passed");
  try {
    const form = await request.formData();
    const name = form.get("name");
    const description = form.get("description");
    const price = form.get("price");
    const category = form.get("category");
    const stock = form.get("stock");
    const brand = form.get("brand");
    const files = form.getAll("images");
    for (let [key, value] of form.entries()) {
      console.log(`${key}:`, value);
    }

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
        return await uploadToCloudinary(`data:${file.type};base64,${base64}`);
      })
    );

    const newProduct = new Product({
      name,
      description,
      price,
      category,
      stock,
      brand,
      images,
    });

    const savedProduct = await newProduct.save();
    return Response.json(savedProduct, { status: 201 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
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
    const form = await request.formData();

    const name = form.get("name");
    const description = form.get("description");
    const price = form.get("price");
    const category = form.get("category");
    const stock = form.get("stock");
    const brand = form.get("brand");
    const files = form.getAll("images");
    const reviews = JSON.parse(form.get("reviews") || "[]");
    const sentImagePublicIds = JSON.parse(form.get("sentImages") || "[]");

    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return Response.json({ error: "Product not found" }, { status: 404 });
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
        console.error("Error while removing images:", error);
        return Response.json(
          { error: "Failed to remove unused images" },
          { status: 500 }
        );
      }
    }

    const newImages = files.length
      ? await Promise.all(
          files.map(async (file) => {
            const buffer = await file.arrayBuffer();
            const base64 = Buffer.from(buffer).toString("base64");
            return await uploadToCloudinary(
              `data:${file.type};base64,${base64}`
            );
          })
        )
      : [];
    const updatedImages = [...retainedImages, ...newImages];

    const updatedData = {
      name,
      description,
      price,
      category,
      stock,
      brand,
      reviews,
      images: updatedImages,
      updatedAt: Date.now(),
    };

    const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    return Response.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.error("Error updating product:", error);
    return Response.json({ error: error.message }, { status: 500 });
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
