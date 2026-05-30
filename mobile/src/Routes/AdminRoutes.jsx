import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export const AdminRoutes = ({ currentUser, userRole }) => {
  return currentUser && userRole === 'ADMIN' ? <Outlet /> : <Navigate to="/home" replace />;
};

export default AdminRoutes;
