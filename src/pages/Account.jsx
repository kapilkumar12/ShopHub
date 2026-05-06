import { useEffect,useState } from "react";
import { getProfile,logoutUser } from "../services/auth";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import {AccountSkeleton} from "../skeletons/AccountSkeleton";

export default function Account() {
  const [user,setUser] = useState(null);
  const navigate = useNavigate();

  const { setUser: setGlobalUser } = useAuth();
  const { fetchCartCount } = useCart();

  useEffect(() => {
    fetchUser();
  },[]);

  const fetchUser = async () => {
    try {
      const res = await getProfile();
      setUser(res.user);
    } catch (err) {
      navigate("/"); // not logged in
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();

      setGlobalUser(null);
      await fetchCartCount();

      await Swal.fire({
        icon: "success",
        title: "Logged out",
        timer: 1200,
        showConfirmButton: false,
      });

      navigate("/");
    } catch (err) {
      Swal.fire("Error","Logout failed","error");
    }
  };

  if (!user) return <AccountSkeleton />;

  return (
    <div className="p-6 max-w-5xl mx-auto">

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row items-center gap-6">

        <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-3xl font-bold text-blue-600">
          {user.name?.charAt(0)}
        </div>

        <div className="flex-1">
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <p className="text-gray-500">{user.email}</p>
        </div>

        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-lg cursor-pointer"
        >
          Logout
        </button>
      </div>

      {/* Sections */}
      <div className="grid md:grid-cols-3 gap-6 mt-6">

        <div
          onClick={() => navigate("/orders")}
          className="bg-white p-5 rounded-xl shadow cursor-pointer hover:shadow-lg"
        >
          <h3 className="font-semibold text-lg">📦 Orders</h3>
          <p className="text-sm text-gray-500">
            View your orders
          </p>
        </div>

        <div
          onClick={() => navigate("/cart")}
          className="bg-white p-5 rounded-xl shadow cursor-pointer hover:shadow-lg"
        >
          <h3 className="font-semibold text-lg">🛒 Cart</h3>
          <p className="text-sm text-gray-500">
            Manage your cart
          </p>
        </div>

        <div onClick={() => navigate("/wishlist")} className="bg-white p-5 rounded-xl shadow cursor-pointer hover:shadow-lg">
          <h3 className="font-semibold text-lg">❤️ Wishlist</h3>
          <p className="text-sm text-gray-500">
            Your saved items
          </p>
        </div>
      </div>
    </div>
  );
}