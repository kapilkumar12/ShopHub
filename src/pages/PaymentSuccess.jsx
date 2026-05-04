import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function PaymentSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate("/orders");
    }, 3000);
  }, []);

  return (
    <div className="h-screen flex items-center justify-center bg-green-50">

      <div className="bg-white p-8 rounded-2xl shadow text-center">

        <h1 className="text-3xl font-bold text-green-600">
          ✅ Payment Successful
        </h1>

        <p className="text-gray-600 mt-2">
          Your order has been placed successfully
        </p>

        <button
          onClick={() => navigate("/orders")}
          className="mt-4 bg-green-600 text-white px-6 py-2 rounded"
        >
          Go to Orders
        </button>

      </div>
    </div>
  );
}