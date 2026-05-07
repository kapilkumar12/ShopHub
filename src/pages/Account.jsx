import { useEffect,useState } from "react";
import { getProfile,logoutUser } from "../services/auth";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import AccountSkeleton from "../skeletons/AccountSkeleton";

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
    <div className="p-3 sm:p-4 md:p-6 max-w-6xl mx-auto">

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow p-4 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5">

        <div className="w-24 h-20 sm:w-24 sm:h-24 rounded-full bg-blue-100 flex items-center justify-center text-2xl sm:text-3xl font-bold text-blue-600 shrink-0">
          {user.name?.charAt(0)}
        </div>

        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-xl sm:text-2xl font-bold break-words">{user.name}</h2>
          <p className="text-gray-500 text-sm sm:text-base break-all">{user.email}</p>
        </div>

        <button
          onClick={handleLogout}
          className="w-full sm:w-auto px-5 py-2 bg-red-500 hover:bg-red-600 transition text-white rounded-lg cursor-pointer"
        >
          Logout
        </button>
      </div>

      {/* Sections */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6">

        <div
          onClick={() => navigate("/orders")}
          className="bg-white p-5 rounded-2xl shadow cursor-pointer hover:shadow-xl transition active:scale-[0.98]"
        >
          <h3 className="font-semibold text-lg sm:text-xl">📦 Orders</h3>
          <p className="text-sm text-gray-500 mt-1">
            View your orders
          </p>
        </div>

        <div
          onClick={() => navigate("/cart")}
          className="bg-white p-5 rounded-2xl shadow cursor-pointer hover:shadow-xl transition active:scale-[0.98]"
        >
          <h3 className="font-semibold text-lg sm:text-xl">🛒 Cart</h3>
          <p className="text-sm text-gray-500 mt-1">
            Manage your cart
          </p>
        </div>

        <div onClick={() => navigate("/wishlist")} className="bg-white p-5 rounded-2xl shadow cursor-pointer hover:shadow-lg transition active:scale-[0.98]">
          <h3 className="font-semibold text-lg sm:text-xl">❤️ Wishlist</h3>
          <p className="text-sm text-gray-500 mt-1">
            Your saved items
          </p>
        </div>
      </div>
    </div>
  );
}