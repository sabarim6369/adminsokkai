import React, { useState } from 'react';

function CategoryForm({ onSubmit }) {
  const [categoryName, setCategoryName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (categoryName.trim()) {
      onSubmit(categoryName);
      setCategoryName('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 ">
      <div className="flex gap-3">
        <input
          type="text"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          placeholder="Enter category name"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          className="px-6 py-2 bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors"
        >
          Add Category
        </button>
      </div>
    </form>
  );
}

export default CategoryForm;