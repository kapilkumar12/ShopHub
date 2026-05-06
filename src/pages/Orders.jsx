import { useEffect, useState, useMemo } from "react";
import { getOrders } from "../services/order";
import { useNavigate } from "react-router-dom";
import OrdersSkeleton from "../skeletons/OrdersSkeleton";

export default function Orders() {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  ////////////////////////////////////////////////////////////////
  // 🚀 FETCH ORDERS
  ////////////////////////////////////////////////////////////////
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await getOrders();
      setOrders(res?.orders || []);
    } catch (err) {
      console.error("Orders fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  ////////////////////////////////////////////////////////////////
  // 🎨 STATUS COLOR
  ////////////////////////////////////////////////////////////////
  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "shipped":
        return "bg-blue-100 text-blue-700";
      case "delivered":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  ////////////////////////////////////////////////////////////////
  // 🧠 SAFE HELPERS
  ////////////////////////////////////////////////////////////////
  const formatPrice = (val) => Math.round(val || 0);

  ////////////////////////////////////////////////////////////////
  // ⏳ LOADING
  ////////////////////////////////////////////////////////////////
  if (loading) return <OrdersSkeleton />;

  ////////////////////////////////////////////////////////////////
  // ❌ EMPTY STATE
  ////////////////////////////////////////////////////////////////
  if (!orders.length) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-xl font-semibold text-gray-600">
          No Orders Yet 😕
        </h2>

        <button
          onClick={() => navigate("/products")}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  ////////////////////////////////////////////////////////////////
  // UI
  ////////////////////////////////////////////////////////////////
  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">

      <h2 className="text-2xl font-bold mb-6">
        📦 My Orders
      </h2>

      <div className="space-y-5">

        {orders.map((order) => {

          const firstItem = order.items?.[0];
          const image = firstItem?.productId?.images?.[0]?.url;
          const itemCount = order.items?.length || 0;

          return (
            <div
              key={order._id}
              onClick={() => navigate(`/orders/${order._id}`)}
              className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition cursor-pointer"
            >

              {/* HEADER */}
              <div className="flex flex-col md:flex-row md:justify-between gap-3">

                <div className="flex gap-4 items-center">

                  {/* IMAGE */}
                  <img
                    src={image || "/placeholder.png"}
                    className="w-14 h-14 object-cover rounded"
                    loading="lazy"
                  />

                  <div>
                    <p className="text-sm text-gray-500">
                      Order #{order._id.slice(-6)}
                    </p>

                    <p className="text-xs text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                </div>

                {/* STATUS */}
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold h-fit ${getStatusStyle(order.status)}`}
                >
                  {order.status}
                </span>

              </div>

              {/* PAYMENT INFO */}
              <div className="mt-3 text-sm text-gray-500 flex flex-wrap gap-4">
                <span>Payment: {order.paymentMethod}</span>
                <span>Status: {order.paymentStatus}</span>
              </div>

              {/* ITEMS PREVIEW */}
              <div className="mt-3 space-y-1 text-sm">

                {order.items?.slice(0, 2).map((item, i) => (
                  <div key={i} className="flex justify-between">
                    <span>
                      {item.name} × {item.quantity}
                    </span>

                    <span>
                      ₹{formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}

                {itemCount > 2 && (
                  <p className="text-xs text-gray-400">
                    +{itemCount - 2} more items
                  </p>
                )}

              </div>

              {/* FOOTER */}
              <div className="mt-4 flex justify-between items-center">

                <h3 className="font-bold text-lg">
                  ₹{formatPrice(order.totalPrice)}
                </h3>

                <button className="text-blue-600 text-sm">
                  View Details →
                </button>

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
}