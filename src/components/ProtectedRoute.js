// ProtectedRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { checkIsLoggedIn } from '../utils/authUtils';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();

  return checkIsLoggedIn() ? (
    children
  ) : (
    <Navigate to="/sign-in" replace state={{ from: location }} />
  );
};

export default ProtectedRoute;

