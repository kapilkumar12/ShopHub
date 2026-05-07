import { useEffect,useState } from "react";
import { getOrders } from "../services/order";
import { useNavigate } from "react-router-dom";
import OrdersSkeleton from "../skeletons/OrdersSkeleton";

export default function Orders() {

  const [orders,setOrders] = useState([]);
  const [loading,setLoading] = useState(true);
  const navigate = useNavigate();


useEffect(() => {
  let active = true;

  const load = async () => {
    const res = await getOrders();
    if (active) setOrders(res.orders || []);
    setLoading(false);
  };

  load();

  return () => {
    active = false;
  };
}, []);

  // 🎨 status color
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "shipped":
        return "bg-blue-100 text-blue-700";
      case "delivered":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading)  
    return <OrdersSkeleton/> 

  if (orders.length === 0) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-xl font-semibold text-gray-600">
          No Orders Yet 😕
        </h2>
        <p className="text-gray-400 mt-2">
          Start shopping to place your first order
        </p>

        <button
          onClick={() => navigate("/products")}
          className="mt-5 bg-blue-600 text-white px-5 py-2 rounded-lg"
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">

      <h2 className="text-2xl font-bold mb-6">📦 Your Orders</h2>

      <div className="space-y-5">

        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition cursor-pointer"
          >

            {/* Top Row */}
            <div className="flex justify-between items-center mb-3">
              <div>
                <img src={order.items?.[0]?.productId?.images?.[0]?.url} alt="Product image" className="w-16 h-16 object-cover rounded" loading="lazy" />
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  Order ID: {order._id.slice(-6)}
                </p>
                <p className="text-sm text-gray-400">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>

              <p className="text-sm text-gray-400">
                Payment Status : {order.paymentStatus}
              </p>
              <p className="text-sm text-gray-400">
                Payment Methood : {order.paymentMethod}
              </p>

              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>

            {/* Items Preview */}
            <div className="space-y-2">
              {order.items.slice(0,2).map((item,index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>{`₹${Math.floor(item.price * item.quantity)}`}</span>
                </div>
              ))}

              {order.items.length > 2 && (
                <p className="text-xs text-gray-400">
                  +{order.items.length - 2} more items
                </p>
              )}
            </div>

            {/* Bottom */}
            <div className="mt-4 flex justify-between items-center">

              <h3 className="font-semibold text-lg">
                {`₹${Math.floor(order.totalPrice)}`}
              </h3>

              <button className="text-blue-600 text-sm hover:underline"  onClick={() => navigate(`/orders/${order._id}`)}>
                View Details →
              </button>
            </div>

          </div>
        ))}

      </div>
    </div>
  );
}