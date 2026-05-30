import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export const UserRoutes = ({ currentUser }) => {
  return currentUser ? <Outlet /> : <Navigate to="/login" replace />;
};

export default UserRoutes;
