import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  // Check if the user session exists in either storage
  const isAuthenticated =
    sessionStorage.getItem("loggedInUser") ||
    localStorage.getItem("loggedInUser");

  // If not logged in, redirect them to the login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If logged in, render the requested component/page
  return children;
};

export default ProtectedRoute;