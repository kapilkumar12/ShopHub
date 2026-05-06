import { useEffect, useState } from "react";
import { getWishlist, wishlistToggle } from "../services/wishlist";
import { addToCart } from "../services/cart";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import ProductCardSkeleton from "../skeletons/ProductCardSkeleton";
import Swal from "sweetalert2";

export default function Wishlist() {
  const { user } = useAuth();
  const { fetchWishlistCount } = useWishlist();
  const { updateCartCount, fetchCartCount } = useCart();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH =================
  useEffect(() => {
    if (!user?._id) return;

    const fetch = async () => {
      try {
        const res = await getWishlist();
        setProducts(res?.products || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [user]);

  // ================= REMOVE =================
  const remove = async (id) => {
    try {
      await wishlistToggle(id);

      setProducts((p) => p.filter((x) => x?._id !== id));
      await fetchWishlistCount();

    } catch {
      Swal.fire("Error", "Failed", "error");
    }
  };

  // ================= ADD CART =================
  const addCart = async (product) => {
    if (!user) return Swal.fire("Login required");

    try {
      await addToCart({ productId: product?._id, quantity: 1 });

      updateCartCount(1);
      await fetchCartCount();

      await wishlistToggle(product?._id);
      setProducts((p) => p.filter((x) => x?._id !== product?._id));

      await fetchWishlistCount();

      navigate("/cart");
    } catch {
      Swal.fire("Error", "Cart failed", "error");
    }
  };

  if (!user) return <p>Login required</p>;
  if (loading) return <ProductCardSkeleton />;
  if (!products?.length) return <p>No wishlist items</p>;

  return (
    <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
      {products?.map((p) =>
        p ? (
          <ProductCard key={p._id} product={p} />
        ) : null
      )}
    </div>
  );
}