import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ element, allowedRoles }) => {
  const token = localStorage.getItem("token"); 
  const user = token ? JSON.parse(atob(token.split(".")[1])) : null; 

  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} />;
  }
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }
  return element; 
};

export default ProtectedRoute;
