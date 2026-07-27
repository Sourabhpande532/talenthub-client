import { createContext, useContext, useState } from "react";
import toast from "react-hot-toast";
import API_URL from "../api/axiosHelper";
// import { toast } from "react-toastify";
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("fspToken"));
  const isLoggedIn = !!token;
  console.log(isLoggedIn);

  function logout() {
    localStorage.removeItem("fspToken");
    setToken(null);
    toast.success("User Logout");
  }
  async function userRegister(data) {
    try {
      const res = await API_URL.post("/auth/register", data);
      console.log("register user", res);
      toast.success("Registration Successful");
      return true;
    } catch (error) {
      console.error(error.message);
      toast.error(error.response?.data?.message || "Registration failed");
      return false;
    }
  }
  async function login(data) {
    try {
      const response = await API_URL.post("/auth/login", data);
      console.log("Login user", response);
      if (!response.data?.token) {
        toast.error("Invalid Token");
        return false;
      }
      localStorage.setItem("fspToken", response.data.token);
      setToken(response.data.token);
      toast.success("User Logged in");
      return true;
    } catch (error) {
      console.error(error.message);
      toast.error(
        error.response?.data?.message || "Invalide email or password",
      );
      return false;
    }
  }
  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, userRegister }}>
      {children}
    </AuthContext.Provider>
  );
};
const useAuth = () => useContext(AuthContext);
export { AuthContext, AuthProvider, useAuth };
