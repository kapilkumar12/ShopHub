import { useState,useEffect,useRef } from "react";
import { Link,useNavigate } from "react-router-dom";
import AuthModal from "./AuthModal";
import OTPModal from "./OTPModal";
import { logoutUser } from "../services/auth";
import Swal from "sweetalert2";
import { useSearch } from "../context/SearchContext";
import Logo from "../assets/images/logo.png";
import { productFilter as filterAPI } from "../services/product";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

export default function Navbar() {
  const [menuOpen,setMenuOpen] = useState(false);
  const [authOpen,setAuthOpen] = useState(false);
  const [otpOpen,setOtpOpen] = useState(false);
  const [otpEmail,setOtpEmail] = useState("");
  const [type,setType] = useState("login");

  const { search,setSearch } = useSearch();
  const { user,setUser } = useAuth();
  const { cartCount,fetchCartCount } = useCart();
  const { wishlistCount,fetchWishlistCount } = useWishlist();
  const navigate = useNavigate();

  const [results,setResults] = useState([]);
  const [showDropdown,setShowDropdown] = useState(false);

  const dropdownRef = useRef();

  // 🔍 Search debounce
  useEffect(() => {
    const delay = setTimeout(async () => {
      if (!search.trim()) {
        setResults([]);
        setShowDropdown(false);
        return;
      }

      try {
        const data = await filterAPI({
          search,
          limit: 5,
          minPrice: 0,
          maxPrice: 200000,
        });
        setResults(data?.products || []);
        setShowDropdown(true);
      } catch (error) {
        console.error(error);
        setResults([]);
        setShowDropdown(false);
      }
    },300);

    return () => clearTimeout(delay);
  },[search]);

  // 🔴 Click outside dropdown close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown",handleClickOutside);
    return () => document.removeEventListener("mousedown",handleClickOutside);
  },[]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSelect = (value) => {
    setSearch(value);
    navigate("/products");
    setShowDropdown(false);
  };

  // 🚪 Logout (FIXED)
  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Logout?",
      text: "You will be logged out",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, logout",
    });

    if (!result.isConfirmed) return;

    try {
      await logoutUser();

      setUser(null);
      setSearch("");
      setShowDropdown(false);
      fetchCartCount();
      fetchWishlistCount();
      navigate("/");

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCartCount(); 
      fetchWishlistCount();// login
    } else {
      fetchCartCount();
      fetchWishlistCount(); // API already 0 return karegi
    }
  },[user]);

  return (
    <>
      <nav className="bg-white shadow-md px-4 py-3 flex items-center justify-between">

        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            className="md:hidden text-xl"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>

          <Link to="/">
            <img src={Logo} alt="logo" className="w-18" />
          </Link>
        </div>

        {/* Search */}
        <div className="hidden md:block w-1/2 relative" ref={dropdownRef}>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={handleSearchChange}
            onFocus={() => search && setShowDropdown(true)}
            className="w-full px-4 py-2 border rounded-lg"
          />

          {showDropdown && (
            <div className="absolute top-12 w-full bg-white shadow-lg rounded-lg z-50 max-h-80 overflow-y-auto">

              {results.length > 0 ? (
                results.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => handleSelect(item.name)}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  >
                    🔍 {item.name}
                  </div>
                ))
              ) : (
                <div className="p-3 text-gray-500 text-sm">
                  No results found
                </div>
              )}

            </div>
          )}
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">

          {user ? (
            <>
              <span
                onClick={() => navigate("/account")}
                className="hidden md:block font-medium cursor-pointer"
              >
                👋 {user.name}
              </span>

              <button
                onClick={handleLogout}
                className="px-3 py-1 border rounded text-red-500"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                setType("login");
                setAuthOpen(true);
              }}
              className="hidden md:block px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white"
            >
              Login
            </button>
          )}

          <Link to="/cart" className="text-xl relative">🛒 {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
              {cartCount}
            </span>
          )}</Link>

          <Link to="/wishlist" className="text-xl relative">❤️ {wishlistCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
              {wishlistCount}
            </span>
          )}</Link>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow p-4 space-y-3">

          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={handleSearchChange}
            className="w-full px-3 py-2 border rounded"
          />

          {!user ? (
            <button
              onClick={() => {
                setType("login");
                setAuthOpen(true);
                setMenuOpen(false);
              }}
              className="w-full text-left"
            >
              Login
            </button>
          ) : (
            <>
              <p>👤 {user.name}</p>
              <button onClick={handleLogout}>Logout</button>
            </>
          )}

          <Link to="/account">Account</Link>
          <Link to="/orders">Orders</Link>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        type={type}
        setType={setType}
        openOTP={(email) => {
          setAuthOpen(false);
          setOtpEmail(email);
          setOtpOpen(true);
        }}
      />

      {/* OTP Modal */}
      <OTPModal
        isOpen={otpOpen}
        onClose={() => setOtpOpen(false)}
        email={otpEmail}
      />
    </>
  );
}