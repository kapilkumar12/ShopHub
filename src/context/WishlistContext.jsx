import { createContext,useContext,useState } from "react";
import API from "../services/api";

const WishlistContext = createContext({
  wishlistCount: 0,
  fetchWishlistCount: async () => { },
  updateWishlistCount: () => { },
  resetWishlistCount: () => { },
});

export const WishlistProvider = ({ children }) => {
  const [wishlistCount,setWishlistCount] = useState(0);

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
  const updateWishlistCount = (
    products = []
  ) => {

    if (!Array.isArray(products)) {

      console.warn(
        "updateWishlistCount expects array"
      );

      return;
    }

    setWishlistCount(products.length);
  };

  const resetWishlistCount = () => {
    setWishlistCount(0);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistCount,
        fetchWishlistCount,
        updateWishlistCount,
        resetWishlistCount
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);