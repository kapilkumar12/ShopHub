import { createContext,useContext,useEffect,useState } from "react";
import API from "../services/api";
import Swal from "sweetalert2";

const AuthContext = createContext({
  user: null,
  setUser: () => { },
  fetchUser: async () => { },
  logout: async () => { },
  loading: true,
});

export const AuthProvider = ({ children }) => {
  const [user,setUser] = useState(null);
  const [loading,setLoading] = useState(true);

  // 🔥 fetch logged in user
  const fetchUser = async () => {
    try {

      const token = localStorage.getItem("accessToken");

      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const res = await API.get("/auth/me");
      setUser(res.data.user || res.data);

    } catch (error) {
      console.log("fetchUser failed",error.message);
      setUser(null);
      localStorage.removeItem("accessToken");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  },[]);

  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
      localStorage.removeItem("accessToken");
    };

    window.addEventListener("unauthorized",handleUnauthorized);

    return () => {
      window.removeEventListener("unauthorized",handleUnauthorized);
    };
  },[]);

  // 🔥 logout
  const logout = async () => {
    try {
      await API.post("/auth/logout");
      localStorage.removeItem("accessToken");
      setUser(null);
    } catch (error) {
      Swal.fire("Error","Failed to logout","error");
    }
  };


  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        fetchUser,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 🔥 custom hook
export const useAuth = () => useContext(AuthContext);