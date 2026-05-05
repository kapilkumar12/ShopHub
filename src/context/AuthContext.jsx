
import { createContext,useContext,useEffect,useState } from "react";
import API from "../services/api";
import Swal from "sweetalert2";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user,setUser] = useState(null);
  const [loading,setLoading] = useState(true);

  // 🔥 fetch logged in user
  const fetchUser = async () => {
    try {

      const token = localStorage.getItem("accessToken");

      if (!token) {
        setUser(null);
        return;
      }

      const res = await API.get("/auth/me");
      const userData = res.data.user || res.data;

      setUser(userData);

    } catch (error) {
      setUser(null);
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

    window.addEventListener("unauthorized", handleUnauthorized);

    return () => {
      window.removeEventListener("unauthorized", handleUnauthorized);
    };
  }, []);

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