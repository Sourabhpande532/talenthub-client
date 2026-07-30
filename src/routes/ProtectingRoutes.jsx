import React from "react";
import { Navigate } from "react-router-dom";

const ProtectingRoutes = ({ children }) => {
  const isLoggedIn = false
  return isLoggedIn ? children : <Navigate to='/login' replace />;
};

export default ProtectingRoutes;
