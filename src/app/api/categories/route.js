import Category from "../Model/Categories";
import connectMongoDB from "../Connection";
export async function POST(request) {
  try {
    await connectMongoDB();
    const body = await request.json();

    if (!body.categories || !Array.isArray(body.categories)) {
      return new Response(
        JSON.stringify({
          error: "Categories array is required and must be valid",
        }),
        { status: 400 }
      );
    }

    const processedCategories = [];
    for (const category of body.categories) {
      if (!category.id || !category.name) {
        throw new Error(`Invalid category data: ${JSON.stringify(category)}`);
      }

      const categoryId = Number(category.id); 
      const existingCategory = await Category.findOne({ id: categoryId });

      if (existingCategory) {
        const newSubcategories = category.subcategories.filter(
          (sub) =>
            !existingCategory.subcategories.some(
              (exSub) => exSub.id === sub.id || exSub.name === sub.name
            )
        );

        if (newSubcategories.length > 0) {
          existingCategory.subcategories.push(...newSubcategories);
          await existingCategory.save();
        }
        processedCategories.push(existingCategory);
      } else {
        const newCategory = new Category({
          id: categoryId,
          name: category.name,
          subcategories: category.subcategories,
        });

        await newCategory.save();
        processedCategories.push(newCategory);
      }
    }

    return new Response(
      JSON.stringify({
        message: "Categories processed successfully",
        categories: processedCategories,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

function deduplicateSubcategories(subcategories) {
  const uniqueSubcategories = [];
  const seenNames = new Set();

  for (const subcategory of subcategories) {
    if (subcategory.name && !seenNames.has(subcategory.name)) {
      seenNames.add(subcategory.name);
      uniqueSubcategories.push(subcategory);
    }
  }

  return uniqueSubcategories;
}

export async function GET() {
  try {
    await connectMongoDB();

    const categories = await Category.find().populate("subcategories");
    return new Response(JSON.stringify(categories), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

export async function DELETE(request) {
  try {
    await connectMongoDB();

    const { id } = await request.json();

    const category = await Category.findById(id);
    if (!category) {
      return new Response(JSON.stringify({ error: "Category not found" }), {
        status: 404,
      });
    }

    await category.remove();
    return new Response(
      JSON.stringify({ message: "Category deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

export async function PUT(request) {
  try {
    await connectMongoDB();

    const { id, name } = await request.json();

    const category = await Category.findById(id);
    if (!category) {
      return new Response(JSON.stringify({ error: "Category not found" }), {
        status: 404,
      });
    }

    category.name = name;
    await category.save();

    return new Response(
      JSON.stringify({ message: "Category updated successfully", category }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
