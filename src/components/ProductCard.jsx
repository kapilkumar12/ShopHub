import React, { memo } from "react";
import { useNavigate } from "react-router-dom";

const ProductCard = ({
  product = {},
  onAddToCart,
  onRemove,
  showWishlistActions = false,
}) => {
  const navigate = useNavigate();

  // 🔒 SAFE DATA
  const {
    _id,
    name = "Product",
    images = [],
    basePrice = 0,
    finalPrice = 0,
    discountPercent = 0,
  } = product;

  const imageUrl =
    images?.[0]?.url ||
    "https://via.placeholder.com/300x300?text=No+Image";

  ////////////////////////////////////////////////////////////////
  // NAVIGATE
  ////////////////////////////////////////////////////////////////
  const handleNavigate = () => {
    if (!_id) return;
    navigate(`/product/${_id}`);
  };

  return (
    <div className="bg-white p-3 rounded-xl shadow hover:shadow-lg transition">

      {/* IMAGE */}
      <div
        className="cursor-pointer"
        onClick={handleNavigate}
      >
        <img
          src={imageUrl}
          alt={name}
          className="h-48 w-full object-cover rounded"
          loading="lazy"
        />
      </div>

      {/* INFO */}
      <div className="mt-3">
        <h3
          onClick={handleNavigate}
          className="text-sm font-semibold line-clamp-2 cursor-pointer"
        >
          {name}
        </h3>

        {/* PRICE */}
        <div className="mt-2">
          <span className="line-through text-gray-400 text-sm mr-2">
            ₹{Math.round(basePrice)}
          </span>

          <span className="text-red-600 font-bold">
            ₹{Math.round(finalPrice)}
          </span>

          {discountPercent > 0 && (
            <span className="text-green-600 text-xs ml-2">
              {discountPercent}% OFF
            </span>
          )}
        </div>
      </div>

      {/* 🔥 WISHLIST ACTIONS */}
      {showWishlistActions && (
        <div className="flex gap-2 mt-3">

          <button
            onClick={onAddToCart}
            className="flex-1 bg-green-500 text-white py-1 text-sm rounded hover:bg-green-600"
          >
            Add
          </button>

          <button
            onClick={onRemove}
            className="flex-1 bg-red-500 text-white py-1 text-sm rounded hover:bg-red-600"
          >
            Remove
          </button>

        </div>
      )}
    </div>
  );
};

// 🔥 PERFORMANCE OPTIMIZATION
export default memo(ProductCard);