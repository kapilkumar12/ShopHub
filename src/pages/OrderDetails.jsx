import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { getSingleOrder, cancelOrder } from "../services/order";
import API from "../services/api";
import socket from "../services/socket";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { downloadInvoice } from "../utils/generateInvoice";
import OrderDetailsSkeleton from "../skeletons/OrderDetailsSkeleton";

export default function OrderDetails() {

  const { id } = useParams();
  const { user } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tracking, setTracking] = useState([]);

  ////////////////////////////////////////////////////////////////
  // 🚀 FETCH DATA
  ////////////////////////////////////////////////////////////////
  const fetchAll = async () => {
    try {
      setLoading(true);

      const [orderRes, trackRes] = await Promise.all([
        getSingleOrder(id),
        API.get(`/orders/tracking/${id}`),
      ]);

      setOrder(orderRes?.order || null);
      setTracking(trackRes?.data?.tracking || []);

    } catch (err) {
      toast.error("Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, [id]);

  ////////////////////////////////////////////////////////////////
  // 🔥 SOCKET (FIXED MEMORY LEAK)
  ////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (!id) return;

    socket.emit("joinOrderRoom", id);

    const handleStatusUpdate = (data) => {
      if (data?.orderId === id) {
        toast.success(`Order ${data.status}`);
        fetchAll();
      }
    };

    socket.on("orderStatusUpdated", handleStatusUpdate);

    return () => {
      socket.off("orderStatusUpdated", handleStatusUpdate);
    };
  }, [id]);

  ////////////////////////////////////////////////////////////////
  // 🔔 USER NOTIFICATIONS
  ////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (!user?._id) return;

    socket.emit("joinUserRoom", user._id);

    const handleNotification = (data) => {
      toast.success(data?.message || "Notification");
    };

    socket.on("newNotification", handleNotification);

    return () => {
      socket.off("newNotification", handleNotification);
    };
  }, [user?._id]);

  ////////////////////////////////////////////////////////////////
  // ❌ CANCEL ORDER
  ////////////////////////////////////////////////////////////////
  const handleCancelOrder = async () => {
    const { value: reason } = await Swal.fire({
      title: "Cancel Order",
      input: "textarea",
      inputPlaceholder: "Reason...",
      showCancelButton: true,
      confirmButtonText: "Cancel Order",
    });

    if (!reason) return;

    try {
      await cancelOrder(order._id, reason);
      Swal.fire("Cancelled", "Order cancelled", "success");
      fetchAll();
    } catch {
      Swal.fire("Error", "Cancel failed", "error");
    }
  };

  ////////////////////////////////////////////////////////////////
  // 📦 SAFE HELPERS
  ////////////////////////////////////////////////////////////////
  const steps = useMemo(
    () => ["pending", "confirmed", "shipped", "delivered"],
    []
  );

  const currentStepIndex = useMemo(() => {
    return steps.indexOf(order?.status);
  }, [order?.status, steps]);

  const isCancelled = order?.status === "cancelled";

  const getEstimatedDate = () => {
    if (!order?.createdAt) return "";

    const date = new Date(order.createdAt);

    const map = {
      pending: 5,
      confirmed: 4,
      shipped: 2,
      delivered: 0,
    };

    const days = map[order.status] ?? 5;

    date.setDate(date.getDate() + days);
    return date.toDateString();
  };

  ////////////////////////////////////////////////////////////////
  // ⏳ LOADING
  ////////////////////////////////////////////////////////////////
  if (loading) return <OrderDetailsSkeleton />;

  ////////////////////////////////////////////////////////////////
  // ❌ NOT FOUND
  ////////////////////////////////////////////////////////////////
  if (!order) {
    return (
      <p className="text-center mt-10 text-red-500">
        Order not found
      </p>
    );
  }

  ////////////////////////////////////////////////////////////////
  // UI
  ////////////////////////////////////////////////////////////////
  return (
    <div className="p-6 max-w-5xl mx-auto">

      <h2 className="text-2xl font-bold mb-6">
        📦 Order Details
      </h2>

      {/* ================= TRACKING ================= */}
      <div className="bg-white p-5 rounded-xl shadow mb-6">

        <h3 className="font-bold mb-4">Tracking</h3>

        {isCancelled ? (
          <p className="text-red-500 font-semibold text-center">
            ❌ Order Cancelled
          </p>
        ) : (
          <div className="flex justify-between relative">

            {steps.map((step, i) => (
              <div key={step} className="flex-1 text-center relative">

                {i !== 0 && (
                  <div
                    className={`absolute top-2 left-0 w-full h-1 ${
                      i <= currentStepIndex
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  />
                )}

                <div
                  className={`w-6 h-6 mx-auto rounded-full relative z-10 ${
                    i <= currentStepIndex
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                />

                <p className="text-sm mt-2 capitalize">{step}</p>

              </div>
            ))}

          </div>
        )}

        {!isCancelled && (
          <p className="text-center mt-4 text-sm text-gray-500">
            Estimated Delivery: <b>{getEstimatedDate()}</b>
          </p>
        )}

      </div>

      {/* ================= ITEMS ================= */}
      <div className="bg-white p-5 rounded-xl shadow mb-6">

        <h3 className="font-bold mb-4">Items</h3>

        {order?.items?.map((item, i) => (
          <div
            key={i}
            className="flex justify-between border-b py-2 items-center"
          >
            <img
              src={item?.productId?.images?.[0]?.url}
              className="w-14 h-14 object-cover rounded"
              loading="lazy"
            />

            <span>
              {item?.name} × {item?.quantity}
            </span>

            <span>
              ₹{(item?.price || 0) * (item?.quantity || 0)}
            </span>

          </div>
        ))}

        <div className="mt-4 flex justify-between font-bold">
          <span>Total</span>
          <span>₹{order?.totalPrice}</span>
        </div>

      </div>

      {/* ================= ADDRESS ================= */}
      <div className="bg-white p-5 rounded-xl shadow mb-6">
        <h3 className="font-bold mb-2">Shipping Address</h3>
        <p>{order?.address}</p>
        <p className="text-sm text-gray-500">{order?.phone}</p>
      </div>

      {/* ================= PAYMENT ================= */}
      <div className="bg-white p-5 rounded-xl shadow mb-6">
        <h3 className="font-bold mb-2">Payment</h3>
        <p>Method: {order?.paymentMethod}</p>
        <p>Status: {order?.paymentStatus}</p>
      </div>

      {/* CANCEL */}
      {["pending", "confirmed"].includes(order?.status) && (
        <button
          onClick={handleCancelOrder}
          className="w-full bg-red-500 text-white py-2 rounded mb-4"
        >
          Cancel Order
        </button>
      )}

      {/* INVOICE */}
      <button
        onClick={() => downloadInvoice(order, user)}
        className="w-full bg-blue-600 text-white py-3 rounded"
      >
        Download Invoice
      </button>

    </div>
  );
}