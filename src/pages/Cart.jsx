import { useEffect, useState, useCallback } from "react";
import {
  getCart,
  updateCartItem,
  removeFromCart,
} from "../services/cart";
import { getRelatedProducts } from "../services/product";
import ProductCard from "../components/ProductCard";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import CartSkeleton from "../skeletons/CartSkeleton";

export default function Cart() {

  const [cart, setCart] = useState([]);
  const [summary, setSummary] = useState({
    subtotal: 0,
    gst: 0,
    total: 0,
  });

  const [relatedProducts, setRelatedProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const { user } = useAuth();
  const { updateCartCount } = useCart();

  const navigate = useNavigate();

  ////////////////////////////////////////////////////////////////
  // 🧠 CALCULATE SUMMARY (SINGLE SOURCE)
  ////////////////////////////////////////////////////////////////
  const calculateSummary = (items) => {
    let subtotal = 0;
    let gst = 0;

    items.forEach((item) => {
      const price = item.pricing || {};

      subtotal += (price.sellingPrice || 0) * item.quantity;
      gst += (price.gstAmount || 0) * item.quantity;
    });

    return {
      subtotal,
      gst,
      total: subtotal + gst,
    };
  };

  ////////////////////////////////////////////////////////////////
  // 🚀 FETCH CART
  ////////////////////////////////////////////////////////////////
  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);

      const res = await getCart();

      const items = res?.items || [];

      setCart(items);
      setSummary(calculateSummary(items));
      updateCartCount(items);

      // 👉 only once
      if (items[0]?.product?._id) {
        fetchRelated(items[0].product._id);
      }

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  ////////////////////////////////////////////////////////////////
  // 🔥 RELATED PRODUCTS
  ////////////////////////////////////////////////////////////////
  const fetchRelated = async (id) => {
    try {
      const res = await getRelatedProducts(id);
      setRelatedProducts(res?.products || []);
    } catch {}
  };

  ////////////////////////////////////////////////////////////////
  // 🔥 UPDATE QUANTITY (OPTIMISTIC)
  ////////////////////////////////////////////////////////////////
  const handleQuantity = async (productId, newQty) => {
    if (newQty < 1) return;

    setUpdatingId(productId);

    // 🔥 optimistic update
    let updatedCart;

    setCart((prev) => {
      updatedCart = prev.map((item) =>
        item.product._id === productId
          ? { ...item, quantity: newQty }
          : item
      );

      setSummary(calculateSummary(updatedCart));
      updateCartCount(updatedCart);

      return updatedCart;
    });

    try {
      await updateCartItem(productId, newQty);
    } catch (err) {
      console.error(err);
      fetchCart(); // rollback
    } finally {
      setUpdatingId(null);
    }
  };

  ////////////////////////////////////////////////////////////////
  // ❌ REMOVE ITEM
  ////////////////////////////////////////////////////////////////
  const handleRemove = async (productId) => {
    const result = await Swal.fire({
      title: "Remove item?",
      icon: "warning",
      showCancelButton: true,
    });

    if (!result.isConfirmed) return;

    try {
      const updated = cart.filter(
        (item) => item.product._id !== productId
      );

      setCart(updated);
      setSummary(calculateSummary(updated));
      updateCartCount(updated);

      await removeFromCart(productId);

    } catch (err) {
      console.error(err);
      fetchCart(); // rollback
    }
  };

  ////////////////////////////////////////////////////////////////
  // 🧾 CHECKOUT
  ////////////////////////////////////////////////////////////////
  const handleCheckout = () => {
    if (!user) return Swal.fire("Login Required");
    if (cart.length === 0) return Swal.fire("Cart Empty");

    navigate("/checkout");
  };

  ////////////////////////////////////////////////////////////////
  // UI STATES
  ////////////////////////////////////////////////////////////////
  if (loading) return <CartSkeleton />;

  if (cart.length === 0) {
    return <p className="text-center mt-10">🛒 Cart is empty</p>;
  }

  ////////////////////////////////////////////////////////////////
  // UI
  ////////////////////////////////////////////////////////////////
  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto grid lg:grid-cols-3 gap-6">

      {/* LEFT */}
      <div className="lg:col-span-2 space-y-4">

        {cart.map((item) => {
          const p = item.product || {};
          const price = item.pricing || {};

          return (
            <div
              key={p._id}
              className="flex justify-between bg-white p-4 rounded-xl shadow"
            >

              {/* PRODUCT */}
              <div className="flex gap-4">
                <img
                  src={p.images?.[0]?.url}
                  className="w-24 h-24 object-cover rounded"
                />

                <div>
                  <h3 className="font-semibold">{p.name}</h3>

                  <p className="text-sm text-gray-500">
                    ₹{price.sellingPrice}
                  </p>

                  <p className="text-xs">
                    GST: ₹{price.gstAmount}
                  </p>
                </div>
              </div>

              {/* QTY */}
              <div className="flex items-center gap-2">
                <button
                  disabled={updatingId === p._id}
                  onClick={() =>
                    handleQuantity(p._id, item.quantity - 1)
                  }
                >
                  -
                </button>

                <span>{item.quantity}</span>

                <button
                  disabled={updatingId === p._id}
                  onClick={() =>
                    handleQuantity(p._id, item.quantity + 1)
                  }
                >
                  +
                </button>
              </div>

              {/* TOTAL */}
              <div className="text-right">
                <p className="font-bold">
                  ₹{price.finalPrice * item.quantity}
                </p>

                <button
                  onClick={() => handleRemove(p._id)}
                  className="text-red-500 text-sm"
                >
                  Remove
                </button>
              </div>

            </div>
          );
        })}

      </div>

      {/* RIGHT */}
      <div className="bg-white p-4 rounded-xl shadow h-fit">

        <h3 className="font-bold mb-3">Order Summary</h3>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{summary.subtotal}</span>
          </div>

          <div className="flex justify-between">
            <span>GST</span>
            <span>₹{summary.gst}</span>
          </div>

          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Total</span>
            <span>₹{summary.total}</span>
          </div>
        </div>

        <button
          onClick={handleCheckout}
          className="w-full mt-4 bg-green-600 text-white py-2 rounded"
        >
          Checkout
        </button>

      </div>

      {/* RELATED */}
      <div className="lg:col-span-3 mt-10">
        <h2 className="text-xl font-bold mb-4">
          You might also like
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {relatedProducts.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      </div>

    </div>
  );
}