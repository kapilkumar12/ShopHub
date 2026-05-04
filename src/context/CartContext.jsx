import { createContext, useContext, useState } from "react";
import API from "../services/api";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  ////////////////////////////////////////////////////////////////
  // 🔥 CALCULATE COUNT FROM ITEMS
  ////////////////////////////////////////////////////////////////
  const calculateCount = (items) => {
    return items.reduce(
      (acc, item) => acc + item.quantity,
      0
    );
  };

  ////////////////////////////////////////////////////////////////
  // 🔥 FETCH FROM SERVER
  ////////////////////////////////////////////////////////////////
  const fetchCartCount = async () => {
    try {
      const res = await API.get("/cart");

      const items = res?.data?.items || [];

      setCartCount(calculateCount(items));

    } catch (err) {
      setCartCount(0);
    }
  };

  ////////////////////////////////////////////////////////////////
  // 🔥 LIVE UPDATE (ARRAY BASED)
  ////////////////////////////////////////////////////////////////
  const updateCartCount = (items) => {
    if (!Array.isArray(items)) return; // safety

    setCartCount(calculateCount(items));
  };

  return (
    <CartContext.Provider
      value={{
        cartCount,
        fetchCartCount,
        updateCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);