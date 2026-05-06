import { useNavigate } from "react-router-dom";
import { useState,useEffect, memo } from "react";
import { addToCart } from "../services/cart";
import { wishlistToggle,checkWishlist } from "../services/wishlist";
import Swal from "sweetalert2";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import AuthModal from "./AuthModal";

export default function ProductCard({ product }) {

  const [loading,setLoading] = useState(false);
  const [addedToCart,setAddedToCart] = useState(false);
  const [showAuthModal,setShowAuthModal] = useState(false);
  const [wishlisted,setWishlisted] = useState(false);

  const { user } = useAuth();

  // ✅ FIX: fetchCartCount add karo
  const { updateCartCount,fetchCartCount } = useCart();
  const { fetchWishlistCount } = useWishlist();

  const navigate = useNavigate();
  if (!product) return null;

  ////////////////////////////////////////////////////////////////
  // 🔥 IMAGE LOGIC
  ////////////////////////////////////////////////////////////////
  const images = product?.images || [];

  const firstImage =
    images[0]?.url || images[0] || product?.image?.url || null;

  ////////////////////////////////////////////////////////////////
  // 🔥 PRICE LOGIC
  ////////////////////////////////////////////////////////////////
  const mrp = product.basePrice || 0;
  const finalPrice = product.finalPrice || 0;
  const discount = product.discountPercent || 0;

  useEffect(() => {
    const check = async () => {
      if (!user || !product?._id) return;

      try {
        const res = await checkWishlist(product._id);
        setWishlisted(res.wishlisted);
      } catch { }
    };

    check();
  },[user,product._id]);

  ////////////////////////////////////////////////////////////////
  // 🛒 ADD TO CART
  ////////////////////////////////////////////////////////////////
  const handleAddToCart = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    try {
      setLoading(true);

      await addToCart({
        productId: product._id,
        quantity: 1,
      });

      // 🔥 Instant UI update
      updateCartCount(1);

      // 🔥 Sync with backend (important)
      await fetchCartCount();

      setAddedToCart(true); // ✅ FIX

      Swal.fire({
        icon: "success",
        title: "Added to Cart 🛒",
        timer: 1000,
        showConfirmButton: false,
      });

      setTimeout(() => {
        navigate("/cart");
      },1000);

    } catch (error) {
      Swal.fire("Error","Failed to add to cart","error");
    } finally {
      setLoading(false);
    }
  };

  const handleWishlist = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    try {
      const res = await wishlistToggle(product._id);

      setWishlisted(res.wishlisted);

      await fetchWishlistCount();

      Swal.fire({
        icon: "success",
        title: res.message,
        timer: 800,
        showConfirmButton: false,
      });

    } catch (error) {
      Swal.fire("Error","Wishlist failed","error");
    }
  };

  ////////////////////////////////////////////////////////////////
  // UI
  ////////////////////////////////////////////////////////////////
  return (
    <div className="bg-white rounded-xl shadow hover:shadow-xl transition group p-3">

      {/* IMAGE */}
      <div className="relative overflow-hidden rounded-lg bg-gray-100 h-48 flex items-center justify-center cursor-pointer">
        {firstImage ? (
          <img
            src={firstImage}
            alt={product?.name}
            onClick={() => navigate(`/product/${product._id}`)}
            className="max-h-full max-w-full object-contain transition group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <span>No Image</span>
        )}

        {/* ❤️ Wishlist */}
        <button onClick={(e) => {
          e.stopPropagation();
          handleWishlist();
        }} className="absolute top-1 right-1 bg-white p-1 rounded-full shadow cursor-pointer">
          {wishlisted ? "❤️" : "🤍"}
        </button>

        {/* 🔥 Discount Badge */}
        {discount > 0 && (
          <span className="absolute top-0 left-0 bg-red-500 text-white text-xs px-2 py-1 rounded">
            {discount}% OFF
          </span>
        )}
      </div>

      {/* DETAILS */}
      <div className="mt-3">

        <h3 className="text-sm font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
          {product.name}
        </h3>

        <p className="text-sm line-clamp-2 text-gray-500">
          {product.description}
        </p>

        {/* ⭐ Rating */}
        <div className="flex items-center text-yellow-500 text-sm mt-1">
          ⭐ {product.averageRating || 4.0}
          <span className="text-gray-400 ml-1 text-xs">
            ({product.totalReviews || 0})
          </span>
        </div>

        {/* 💰 PRICE */}
        <div className="mt-1 flex items-center gap-2">
          <span className="text-lg font-bold text-black">
            ₹{finalPrice}
          </span>

          {mrp > finalPrice && (
            <span className="text-gray-400 line-through text-sm">
              ₹{mrp}
            </span>
          )}
        </div>

        {/* 🚚 SHIPPING */}
        <p className="text-xs text-green-600 mt-1">
          {product.shippingCost === 0
            ? "Free Delivery 🚚"
            : `Delivery ₹${product.shippingCost}`}
        </p>

        {/* 🛒 BUTTON */}
        <button
          onClick={handleAddToCart}
          disabled={loading || addedToCart}
          className="mt-3 w-full bg-yellow-400 text-black py-2 rounded-lg hover:bg-yellow-500"
        >
          {loading
            ? "Adding..."
            : addedToCart
              ? "Added ✅"
              : "Add to Cart"}
        </button>

      </div>

      {/* 🔐 AUTH MODAL */}
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          type="login"
          setType={() => { }}
          openOTP={() => { }}
        />
      )}

    </div>
  );
}