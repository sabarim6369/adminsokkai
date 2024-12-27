import React from 'react';
import CategoryItem from './CategoryItem';

function CategoryList({ categories, onEdit, onDelete, onAddSubcategory }) {
  return (
    <div className="space-y-4">
      {categories.map(category => (
        <CategoryItem
          key={category.id}
          category={category}
          onEdit={onEdit}
          onDelete={onDelete}
          onAddSubcategory={onAddSubcategory}
          isMainCategory={true}
        />
      ))}
    </div>
  );
}

export default CategoryList;