import { useEffect,useState } from "react";
import { createOrder } from "../services/order";
import { getCart } from "../services/cart";
import { useNavigate,useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Swal from "sweetalert2";

export default function Checkout() {

  const location = useLocation();
  const directBuyData = location.state;

  const [cart,setCart] = useState([]);
  const [summary,setSummary] = useState({});
  const [loading,setLoading] = useState(true);
  const [paymentMethod,setPaymentMethod] = useState("cod");
  const [placingOrder,setPlacingOrder] = useState(false);

  const safe = (v) => v ?? 0;

  const { fetchCartCount } = useCart();
  const navigate = useNavigate();


  ////////////////////////////////////////////////////////////////
  // FORM STATE
  ////////////////////////////////////////////////////////////////
  const [form,setForm] = useState({
    name: "",
    address: "",
    city: "",
    pincode: "",
    phone: ""
  });

  ////////////////////////////////////////////////////////////////
  // 🔥 FETCH CART OR DIRECT BUY
  ////////////////////////////////////////////////////////////////
  useEffect(() => {

    if (directBuyData?.directBuy) {

      const p = directBuyData.product;

      const item = {
        product: {
          name: p.name,
          images: [{ url: p.images?.[0]?.url }]
        },
        quantity: p.quantity || 1,
        pricing: {
          finalPrice: p.finalPrice
        }
      };

      setCart([item]);

      setSummary({
        subtotal: p.sellingPrice || p.basePrice || 0,
        gstAmount: p.gstAmount || 0,
        shippingCost: p.shippingCost || 0,
        total: p.finalPrice || 0
      });

      setLoading(false);

    } else {
      fetchCart();
    }

  },[]);

  ////////////////////////////////////////////////////////////////
  const fetchCart = async () => {
    try {
      const res = await getCart();

      setCart(res?.items || []);
      setSummary(res?.summary || {});

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  ////////////////////////////////////////////////////////////////
  // INPUT
  ////////////////////////////////////////////////////////////////
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  ////////////////////////////////////////////////////////////////
  // VALIDATION
  ////////////////////////////////////////////////////////////////
  const validateForm = () => {
    if (
      !form.name ||
      !form.address ||
      !form.city ||
      !form.pincode ||
      !form.phone
    ) {
      Swal.fire("Missing Fields","Fill all details","error");
      return false;
    }

    if (form.phone.length < 10) {
      Swal.fire("Invalid Phone","Enter valid phone","error");
      return false;
    }

    return true;
  };

  ////////////////////////////////////////////////////////////////
  // PLACE ORDER
  ////////////////////////////////////////////////////////////////
  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    try {
      setPlacingOrder(true);

      const orderData = {
        address: `${form.name}, ${form.address}, ${form.city} - ${form.pincode}`,
        phone: form.phone,
        paymentMethod,

        // 🔥 IMPORTANT: SEND DIRECT PRODUCT IF BUY NOW
        ...(directBuyData?.directBuy && {
          directProduct: directBuyData.product._id
        })
      };

      await createOrder(orderData);

      await fetchCartCount();

      Swal.fire({
        icon: "success",
        title: "Order Placed 🎉",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/orders");

    } catch (error) {
      Swal.fire("Error","Order failed","error");
    } finally {
      setPlacingOrder(false);
    }
  };

  ////////////////////////////////////////////////////////////////
  // LOADING / EMPTY
  ////////////////////////////////////////////////////////////////
  if (loading) return <p className="text-center mt-10">Loading...</p>;

  // ❗ FIX: only for cart flow
  if (!directBuyData?.directBuy && cart.length === 0) {
    return <p className="text-center mt-10">Cart Empty</p>;
  }

  ////////////////////////////////////////////////////////////////
  // UI (UNCHANGED)
  ////////////////////////////////////////////////////////////////
  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-8">

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">

        {/* ================= LEFT FORM ================= */}
        <div className="bg-white p-6 rounded-2xl shadow-xl">

          <h2 className="text-2xl font-bold mb-6">
            🚚 Shipping Details
          </h2>

          <div className="grid gap-4">

            <input
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              className="input"
            />

            <input
              name="phone"
              placeholder="Phone Number"
              onChange={handleChange}
              className="input"
            />

            <textarea
              name="address"
              placeholder="Full Address"
              onChange={handleChange}
              className="input"
            />

            <div className="grid grid-cols-2 gap-3">
              <input
                name="city"
                placeholder="City"
                onChange={handleChange}
                className="input"
              />

              <input
                name="pincode"
                placeholder="Pincode"
                onChange={handleChange}
                className="input"
              />
            </div>
          </div>

          {/* PAYMENT */}
          <div className="mt-6">
            <h3 className="font-semibold mb-3">Payment Method</h3>

            <div className="space-y-3">

              <label className={`payment-box ${paymentMethod === "cod" && "active"}`}>
                <input
                  type="radio"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                />
                Cash on Delivery
              </label>

              <label className={`payment-box ${paymentMethod === "online" && "active"}`}>
                <input
                  type="radio"
                  checked={paymentMethod === "online"}
                  onChange={() => setPaymentMethod("online")}
                />
                Online Payment
              </label>

            </div>
          </div>

        </div>

        {/* ================= RIGHT SUMMARY ================= */}
        <div className="bg-white p-6 rounded-2xl shadow-xl h-fit sticky top-6">

          <h2 className="text-xl font-bold mb-4">
            🧾 Order Summary
          </h2>

          {/* PRODUCTS */}
          <div className="space-y-4 max-h-64 overflow-y-auto pr-2">

            {cart.map((item,index) => {
              const p = item.product || {};
              const price = item.pricing || {};

              return (
                <div key={index} className="flex gap-3 items-center">

                  <img
                    src={p.images?.[0]?.url}
                    className="w-16 h-16 object-cover rounded"
                    alt={p.name}
                  />

                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {p.name || item.name || "Product"}
                    </p>

                    <p className="text-xs text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <div className="text-sm font-semibold">
                    ₹{Math.round((price.finalPrice || item.price || 0) * item.quantity)}
                  </div>

                </div>
              );
            })}

          </div>

          <hr className="my-4" />

          {/* SUMMARY */}
          <div className="space-y-2 text-sm">

            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{Math.round(summary?.subtotal || 0)}</span>
            </div>

            <div className="flex justify-between">
              <span>GST</span>
              <span>₹{Math.round(safe(summary?.gstAmount || 0))}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span>
                {safe(summary?.shippingCost) === 0
                  ? "Free"
                  : `₹${safe(summary?.shippingCost)}`}
              </span>
            </div>

            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total</span>
              <span>₹{Math.round(safe(summary?.total))}</span>
            </div>

          </div>

          {/* BUTTON */}
          <button
            onClick={handlePlaceOrder}
            disabled={placingOrder}
            className="mt-5 w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition"
          >
            {placingOrder ? "Placing Order..." : "Place Order"}
          </button>

        </div>

      </div>

      {/* STYLES */}
      <style>
        {`
        .input {
          width: 100%;
          border: 1px solid #ddd;
          padding: 12px;
          border-radius: 10px;
        }

        .payment-box {
          display: flex;
          gap: 10px;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 10px;
          cursor: pointer;
        }

        .payment-box.active {
          border-color: #16a34a;
          background: #f0fdf4;
        }
        `}
      </style>

    </div>
  );
}