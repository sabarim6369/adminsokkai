import Product from "@/models/Product";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  try {
    const product = await Product.findById(id);
    if (!product)
      return (
        Response.json({ error: "Product not found" }),
        {
          status: 404,
        }
      );

    const productWithImages = product.toObject();
    productWithImages.images = productWithImages.images.map((image) => {
      return {
        ...image,
        data: image.data.toString("base64"),
      };
    });

    return Response.json(productWithImages), { status: 200 };
  } catch (error) {
    return (
      Response.json({ error: error.message }),
      {
        status: 500,
      }
    );
  }
}
