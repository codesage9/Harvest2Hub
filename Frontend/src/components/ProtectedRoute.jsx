import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-medium text-stone-600">Verifying credentials...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // If user is farmer trying to access gov page, redirect to farmer dashboard
    if (user?.role === 'farmer') {
      return <Navigate to="/farmer/dashboard" replace />;
    }
    // If gov officer trying to access farmer specific page, redirect to gov dashboard
    if (user?.role === 'government' || user?.role === 'admin') {
      return <Navigate to="/gov/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
};
