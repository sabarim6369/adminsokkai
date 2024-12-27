"use client";
import { useState } from "react";
import CategoryList from "./CategoryList";
import CategoryForm from "./CategoryForm";
import { FaTimes } from "react-icons/fa";
function page({ value, onClose }) {
  console.log("component triggered");
  const [categories, setCategories] = useState([]);
  console.log("categories consoling : ", categories);
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
                subcategories: [],
              },
            ],
          };
        }
        return category;
      });
    };

    setCategories(addSubcategoryToTree(categories));
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

export default page;
