import { useEffect,useState } from "react";
import { getWishlist,wishlistToggle } from "../services/wishlist";
import { addToCart } from "../services/cart";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext"; // ✅ NEW
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import Swal from "sweetalert2";
import ProductCardSkeleton from "../skeletons/ProductCardSkeleton";

export default function Wishlist() {

  const [products,setProducts] = useState([]);
  const [loading,setLoading] = useState(true);

  const { user } = useAuth();
  const { updateCartCount,fetchCartCount } = useCart();
  const { fetchWishlistCount } = useWishlist(); // ✅ NEW

  const navigate = useNavigate();

  ////////////////////////////////////////////////////////////////
  // FETCH WISHLIST
  ////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (!user) return;

    fetchWishlist();
  },[user]);

  const fetchWishlist = async () => {
    try {
      const res = await getWishlist();
      const products =
        res?.products ||
        res?.data?.products ||
        res?.payload?.products ||
        [];

      setProducts(products);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  ////////////////////////////////////////////////////////////////
  // REMOVE FROM WISHLIST
  ////////////////////////////////////////////////////////////////
  const handleRemove = async (productId) => {
    try {
      await wishlistToggle(productId);

      // 🔥 UI update
      setProducts((prev) =>
        prev.filter((p) => p._id !== productId)
      );

      // 🔥 Navbar count sync
      await fetchWishlistCount();

      Swal.fire({
        icon: "success",
        title: "Removed from Wishlist",
        timer: 800,
        showConfirmButton: false,
      });

    } catch {
      Swal.fire("Error","Failed to remove","error");
    }
  };

  ////////////////////////////////////////////////////////////////
  // ADD TO CART + REMOVE FROM WISHLIST
  ////////////////////////////////////////////////////////////////
  const handleAddToCart = async (product) => {
    if (!user) {
      Swal.fire("Login Required");
      return;
    }

    try {
      // 🛒 Add to cart
      await addToCart({
        productId: product._id,
        quantity: 1,
      });

      updateCartCount(1);
      await fetchCartCount();

      // ❤️ Remove from wishlist (AUTO)
      await wishlistToggle(product._id);

      setProducts((prev) =>
        prev.filter((p) => p._id !== product._id)
      );

      // 🔥 update wishlist count
      await fetchWishlistCount();

      Swal.fire({
        icon: "success",
        title: "Added to Cart 🛒",
        timer: 800,
        showConfirmButton: false,
      });

      navigate("/cart");

    } catch {
      Swal.fire("Error","Failed to add to cart","error");
    }
  };

  ////////////////////////////////////////////////////////////////
  // UI STATES
  ////////////////////////////////////////////////////////////////
  if (!user) {
    return <p className="text-center mt-10">Login Required</p>;
  }

if (loading) {
    return (
      <div className="p-4 md:p-6 grid grid-cols-2 md:grid-cols-4 gap-5">
        <ProductCardSkeleton count={8} />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-xl font-semibold">
          ❤️ Your Wishlist is Empty
        </h2>

        <button
          onClick={() => navigate("/products")}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
         Explore Products
        </button>
      </div>
    );
  }

  ////////////////////////////////////////////////////////////////
  // UI
  ////////////////////////////////////////////////////////////////
  return (
    <div className="p-4 md:p-6">

      <h1 className="text-2xl font-bold mb-6">
        ❤️ My Wishlist
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

        {products.map((p) => (
         <ProductCard
            key={p._id}
            product={p}
            showWishlistActions={true}
            onRemove={() => handleRemove(p._id)}
            onAddToCart={() => handleAddToCart(p)}
          />
        ))}

      </div>

    </div>
  );
}