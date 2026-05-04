import { createContext, useContext, useState } from "react";
import API from "../services/api";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistCount, setWishlistCount] = useState(0);

  ////////////////////////////////////////////////////////////////
  // ✅ FETCH COUNT (CORRECT)
  ////////////////////////////////////////////////////////////////
  const fetchWishlistCount = async () => {
    try {
      const res = await API.get("/wishlist");

      const products = res?.data?.products || [];

      // ✅ simple count
      setWishlistCount(products.length);

    } catch (err) {
      setWishlistCount(0);
    }
  };

  ////////////////////////////////////////////////////////////////
  // ✅ OPTIONAL: LIVE UPDATE
  ////////////////////////////////////////////////////////////////
  const updateWishlistCount = (products) => {
    if (!Array.isArray(products)) return;

    setWishlistCount(products.length);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistCount,
        fetchWishlistCount,
        updateWishlistCount,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);