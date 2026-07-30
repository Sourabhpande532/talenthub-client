import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectingRoutes = ({ children, requiredRole }) => {
  const { token, user } = useSelector((state) => state.auth);
  if (!token) {
    return <Navigate to='/login' replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    // If the user tries to access a route they aren't authorized for, send them to their dashboard
    return <Navigate to='/dashboard' replace />;
  }

  return children;
};

export default ProtectingRoutes;
