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
import NavbarSkeleton from "../skeletons/NavbarSkeleton";

export default function Navbar() {
  const [menuOpen,setMenuOpen] = useState(false);
  const [authOpen,setAuthOpen] = useState(false);
  const [otpOpen,setOtpOpen] = useState(false);
  const [otpEmail,setOtpEmail] = useState("");
  const [type,setType] = useState("login");

  const { search,setSearch } = useSearch();
  const { user,setUser,fetchUser,loading } = useAuth();
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

    navigate(`/products?search=${encodeURIComponent(value)}`);
    setSearch("");
    setResults([]);
    setShowDropdown(false);

  };

  const handleEnterSearch = () => {
    if (!search.trim()) return;

    navigate(`/products?search=${encodeURIComponent(search)}`);

    // 🔥 CLEAR EVERYTHING (same as select)
    setSearch("");
    setResults([]);
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

      await Promise.all([
        fetchCartCount(),
        fetchWishlistCount(),
      ]);

      navigate("/");

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCartCount();
    fetchWishlistCount();
  },[user]);

  useEffect(() => {
    if (!user && localStorage.getItem("accessToken")) {
      fetchUser();
    }
  },[]);

  if (loading) {
    return <NavbarSkeleton />;
  }

  return (
    <>
      <nav className="bg-white shadow-md">

        {/* ================= TOP NAV ================= */}
        <div className="px-3 md:px-4 py-3 flex items-center justify-between gap-3">

          {/* LEFT */}
          <div className="flex items-center gap-3">

            {/* MOBILE MENU BTN */}
            <button
              className="md:hidden text-2xl"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              ☰
            </button>

            {/* LOGO */}
            <Link to="/">
              <img
                src={Logo}
                alt="logo"
                className="w-16 md:w-18"
                loading="lazy"
              />
            </Link>
          </div>

          {/* ================= SEARCH ================= */}
          <div
            className="flex-1 max-w-xl relative"
            ref={dropdownRef}
          >
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={handleSearchChange}
              onFocus={() => search && setShowDropdown(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleEnterSearch();
                }
              }}
              className="
          w-full
          px-3 md:px-4
          py-2
          text-sm md:text-base
          border
          rounded-lg
          focus:outline-none
        "
            />

            {/* SEARCH DROPDOWN */}
            {showDropdown && (
              <div className="absolute top-12 left-0 w-full bg-white shadow-lg rounded-lg z-50 max-h-80 overflow-y-auto">

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

          {/* ================= RIGHT ================= */}
          <div className="flex items-center gap-3 md:gap-4">

            {/* DESKTOP USER */}
            {user ? (
              <>
                <span
                  onClick={() => navigate("/account")}
                  className="hidden lg:block font-medium cursor-pointer"
                >
                  👋 {user.name}
                </span>

                <button
                  onClick={handleLogout}
                  className="hidden md:block px-3 py-1 border rounded text-red-500"
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
                className="
            hidden md:block
            px-4 py-2
            border border-blue-600
            text-blue-600
            rounded-lg
            hover:bg-blue-600
            hover:text-white
          "
              >
                Login
              </button>
            )}

            {/* CART */}
            <Link to="/cart" className="text-xl relative">
              🛒

              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-1 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* WISHLIST */}
            <Link to="/wishlist" className="text-xl relative">
              ❤️

              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-1 rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* ================= MOBILE MENU ================= */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t shadow px-4 py-4">

            {user ? (
              <div className="mb-4">
                <p className="font-medium">👋 {user.name}</p>

                <button
                  onClick={handleLogout}
                  className="text-red-500 mt-2"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setType("login");
                  setAuthOpen(true);
                  setMenuOpen(false);
                }}
                className="mb-4 text-blue-600 font-medium"
              >
                Login
              </button>
            )}

            <ul className="space-y-3">

              <li>
                <Link
                  to="/account"
                  onClick={() => setMenuOpen(false)}
                >
                  Account
                </Link>
              </li>

              <li>
                <Link
                  to="/orders"
                  onClick={() => setMenuOpen(false)}
                >
                  Orders
                </Link>
              </li>

              <li>
                <Link
                  to="/products"
                  onClick={() => setMenuOpen(false)}
                >
                  Products
                </Link>
              </li>

              <li>
                <Link
                  to="/wishlist"
                  onClick={() => setMenuOpen(false)}
                >
                  Wishlist
                </Link>
              </li>

            </ul>
          </div>
        )}
      </nav>


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