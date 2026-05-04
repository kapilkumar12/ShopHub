import API from "./api";

// add to cart
export const addToCart = async (data) => {
  const res = await API.post("/cart/add", data);
  return res.data;
};

// get cart
export const getCart = async () => {
  const res = await API.get("/cart");
  return res.data;
};

// remove item
export const removeFromCart = async (productId) => {
  const res = await API.delete(`/cart/remove/${productId}`);
  return res.data;
};

export const updateCartItem = async (productId, quantity) => {
  const res = await API.put("/cart/update", {
    productId,
    quantity,
  });
  return res.data;
};