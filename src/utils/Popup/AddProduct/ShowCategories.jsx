import React, { useState } from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowRight } from "react-icons/md";

function ShowCategories({ categories, HandelCategory }) {
  if (!Array.isArray(categories)) {
    return <div>Invalid data format</div>;
  }

  return (
    <div>
      {categories.map((category) => (
        <CategoryItem
          key={category.id}
          category={category}
          HandelCategory={HandelCategory}
        />
      ))}
    </div>
  );
}

function CategoryItem({ category, HandelCategory }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(null);

  // Handle subcategory click and update selected subcategory
  const handleSubcategoryClick = (subcategoryId) => {
    setSelectedSubcategoryId(subcategoryId); // Update selected subcategory
    HandelCategory(category.id, subcategoryId); // Pass to parent component
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-4">
      <div className="p-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-gray-500 hover:text-gray-700"
          >
            {isExpanded ? (
              <MdKeyboardArrowDown size={20} />
            ) : (
              <MdKeyboardArrowRight size={20} />
            )}
          </button>
          <span className="flex-1 font-medium text-gray-800">
            {category.name}
          </span>
        </div>
      </div>

      {isExpanded &&
        category.subcategories &&
        category.subcategories.length > 0 && (
          <div className="ml-8 border-l flex flex-col text-white gap-4 border-gray-200 pl-4 py-2 mt-2">
            {category.subcategories.map((subcategory) => (
              <div
                key={subcategory.id}
                onClick={() => handleSubcategoryClick(subcategory.id)}
                className={`flex items-center justify-center rounded-lg w-52 h-12 gap-2 mb-2 cursor-pointer ${
                  selectedSubcategoryId === subcategory.id
                    ? "bg-blue-500 text-white" 
                    : "bg-black text-white" 
                }`}
              >
                <span>{subcategory.name}</span>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}

export default ShowCategories;
