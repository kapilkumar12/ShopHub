import { useEffect,useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import { productDetails,getRelatedProducts } from "../services/product";
import { wishlistToggle,checkWishlist } from "../services/wishlist";
import { addToCart } from "../services/cart";
import ProductCard from "../components/ProductCard";
import {
  createReviews,
  getProductReviews
} from "../services/reviews";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import AuthModal from "../components/AuthModal";
import Swal from "sweetalert2";

export default function ProductDetails() {

  const { id } = useParams();
  const navigate = useNavigate();

  const { user } = useAuth();
  const { updateCartCount,fetchCartCount } = useCart();

  const [product,setProduct] = useState(null);
  const [relatedProducts,setRelatedProducts] = useState([]);
  const [reviews,setReviews] = useState([]);
  const [selectedImage,setSelectedImage] = useState(null);

  const [rating,setRating] = useState(5);
  const [hoverRating,setHoverRating] = useState(0);
  const [comment,setComment] = useState("");

  const [loading,setLoading] = useState(false);
  const [addedToCart,setAddedToCart] = useState(false);
  const [showAuthModal,setShowAuthModal] = useState(false);
  const [wishlisted,setWishlisted] = useState(false);
  const { fetchWishlistCount } = useWishlist();

  ////////////////////////////////////////////////////////////////
  // ✅ FETCH DATA
  ////////////////////////////////////////////////////////////////

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);

        const [productRes,reviewsRes,relatedRes] = await Promise.all([
          productDetails(id),
          getProductReviews(id),
          getRelatedProducts(id),
        ]);

        setProduct(productRes);
        setSelectedImage(productRes?.images?.[0]?.url);

        setReviews(reviewsRes?.reviews || reviewsRes || []);
        setRelatedProducts(relatedRes?.products || []);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  },[id]);



  ////////////////////////////////////////////////////////////////
  // ✅ CHECK WISHLIST (SAFE)
  ////////////////////////////////////////////////////////////////

  useEffect(() => {
    if (!user || !id) return;

    const check = async () => {
      try {
        const res = await checkWishlist(id);
        if (!ignore) setWishlisted(res.wishlisted);
      } catch (err) {
        console.log(err);
      }
    };

    check();

    return () => {
      ignore = true;
    };

  },[user,id]);

  ////////////////////////////////////////////////////////////////
  // 🛒 ADD TO CART
  ////////////////////////////////////////////////////////////////

  const handleAddToCart = async () => {
    if (!user) return setShowAuthModal(true);

    try {
      setLoading(true);

      await addToCart({
        productId: id,
        quantity: 1,
      });

      // updateCartCount(1);
      await fetchCartCount();

      setAddedToCart(true);

      Swal.fire({
        icon: "success",
        title: "Added to Cart 🛒",
        timer: 1000,
        showConfirmButton: false,
      });

      navigate("/cart");

    } catch {
      Swal.fire("Error","Failed to add to cart","error");
    } finally {
      setLoading(false);
    }
  };

  ////////////////////////////////////////////////////////////////
  // ❤️ WISHLIST (REUSED API)
  ////////////////////////////////////////////////////////////////

  const handleWishlist = async () => {
    if (!user) return setShowAuthModal(true);

    try {
      const res = await wishlistToggle(id);
      setWishlisted(res.wishlisted);

      await fetchWishlistCount();

    } catch {
      Swal.fire("Error","Wishlist failed","error");
    }
  };

  ////////////////////////////////////////////////////////////////
  // ⭐ REVIEW
  ////////////////////////////////////////////////////////////////

  const handleAddReview = async () => {

    if (!user) return setShowAuthModal(true);

    try {

      await createReviews({ productId: id,rating,comment });
      setComment("");
      setRating(5);

      const res = await getProductReviews(id);
      setReviews(res?.reviews || res || []);

    } catch (error) {
      Swal.fire("Error","Failed to add review","error");
    }

  };


  ////////////////////////////////////////////////////////////////
  // ✅ IMPORTANT: AFTER ALL HOOKS
  ////////////////////////////////////////////////////////////////

  if (!product) return <div>Loading...</div>;

  const mrp = product.basePrice || 0;
  const finalPrice = product.finalPrice || 0;
  const discount = product.discountPercent || 0;


  ////////////////////////////////////////////////////////////////
  return (
    <div className="p-4 md:p-6">

      {/* 🔥 GRID FIX (IMPORTANT) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* LEFT IMAGE SECTION */}
        <div className="lg:col-span-2 flex flex-col lg:flex-row gap-4">

          {/* THUMBNAILS */}
          <div className="flex order-2 lg:order-1 lg:flex-col gap-2 overflow-x-auto">
            {product.images?.map((img,i) => (
              <img
                key={i}
                src={img.url}
                onMouseEnter={() => setSelectedImage(img.url)}
                className="w-16 h-16 border cursor-pointer"
                loading="lazy"
              />
            ))}
          </div>

          {/* MAIN IMAGE */}
          <div className="order-1 lg:order-2 bg-gray-100 h-87.5 flex items-center justify-center">
            <img src={selectedImage} className="max-h-full" loading="lazy" />
          </div>
        </div>

        {/* CENTER INFO */}
        <div className="lg:col-span-2">

          <h1 className="text-xl font-semibold">{product.name}</h1>

          <div className="text-yellow-500 mt-2">
            ⭐ {product.averageRating || 4.2} ({reviews.length})
          </div>

          {/* PRICE */}
          <div className="mt-4">
            <div className="line-through text-gray-400">₹{mrp}</div>
            <div className="text-3xl font-bold text-red-600">₹{finalPrice}</div>
            <div className="text-green-600">
              {product.discountPercent}% OFF
            </div>
          </div>

          <p className="mt-4 text-gray-600">
            {product.description}
          </p>

        </div>

        {/* 🔥 RIGHT BUY BOX FIX */}
        <div className="lg:col-span-1">
          <div className="border p-4 rounded shadow sticky top-6">

            <h2 className="text-2xl font-bold">₹{finalPrice}</h2>

            <p className="text-green-600">
              Delivery Charge {product.shippingCost === 0
                ? "FREE Delivery"
                : `₹${product.shippingCost}`}
            </p>

            <button
              onClick={handleAddToCart}
              disabled={loading || addedToCart}
              className="w-full bg-yellow-400 mt-4 py-2 rounded"
            >
              {loading
                ? "Adding..."
                : addedToCart
                  ? "Added ✅"
                  : "Add to Cart"}
            </button>

            <button onClick={handleCheckout} className="w-full bg-orange-500 text-white mt-2 py-2 rounded">
              Buy Now
            </button>

            <button onClick={handleWishlist} className="w-full mt-2 border py-2">
              {wishlisted ? "❤️" : "🤍"} Wishlist
            </button>

          </div>
        </div>

      </div>

      {/* ⭐ RATING INPUT (NEW) */}
      <div className="mt-6">
        <h3 className="font-semibold mb-2">Rate this product</h3>

        <div className="flex gap-1 text-2xl cursor-pointer">
          {[1,2,3,4,5].map((star) => (
            <span
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className={
                (hoverRating || rating) >= star
                  ? "text-yellow-500"
                  : "text-gray-300"
              }
            >
              ★
            </span>
          ))}
        </div>
      </div>

      {/* REVIEW INPUT */}
      <div className="mt-4">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full border p-2 rounded-md bg-gray-50"
          placeholder="Write review..."
        />
        <button
          onClick={handleAddReview}
          className="mt-2 bg-blue-500 text-white px-4 py-2"
        >
          Submit Review
        </button>
      </div>

      {/* REVIEWS */}
      <div className="mt-10">
        <h2 className="text-lg font-bold mb-4">
          Customer Reviews
        </h2>

        {reviews.map((r,i) => {
          const userName = r.user?.name || "Anonymous";
          const avatar =
            r.user?.profilePic ||
            `https://ui-avatars.com/api/?name=${userName}`;

          return (
            <div key={i} className="border-b py-4 flex gap-3">
              <img src={avatar} className="w-10 h-10 rounded-full" loading="lazy" />

              <div>
                <p className="font-semibold text-sm">{userName}</p>
                <div className="text-yellow-500 text-xs">
                  {"★".repeat(r.rating)}
                </div>
                <p className="text-sm">{r.comment}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* RELATED PRODUCTS */}
      <div className="mt-10">
        <h2 className="text-lg font-bold mb-4">
          Related Products
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {relatedProducts.length > 0 ? (
            relatedProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))
          ) : (
            <p>No related products</p>
          )}
        </div>
      </div>
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