import { useEffect, useState, useMemo } from "react";
import { createOrder } from "../services/order";
import { getCart } from "../services/cart";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Swal from "sweetalert2";
import CheckoutSkeleton from "../skeletons/CheckoutSkeleton";

export default function Checkout() {

  const { state } = useLocation();
  const isDirectBuy = state?.directBuy;

  const [cart, setCart] = useState([]);
  const [summary, setSummary] = useState(null);

  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState("cod");

  const { fetchCartCount } = useCart();
  const navigate = useNavigate();

  ////////////////////////////////////////////////////////////////
  // FORM STATE
  ////////////////////////////////////////////////////////////////
  const [form, setForm] = useState({
    name: "",
    address: "",
    city: "",
    pincode: "",
    phone: "",
  });

  ////////////////////////////////////////////////////////////////
  // 🚀 INIT DATA
  ////////////////////////////////////////////////////////////////
  useEffect(() => {

    if (isDirectBuy) {
      const p = state.product;

      const item = {
        product: {
          name: p.name,
          images: [{ url: p.images?.[0]?.url }],
        },
        quantity: p.quantity || 1,
        pricing: {
          finalPrice: p.finalPrice,
        },
      };

      setCart([item]);

      setSummary({
        subtotal: p.sellingPrice || 0,
        gst: p.gstAmount || 0,
        shipping: p.shippingCost || 0,
        total: p.finalPrice || 0,
      });

      setLoading(false);
    } else {
      fetchCart();
    }

  }, []);

  ////////////////////////////////////////////////////////////////
  // 🛒 FETCH CART
  ////////////////////////////////////////////////////////////////
  const fetchCart = async () => {
    try {
      const res = await getCart();

      setCart(res?.items || []);
      setSummary(res?.summary || null);

    } catch (err) {
      Swal.fire("Error", "Failed to load cart", "error");
    } finally {
      setLoading(false);
    }
  };

  ////////////////////////////////////////////////////////////////
  // INPUT
  ////////////////////////////////////////////////////////////////
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  ////////////////////////////////////////////////////////////////
  // ✅ VALIDATION (PRO LEVEL)
  ////////////////////////////////////////////////////////////////
  const validateForm = () => {
    const { name, address, city, pincode, phone } = form;

    if (!name.trim() || !address.trim() || !city.trim()) {
      Swal.fire("Missing Fields", "Fill all details", "error");
      return false;
    }

    if (!/^[0-9]{6}$/.test(pincode)) {
      Swal.fire("Invalid Pincode", "Enter valid 6-digit pincode", "error");
      return false;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      Swal.fire("Invalid Phone", "Enter valid 10-digit phone", "error");
      return false;
    }

    return true;
  };

  ////////////////////////////////////////////////////////////////
  // 💰 PLACE ORDER
  ////////////////////////////////////////////////////////////////
  const handlePlaceOrder = async () => {

    if (!validateForm()) return;

    try {
      setPlacingOrder(true);

      const payload = {
        address: `${form.name}, ${form.address}, ${form.city} - ${form.pincode}`,
        phone: form.phone,
        paymentMethod,
      };

      if (isDirectBuy) {
        payload.directProduct = state.product._id;
      }

      await createOrder(payload);

      await fetchCartCount();

      Swal.fire({
        icon: "success",
        title: "Order Placed 🎉",
        timer: 1200,
        showConfirmButton: false,
      });

      navigate("/orders");

    } catch (error) {
      Swal.fire("Error", error?.message || "Order failed", "error");
    } finally {
      setPlacingOrder(false);
    }
  };

  ////////////////////////////////////////////////////////////////
  // SAFE SUMMARY
  ////////////////////////////////////////////////////////////////
  const safeSummary = useMemo(() => ({
    subtotal: summary?.subtotal || 0,
    gst: summary?.gst || summary?.gstAmount || 0,
    shipping: summary?.shipping || summary?.shippingCost || 0,
    total: summary?.total || 0,
  }), [summary]);

  ////////////////////////////////////////////////////////////////
  // UI STATES
  ////////////////////////////////////////////////////////////////
  if (loading) return <CheckoutSkeleton />;

  if (!isDirectBuy && cart.length === 0) {
    return <p className="text-center mt-10">Cart Empty</p>;
  }

  ////////////////////////////////////////////////////////////////
  // UI
  ////////////////////////////////////////////////////////////////
  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-8">

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">

        {/* LEFT FORM */}
        <div className="bg-white p-6 rounded-xl shadow">

          <h2 className="text-xl font-bold mb-4">
            Shipping Details
          </h2>

          <div className="space-y-3">

            <input name="name" placeholder="Full Name" onChange={handleChange} className="input" />
            <input name="phone" placeholder="Phone" onChange={handleChange} className="input" />
            <textarea name="address" placeholder="Address" onChange={handleChange} className="input" />

            <div className="grid grid-cols-2 gap-2">
              <input name="city" placeholder="City" onChange={handleChange} className="input" />
              <input name="pincode" placeholder="Pincode" onChange={handleChange} className="input" />
            </div>

          </div>

          {/* PAYMENT */}
          <div className="mt-5">
            <h3 className="font-semibold mb-2">Payment</h3>

            <label className="block">
              <input type="radio" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} />
              COD
            </label>

            <label className="block">
              <input type="radio" checked={paymentMethod === "online"} onChange={() => setPaymentMethod("online")} />
              Online (Coming Soon)
            </label>
          </div>

        </div>

        {/* RIGHT SUMMARY */}
        <div className="bg-white p-6 rounded-xl shadow h-fit">

          <h2 className="font-bold mb-3">Order Summary</h2>

          <div className="space-y-2 text-sm">

            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{safeSummary.subtotal}</span>
            </div>

            <div className="flex justify-between">
              <span>GST</span>
              <span>₹{safeSummary.gst}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span>
                {safeSummary.shipping === 0 ? "Free" : `₹${safeSummary.shipping}`}
              </span>
            </div>

            <div className="flex justify-between font-bold border-t pt-2">
              <span>Total</span>
              <span>₹{safeSummary.total}</span>
            </div>

          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={placingOrder}
            className="mt-4 w-full bg-green-600 text-white py-2 rounded"
          >
            {placingOrder ? "Placing..." : "Place Order"}
          </button>

        </div>

      </div>

      {/* STYLE */}
      <style>
        {`
          .input {
            width: 100%;
            border: 1px solid #ddd;
            padding: 10px;
            border-radius: 8px;
          }
        `}
      </style>

    </div>
  );
}