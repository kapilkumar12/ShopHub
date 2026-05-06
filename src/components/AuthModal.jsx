import { useState } from "react";
import { loginUser, registerUser } from "../services/auth";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";

export default function AuthModal({
  isOpen,
  onClose,
  type,
  setType,
  openOTP,
}) {
  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [loading,setLoading] = useState(false);
  const { setUser, fetchUser } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!email || !password || (type === "register" && !name)) {
      return Swal.fire("Error","All fields are required","error");
    }

    try {
      setLoading(true);

      if (type === "register") {
        await registerUser({ name,email,password });

        await Swal.fire({
          icon: "success",
          title: "OTP sent to email",
          timer: 1200,
          showConfirmButton: false,
        });
        openOTP(email);
      } else {
        const res = await loginUser({ email,password });

        localStorage.setItem("accessToken",res.data.accessToken);

        setUser(res.data.user);

        await Swal.fire({
          icon: "success",
          title: "Login successful",
          timer: 1200,
          showConfirmButton: false,
        });
        onClose();
      }
    } catch (error) {
      Swal.fire("Error",error?.response?.data?.message || "Error","error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/40 backdrop-blur-sm z-50">

      <div className="relative w-[90%] max-w-md p-6 rounded-2xl 
        bg-white/10 backdrop-blur-xl border border-white/20 
        shadow-2xl text-white">

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white text-lg hover:scale-110 cursor-pointer"
        >
          ✖
        </button>

        <h2 className="text-2xl font-bold text-center mb-2">
          {type === "login" ? "Welcome Back 👋" : "Create Account 🚀"}
        </h2>

        <p className="text-center text-gray-200 mb-5 text-sm">
          {type === "login"
            ? "Login to continue shopping"
            : "Join ShopHub today"}
        </p>

        <div className="space-y-3">

          {type === "register" && (
            <input
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-lg bg-white/20 placeholder-gray-200 outline-none focus:ring-2 focus:ring-blue-400"
            />
          )}

          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-lg bg-white/20 placeholder-gray-200 outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-3 rounded-lg bg-white/20 placeholder-gray-200 outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 rounded-lg bg-linear-to-r from-blue-500 to-indigo-500 font-semibold hover:opacity-90 transition cursor-pointer"
          >
            {loading
              ? "Please wait..."
              : type === "login"
                ? "Login"
                : "Register"}
          </button>
        </div>

        <p
          onClick={() =>
            setType(type === "login" ? "register" : "login")
          }
          className="text-center text-sm mt-4 text-blue-300 cursor-pointer"
        >
          {type === "login"
            ? "Don't have an account? Register"
            : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
}