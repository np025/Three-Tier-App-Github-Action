// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // Check if the token exists in localStorage

  // If no token, redirect to Signin page
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // If token exists, render the children components (Dashboard)
  return children;
};

export default PrivateRoute;
