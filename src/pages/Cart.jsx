import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  productDetails,
  getRelatedProducts,
} from "../services/product";
import {
  wishlistToggle,
  checkWishlist,
} from "../services/wishlist";
import { addToCart } from "../services/cart";
import ProductCard from "../components/ProductCard";
import {
  createReviews,
  getProductReviews,
} from "../services/reviews";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import AuthModal from "../components/AuthModal";
import Swal from "sweetalert2";
import ProductDetailsSkeleton from "../skeletons/ProductDetailsSkeleton";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user } = useAuth();
  const { updateCartCount } = useCart();
  const { fetchWishlistCount } = useWishlist();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);

  const [selectedImage, setSelectedImage] = useState(null);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  ////////////////////////////////////////////////////////////////
  // 🚀 FETCH ALL DATA (PARALLEL)
  ////////////////////////////////////////////////////////////////
  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);

      const [pRes, rRes, relRes] = await Promise.all([
        productDetails(id),
        getProductReviews(id),
        getRelatedProducts(id),
      ]);

      const productData = pRes || {};
      const reviewsData = rRes?.reviews || rRes || [];
      const relatedData = relRes?.products || [];

      setProduct(productData);
      setReviews(reviewsData);
      setRelatedProducts(relatedData);

      setSelectedImage(productData?.images?.[0]?.url || null);

    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  ////////////////////////////////////////////////////////////////
  // ❤️ WISHLIST CHECK
  ////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (!user || !id) return;

    const run = async () => {
      try {
        const res = await checkWishlist(id);
        setWishlisted(res?.wishlisted || false);
      } catch {}
    };

    run();
  }, [user, id]);

  ////////////////////////////////////////////////////////////////
  // 🛒 ADD TO CART
  ////////////////////////////////////////////////////////////////
  const handleAddToCart = async () => {
    if (!user) return setShowAuthModal(true);

    try {
      setActionLoading(true);

      await addToCart({
        productId: product._id,
        quantity: 1,
      });

      updateCartCount(1);

      Swal.fire({
        icon: "success",
        title: "Added to Cart",
        timer: 800,
        showConfirmButton: false,
      });

    } catch {
      Swal.fire("Error", "Add failed", "error");
    } finally {
      setActionLoading(false);
    }
  };

  ////////////////////////////////////////////////////////////////
  // ❤️ TOGGLE WISHLIST
  ////////////////////////////////////////////////////////////////
  const handleWishlist = async () => {
    if (!user) return setShowAuthModal(true);

    try {
      const res = await wishlistToggle(product._id);

      setWishlisted(res?.wishlisted);
      fetchWishlistCount();

    } catch {
      Swal.fire("Error", "Wishlist failed", "error");
    }
  };

  ////////////////////////////////////////////////////////////////
  // ⭐ REVIEW
  ////////////////////////////////////////////////////////////////
  const handleReview = async () => {
    if (!user) return setShowAuthModal(true);

    try {
      await createReviews({
        productId: id,
        rating,
        comment,
      });

      setComment("");
      setRating(5);

      fetchAll(); // refresh reviews

    } catch {
      Swal.fire("Error", "Review failed", "error");
    }
  };

  ////////////////////////////////////////////////////////////////
  // ⏳ LOADING
  ////////////////////////////////////////////////////////////////
  if (loading) return <ProductDetailsSkeleton />;

  if (!product) return <p>Product not found</p>;

  ////////////////////////////////////////////////////////////////
  // SAFE DATA
  ////////////////////////////////////////////////////////////////
  const {
    name = "Product",
    description = "",
    images = [],
    basePrice = 0,
    finalPrice = 0,
    discountPercent = 0,
    averageRating = 0,
    shippingCost = 0,
  } = product;

  ////////////////////////////////////////////////////////////////
  // UI
  ////////////////////////////////////////////////////////////////
  return (
    <div className="p-4 md:p-6">

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* IMAGES */}
        <div className="lg:col-span-2 flex gap-3">
          <div className="flex lg:flex-col gap-2">
            {images.map((img, i) => (
              <img
                key={i}
                src={img?.url}
                onMouseEnter={() => setSelectedImage(img?.url)}
                className="w-16 h-16 cursor-pointer border"
                loading="lazy"
              />
            ))}
          </div>

          <img
            src={selectedImage}
            className="h-80 object-contain w-full"
          />
        </div>

        {/* INFO */}
        <div className="lg:col-span-2">
          <h1 className="text-xl font-semibold">{name}</h1>

          <p className="text-yellow-500 mt-2">
            ⭐ {averageRating} ({reviews.length})
          </p>

          <div className="mt-4">
            <span className="line-through text-gray-400">
              ₹{basePrice}
            </span>

            <span className="text-2xl font-bold text-red-600 ml-2">
              ₹{finalPrice}
            </span>

            <span className="text-green-600 ml-2">
              {discountPercent}% OFF
            </span>
          </div>

          <p className="mt-4 text-gray-600">
            {description}
          </p>
        </div>

        {/* BUY BOX */}
        <div className="border p-4 rounded">
          <h2 className="text-xl font-bold">₹{finalPrice}</h2>

          <p className="text-green-600">
            {shippingCost === 0 ? "Free Delivery" : `₹${shippingCost}`}
          </p>

          <button
            onClick={handleAddToCart}
            disabled={actionLoading}
            className="w-full bg-yellow-400 mt-3 py-2 rounded"
          >
            {actionLoading ? "Adding..." : "Add to Cart"}
          </button>

          <button
            onClick={handleWishlist}
            className="w-full mt-2 border py-2"
          >
            {wishlisted ? "❤️ Wishlisted" : "🤍 Wishlist"}
          </button>
        </div>

      </div>

      {/* REVIEWS */}
      <div className="mt-10">
        <h2 className="font-bold mb-3">Reviews</h2>

        {reviews.map((r, i) => (
          <div key={i} className="border-b py-2">
            <p className="font-semibold">{r.user?.name}</p>
            <p>{"★".repeat(r.rating)}</p>
            <p>{r.comment}</p>
          </div>
        ))}
      </div>

      {/* RELATED */}
      <div className="mt-10">
        <h2 className="font-bold mb-3">Related</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {relatedProducts.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      </div>

      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          type="login"
        />
      )}
    </div>
  );
}