import React, { useState } from 'react';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import { MdKeyboardArrowDown, MdKeyboardArrowRight } from 'react-icons/md';

function CategoryItem({ category, onEdit, onDelete, onAddSubcategory, isMainCategory }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(category.name);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editedName.trim()) {
      onEdit(category.id, editedName);
      setIsEditing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </form>
        ) : (
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
            <span className="flex-1 font-medium text-gray-800">{category.name}</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-gray-500 hover:text-blue-500 transition-colors"
                title="Edit"
              >
                <FiEdit2 size={16} />
              </button>
              {isMainCategory && (
                <button
                  onClick={() => onAddSubcategory(category.id)}
                  className="p-2 text-gray-500 hover:text-green-500 transition-colors"
                  title="Add Subcategory"
                >
                  <FiPlus size={16} />
                </button>
              )}
              <button
                onClick={() => onDelete(category.id)}
                className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                title="Delete"
              >
                <FiTrash2 size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
      
      {isExpanded && category.subcategories && category.subcategories.length > 0 && (
        <div className="ml-8 border-l border-gray-200 pl-4 py-2 mt-2">
          {category.subcategories.map(subcategory => (
            <CategoryItem
              key={subcategory.id}
              category={subcategory}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddSubcategory={onAddSubcategory}
              isMainCategory={false}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CategoryItem;