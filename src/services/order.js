import API from "./api";

// create order
export const createOrder = async (data) => {
  const res = await API.post("/orders/create", data);
  return res.data;
};

// cancel order
export const cancelOrder = async (orderId, reason) => {
  const res = await API.post(`/orders/cancel/${orderId}`, {
    reason,
  });
  return res.data;
};

// get single order
export const getSingleOrder = async (id) => {
  const res = await API.get(`/orders/single/${id}`);
  return res.data;
};

// get orders
export const getOrders = async () => {
  const res = await API.get("/orders");
  return res.data;
};
