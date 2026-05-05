import axios from "axios";

const BASE_URL = "https://shophub-backend-ee64.onrender.com/api";

const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

//////////////////////////////////////////////////////////////
// 🔥 REQUEST INTERCEPTOR (ADD TOKEN)
//////////////////////////////////////////////////////////////

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

//////////////////////////////////////////////////////////////
// 🔥 RESPONSE INTERCEPTOR (AUTO REFRESH TOKEN)
//////////////////////////////////////////////////////////////

API.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // ❌ skip auth routes
    const isAuthRoute =
      originalRequest?.url?.includes("/auth/login") ||
      originalRequest?.url?.includes("/auth/refresh");

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthRoute // 🔥 IMPORTANT
    ) {
      originalRequest._retry = true;

      try {
        const res = await axios.get(`${BASE_URL}/auth/refresh`, {
          withCredentials: true,
        });

        const newToken = res.data.accessToken;

        localStorage.setItem("accessToken", newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return API(originalRequest);
      } catch (err) {
        
        localStorage.removeItem("accessToken");
        window.dispatchEvent(new Event("unauthorized"));

        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  },
);

export default API;
