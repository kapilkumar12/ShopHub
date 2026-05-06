import { useEffect, useState } from "react";
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

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [summary, setSummary] = useState({
    subtotal: 0,
    gst: 0,
    total: 0,
  });
  const [relatedProducts, setRelatedProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState(null);

  const { user } = useAuth();
  const { updateCartCount } = useCart();

  const navigate = useNavigate();

  ////////////////////////////////////////////////////////////////
  // 🔥 FETCH CART
  ////////////////////////////////////////////////////////////////
  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await getCart();

      const items = res?.items || [];
      setCart(items);

      updateSummary(items);
      updateCartCount(items); // 🔥 navbar sync

      if (items.length > 0) {
        fetchRelated(items[0]?.product?._id);
      }

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  ////////////////////////////////////////////////////////////////
  // 🔥 RELATED PRODUCTS
  ////////////////////////////////////////////////////////////////
  const fetchRelated = async (id) => {
    try {
      const res = await getRelatedProducts(id);
      setRelatedProducts(res?.products || res || []);
    } catch (err) {
      console.log("Related fetch failed");
    }
  };

  ////////////////////////////////////////////////////////////////
  // 🔥 SUMMARY CALCULATION
  ////////////////////////////////////////////////////////////////
  const updateSummary = (items) => {
    let subtotal = 0;
    let gst = 0;

    items.forEach((item) => {
      const price = item.pricing || {};

      subtotal += (price.sellingPrice || 0) * item.quantity;
      gst += (price.gstAmount || 0) * item.quantity;
    });

    setSummary({
      subtotal,
      gst,
      total: subtotal + gst,
    });
  };

  ////////////////////////////////////////////////////////////////
  // 🔥 QUANTITY UPDATE (LIVE)
  ////////////////////////////////////////////////////////////////
  const handleQuantity = async (productId, quantity) => {
    if (quantity < 1) return;

    try {
      setLoadingId(productId);

      await updateCartItem(productId, quantity);

      setCart((prev) => {
        const updated = prev.map((item) => {
          if (item.product._id === productId) {
            return {
              ...item,
              quantity,
              total: item.pricing.finalPrice * quantity,
            };
          }
          return item;
        });

        updateSummary(updated);
        updateCartCount(updated);

        return updated;
      });

    } catch (err) {
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  };

  ////////////////////////////////////////////////////////////////
  // 🔥 REMOVE ITEM
  ////////////////////////////////////////////////////////////////
  const handleRemove = async (productId) => {
    const result = await Swal.fire({
      title: "Remove item?",
      icon: "warning",
      showCancelButton: true,
    });

    if (!result.isConfirmed) return;

    try {
      await removeFromCart(productId);

      setCart((prev) => {
        const updated = prev.filter(
          (item) => item.product._id !== productId
        );

        updateSummary(updated);
        updateCartCount(updated);

        return updated;
      });

      Swal.fire({
        icon: "success",
        title: "Removed",
        timer: 1000,
        showConfirmButton: false,
      });

    } catch (err) {
      console.error(err);
    }
  };

  ////////////////////////////////////////////////////////////////
  // 🔥 CHECKOUT
  ////////////////////////////////////////////////////////////////
  const handleCheckout = () => {
    if (!user) {
      Swal.fire("Login Required");
      return;
    }

    if (cart.length === 0) {
      Swal.fire("Cart empty");
      return;
    }

    navigate("/checkout");
  };

  ////////////////////////////////////////////////////////////////
  // UI STATES
  ////////////////////////////////////////////////////////////////
  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  if (cart.length === 0) {
    return <p className="text-center mt-10">🛒 Cart is empty</p>;
  }

  ////////////////////////////////////////////////////////////////
  // UI
  ////////////////////////////////////////////////////////////////
  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* ================= LEFT ================= */}
      <div className="lg:col-span-2 space-y-4">
        {cart.map((item) => {
          const p = item.product;
          const price = item.pricing || {};

          return (
            <div
              key={p._id}
              className="flex flex-col md:flex-row justify-between bg-white p-4 rounded-xl shadow gap-4"
            >

              {/* PRODUCT */}
              <div className="flex gap-4">
                <img
                  src={p.images?.[0]?.url}
                  className="w-24 h-24 object-cover rounded"
                  loading="lazy"
                />

                <div>
                  <h3 className="font-semibold">{p.name}</h3>

                  <div className="text-sm mt-1">
                    <span className="line-through text-gray-400 mr-2">
                     ₹{Math.round(price.mrp || 0)}
                    </span>

                    <span className="text-red-600 font-bold">
                      ₹{Math.round(price.sellingPrice || 0)}
                    </span>

                    <span className="text-green-600 ml-2 text-xs">
                      {price.discount || 0}% OFF
                    </span>
                  </div>

                  <p className="text-xs text-gray-500">
                    GST: ₹{Math.round(price.gstAmount || 0)}
                  </p>

                  <p className="text-xs font-semibold">
                    Final: ₹{Math.round(price.finalPrice || 0)}
                  </p>
                </div>
              </div>

              {/* QUANTITY */}
              <div className="flex items-center gap-2">
                <button
                  disabled={loadingId === p._id}
                  onClick={() =>
                    handleQuantity(p._id, item.quantity - 1)
                  }
                  className="px-3 py-1 bg-gray-200 rounded"
                >
                  -
                </button>

                <span>{item.quantity}</span>

                <button
                  disabled={loadingId === p._id}
                  onClick={() =>
                    handleQuantity(p._id, item.quantity + 1)
                  }
                  className="px-3 py-1 bg-gray-200 rounded"
                >
                  +
                </button>
              </div>

              {/* TOTAL */}
              <div className="flex flex-col items-end gap-2">
                <span className="font-bold">
                  ₹{Math.round(item.total || price.finalPrice * item.quantity)}
                </span>

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

      {/* ================= RIGHT ================= */}
      <div className="bg-white p-4 rounded-xl shadow h-fit sticky top-6">
        <h3 className="text-lg font-bold mb-3">
          Order Summary
        </h3>

        <div className="text-sm space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{Math.round(summary.subtotal)}</span>
          </div>

          <div className="flex justify-between">
            <span>GST</span>
            <span>₹{Math.round(summary.gst)}</span>
          </div>

          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Total</span>
            <span>₹{Math.round(summary.total)}</span>
          </div>
        </div>

        <button
          onClick={handleCheckout}
          className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg"
        >
          Proceed to Checkout
        </button>
      </div>

      {/* ================= RELATED ================= */}
      <div className="lg:col-span-3 mt-10">
        <h2 className="text-xl font-bold mb-4">
          You might also like
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {relatedProducts?.length > 0 ? (
            relatedProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))
          ) : (
            <p>No related products</p>
          )}
        </div>
      </div>

    </div>
  );
}