import { useEffect, useState } from "react";
import { getProfile, logoutUser } from "../services/auth";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import AccountSkeleton from "../skeletons/AccountSkeleton";
import Swal from "sweetalert2";

export default function Account() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const { setUser } = useAuth();
  const { fetchCartCount } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getProfile();
        setUserData(res?.user || null);
      } catch {
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const logout = async () => {
    try {
      await logoutUser();

      setUser(null);
      await fetchCartCount();

      Swal.fire("Logged out", "", "success");

      navigate("/");
    } catch {
      Swal.fire("Error", "Logout failed", "error");
    }
  };

  if (loading) return <AccountSkeleton />;
  if (!userData) return null;

  return (
    <div className="p-6 max-w-4xl mx-auto">

      <h1>{userData?.name}</h1>
      <p>{userData?.email}</p>

      <button onClick={logout}>
        Logout
      </button>

      <div
        onClick={() => navigate("/orders")}
        className="cursor-pointer"
      >
        Orders
      </div>

      <div onClick={() => navigate("/cart")}>
        Cart
      </div>

      <div onClick={() => navigate("/wishlist")}>
        Wishlist
      </div>

    </div>
  );
}