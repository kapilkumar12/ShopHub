import { useEffect,useState } from "react";
import { useParams } from "react-router-dom";
import { getSingleOrder,cancelOrder } from "../services/order";
import API from "../services/api"; // ❗ missing tha
import socket from "../services/socket";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { downloadInvoice } from "../utils/generateInvoice";


export default function OrderDetails() {
  const { id } = useParams();
  const { user } = useAuth(); // ✅ REQUIRED

  const [order,setOrder] = useState(null);
  const [loading,setLoading] = useState(true);
  const [tracking,setTracking] = useState([]);


  const fetchAll = async () => {
    try {
      setLoading(true);

      const [orderRes,trackingRes] = await Promise.all([
        getSingleOrder(id),
        API.get(`/orders/tracking/${id}`)
      ]);

      setOrder(orderRes.order);

      console.log("setOrder",orderRes.order)

      setTracking(trackingRes.data.tracking || []);
    } catch (err) {
      console.error(err);
      showError("Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  },[id]);

  // 🔥 SOCKET.IO REAL-TIME
  useEffect(() => {
    if (!id) return;

    // order room join
    socket.emit("joinOrderRoom",id);

    socket.on("orderStatusUpdated",(data) => {
      if (data.orderId === id) {
        toast.success(`Order ${data.status}`);
        fetchAll();
      }
    });

    return () => {
      socket.off("orderStatusUpdated");
    };
  },[id]);

  // 🔔 USER NOTIFICATIONS
  useEffect(() => {
    if (!user?._id) return;

    socket.emit("joinUserRoom",user._id);

    socket.on("newNotification",(data) => {
      toast.success(data.message);
    });

    return () => {
      socket.off("newNotification");
    };
  },[user]);


  const handleCancelOrder = async () => {
    const { value: reason } = await Swal.fire({
      title: "Cancel Order",
      input: "textarea",
      inputLabel: "Reason for cancellation",
      inputPlaceholder: "Enter reason...",
      inputAttributes: {
        "aria-label": "Type your reason here"
      },
      showCancelButton: true,
      confirmButtonText: "Cancel Order",
    });

    if (!reason) {
      Swal.fire("Reason required");
      return;
    }

    try {
      await cancelOrder(order._id,reason);

      Swal.fire({
        icon: "success",
        title: "Order Cancelled",
      });

      fetchAll();

    } catch (err) {
      console.error(err);
    }
  };


  // 📅 Estimated Delivery
  const getEstimatedDate = () => {
    if (!order?.createdAt) return "";

    const date = new Date(order.createdAt);

    let days = 5;
    if (order.status === "confirmed") days = 4;
    if (order.status === "shipped") days = 2;
    if (order.status === "delivered") days = 0;

    date.setDate(date.getDate() + days);

    return date.toDateString();
  };


  // 📊 Steps
  const steps = ["pending","confirmed","shipped","delivered"];
  const currentStepIndex = steps.indexOf(order?.status);
  const isCancelled = order?.status === "cancelled";

  // 📄 Invoice


  // ⏳ Loading
  if (loading)
    return <p className="text-center mt-10">Loading...</p>;

  // ❌ Not found
  if (!order)
    return (
      <p className="text-center mt-10 text-red-500">
        Order not found
      </p>
    );

  return (
    <div className="p-6 max-w-5xl mx-auto">

      <h2 className="text-2xl font-bold mb-6">
        📦 Order Details
      </h2>

      {/* 📊 TRACKING */}
      <div className="bg-white p-5 rounded-2xl shadow mb-6">
        <h3 className="font-bold mb-4">Tracking</h3>

        {isCancelled ? (
          <p className="text-center text-red-500 font-semibold text-lg">
            ❌ Order Cancelled
          </p>
        ) : (
          <div className="flex justify-between items-center relative">

            {steps.map((step,index) => (
              <div key={step} className="flex-1 text-center relative">

                {/* Line */}
                {index !== 0 && (
                  <div
                    className={`absolute top-2 left-0 w-full h-1 
                    ${index <= currentStepIndex
                        ? "bg-green-500"
                        : "bg-gray-300"
                      }`}
                  />
                )}

                {/* Circle */}
                <div
                  className={`w-6 h-6 mx-auto rounded-full z-10 relative 
                  ${index <= currentStepIndex
                      ? "bg-green-500"
                      : "bg-gray-300"
                    }`}
                />

                <p className="text-sm mt-2 capitalize">
                  {step}
                </p>
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

      {/* 📦 ITEMS */}
      <div className="bg-white p-5 rounded-2xl shadow mb-6">
        <h3 className="font-bold mb-4">Items</h3>

        {order.items.map((item,index) => (
          <div
            key={index}
            className="flex justify-between border-b py-2 gap-3 items-center"
          >
            <img src={item?.productId?.images[0]?.url} alt={item?.productId?.name} className="w-16 h-16 object-cover rounded" loading="lazy" />
            <span>
              {item.name} x {item.quantity}
            </span>
            <span>
              ₹{item.price * item.quantity}
            </span>
          </div>
        ))}

        <div className="mt-4 flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>₹{order.totalPrice}</span>
        </div>
      </div>

      {/* 🏠 ADDRESS */}
      <div className="bg-white p-5 rounded-2xl shadow mb-6">
        <h3 className="font-bold mb-2">
          Shipping Address
        </h3>
        <p>{order.address}</p>
        <p className="text-gray-500 text-sm">
          {order.phone}
        </p>
      </div>

      {/* 💳 PAYMENT */}
      <div className="bg-white p-5 rounded-2xl shadow mb-6">
        <h3 className="font-bold mb-2">
          Payment Info
        </h3>
        <p>
          Method:{" "}
          <span className="capitalize">
            {order.paymentMethod}
          </span>
        </p>
        <p>
          Status:{" "}
          <span className="capitalize">
            {order.paymentStatus}
          </span>
        </p>
      </div>

      {["pending","confirmed"].includes(order.status) && (
        <button
          onClick={handleCancelOrder}
          className="w-full bg-red-500 text-white py-2 rounded-xl mb-4"
        >
          ❌ Cancel Order
        </button>
      )}

      {/* 📄 INVOICE */}
      <button
        onClick={() => downloadInvoice(order,user)}
        className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition"
      >
        📄 Download Invoice
      </button>

    </div>
  );
}