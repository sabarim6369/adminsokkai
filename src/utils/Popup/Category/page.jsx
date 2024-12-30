"use client";
import { useState, useEffect } from "react";
import CategoryList from "./CategoryList";
import CategoryForm from "./CategoryForm";
import { FaTimes } from "react-icons/fa";
import axios from "axios";

function Page({ value, onClose }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/categories");
        console.log("response data for the categories:",response.data);
        if (response.status === 200) {
          setCategories(response.data);
        }
      } catch (error) {
        setError("Error fetching categories");
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  console.log("categories:", categories);

  const addCategory = (name) => {
    const newCategory = {
      id: Date.now(),
      name,
      subcategories: [],
    };
    setCategories([...categories, newCategory]);
  };

  const editCategory = (id, newName) => {
    const updateCategoryTree = (categories) => {
      return categories.map((category) => {
        if (category.id === id) {
          return { ...category, name: newName };
        }
        if (category.subcategories) {
          return {
            ...category,
            subcategories: updateCategoryTree(category.subcategories),
          };
        }
        return category;
      });
    };

    setCategories(updateCategoryTree(categories));
  };

  const deleteCategory = (id) => {
    const deleteCategoryFromTree = (categories) => {
      return categories.filter((category) => {
        if (category.id === id) {
          return false;
        }
        if (category.subcategories) {
          category.subcategories = deleteCategoryFromTree(
            category.subcategories
          );
        }
        return true;
      });
    };

    setCategories(deleteCategoryFromTree(categories));
  };

  const addSubcategory = (parentId) => {
    const name = prompt("Enter subcategory name:");
    if (!name) return;

    const addSubcategoryToTree = (categories) => {
      return categories.map((category) => {
        if (category.id === parentId) {
          return {
            ...category,
            subcategories: [
              ...category.subcategories,
              {
                id: Date.now(),
                name,
              },
            ],
          };
        }
        if (category.subcategories) {
          return {
            ...category,
            subcategories: addSubcategoryToTree(category.subcategories),
          };
        }
        return category;
      });
    };

    setCategories(addSubcategoryToTree(categories));
  };
  const handleSubmit = async () => {
    try {
      const response = await axios.post("/api/categories", {
        categories,
      });
      if (response.status === 200 || response.status === 201) {
        toast.success("Product added successfully");
      }
      console.log("Categories submitted:", response.data);
    } catch (error) {
      console.error("Error submitting categories:", error);
    }
  };

  return (
    value && (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
        <div className="max-w-3xl mx-auto px-4 bg-white xl:w-[40%] md:[40%] w-[95%]">
          <div className="flex flex-row justify-between items-center">
            <h1 className="xl:text-3xl text-xl text-nowrap font-bold text-gray-900 m-8 ">
              Category Management
            </h1>
            <button>
              <FaTimes onClick={onClose} color="black" size={20} />
            </button>
          </div>
          <div>
            <CategoryForm onSubmit={addCategory} />
            <div className="mb-10 xl:h-96 h-80 overflow-y-scroll">
              <CategoryList
                categories={categories}
                onEdit={editCategory}
                onDelete={deleteCategory}
                onAddSubcategory={addSubcategory}
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                onClick={handleSubmit}
                className="px-6 py-2 mb-5 bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
}

export default Page;
