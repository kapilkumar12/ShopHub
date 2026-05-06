import React from "react";

const ProductCardSkeleton = () => {
  return (
    <>
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className="bg-white p-3 rounded-xl shadow animate-pulse"
        >
          <div className="h-48 bg-gray-300 rounded mb-3"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-6 bg-gray-300 rounded w-1/3"></div>
        </div>
      ))}
    </>
  );
};

export default ProductCardSkeleton;