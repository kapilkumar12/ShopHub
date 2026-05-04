import { useState, useEffect } from "react";
import { verifyOtp, resendOtp } from "../services/auth";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";

export default function OTPModal({ isOpen, onClose, email }) {
  const [otp, setOtp] = useState(["","","","","",""]);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(30);

  const { fetchUser } = useAuth();

  // 🔥 RESET WHEN MODAL OPENS
  useEffect(() => {
    if (isOpen) {
      setOtp(["","","","","",""]);
      setTimer(30);
    }
  }, [isOpen]);

  // ⏳ TIMER
  useEffect(() => {
    if (!isOpen || timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, isOpen]);

  if (!isOpen) return null;

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      return Swal.fire("Error", "Enter valid OTP", "error");
    }

    try {
      setLoading(true);

      await verifyOtp({ email, otp: otpValue });

      await fetchUser();

      Swal.fire("Verified", "Account activated successfully", "success");

      onClose();

    } catch (error) {
      Swal.fire("Error", "Invalid OTP", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (timer > 0) return;

    try {
      setResendLoading(true);

      await resendOtp({ email });

      setTimer(30);

      // ✅ FEEDBACK ADDED
      Swal.fire("Sent", "OTP resent successfully", "success");

    } catch (error) {
      Swal.fire("Error", "Failed to resend OTP", "error");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/40 backdrop-blur-sm z-50">

      <div className="relative w-[90%] max-w-md p-6 rounded-2xl 
        bg-white/10 backdrop-blur-xl border border-white/20 
        shadow-2xl text-white">

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-lg hover:scale-110 cursor-pointer"
        >
          ✖
        </button>

        <h2 className="text-2xl font-bold text-center mb-2">
          Verify OTP 🔐
        </h2>

        <p className="text-center text-gray-200 text-sm mb-5">
          Enter the 6-digit code sent to your email
        </p>

        <div className="flex justify-between gap-2 mb-5">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              maxLength={1}
              className="w-10 h-12 text-center text-lg rounded-lg 
              bg-white/20 outline-none focus:ring-2 focus:ring-blue-400"
            />
          ))}
        </div>

        <button
          className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 font-semibold hover:opacity-90 transition cursor-pointer"
          onClick={handleVerifyOtp}
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify"}
        </button>

        <p
          onClick={handleResendOtp}
          className={`text-center mt-4 ${
            timer > 0
              ? "text-gray-400 cursor-not-allowed"
              : "text-blue-300 cursor-pointer"
          }`}
        >
          {timer > 0
            ? `Resend OTP in ${timer}s`
            : resendLoading
            ? "Sending..."
            : "Resend OTP"}
        </p>
      </div>
    </div>
  );
}