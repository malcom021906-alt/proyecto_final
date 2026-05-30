import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

import Onboarding from '../Pages/Onboarding/Onboarding';
import Login from '../Pages/Login/Login';
import Register from '../Pages/Register/Register';
import Home from '../Pages/Home/Home';
import Search from '../Pages/Search/Search';
import ProductDetail from '../Pages/ProductDetail/ProductDetail';
import Cart from '../Pages/Cart/Cart';
import Checkout from '../Pages/Checkout/Checkout';
import Profile from '../Pages/Profile/Profile';
import Dashboard from '../Pages/Admin/Dashboard';

import UserRoutes from './UserRoutes';
import AdminRoutes from './AdminRoutes';

export const AppRoutes = () => {
  const { currentUser, userRole } = useAuth();
  const isOnboarded = localStorage.getItem('tecnostore_onboarded') === 'true';

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          currentUser 
            ? <Navigate to="/home" replace /> 
            : isOnboarded 
              ? <Navigate to="/login" replace /> 
              : <Onboarding />
        } 
      />

      <Route 
        path="/login" 
        element={currentUser ? <Navigate to="/home" replace /> : <Login />} 
      />
      <Route 
        path="/register" 
        element={currentUser ? <Navigate to="/home" replace /> : <Register />} 
      />

      <Route path="/home" element={<Home />} />
      <Route path="/search" element={<Search />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/cart" element={<Cart />} />

      <Route element={<UserRoutes currentUser={currentUser} />}>
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route element={<AdminRoutes currentUser={currentUser} userRole={userRole} />}>
        <Route path="/admin" element={<Dashboard />} />
      </Route>

      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
};

export default AppRoutes;
