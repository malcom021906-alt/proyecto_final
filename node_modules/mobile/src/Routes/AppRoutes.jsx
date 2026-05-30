import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

// Importar todas las páginas
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

export const AppRoutes = () => {
  const { currentUser, userRole } = useAuth();

  // Determinar si ya completó el onboarding
  const isOnboarded = localStorage.getItem('malcom_onboarded') === 'true';

  return (
    <Routes>
      {/* Flujo de Onboarding */}
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

      {/* Autenticación */}
      <Route 
        path="/login" 
        element={currentUser ? <Navigate to="/home" replace /> : <Login />} 
      />
      <Route 
        path="/register" 
        element={currentUser ? <Navigate to="/home" replace /> : <Register />} 
      />

      {/* Rutas Compartidas (Públicas o Semipúblicas) */}
      <Route path="/home" element={<Home />} />
      <Route path="/search" element={<Search />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/cart" element={<Cart />} />

      {/* Rutas de Usuario Protegidas (Criterio de Rúbrica: UserRoutes) */}
      <Route 
        path="/checkout" 
        element={currentUser ? <Checkout /> : <Navigate to="/login" replace />} 
      />
      <Route 
        path="/profile" 
        element={currentUser ? <Profile /> : <Navigate to="/login" replace />} 
      />

      {/* Rutas de Administrador Protegidas (Criterio de Rúbrica: AdminRoutes) */}
      <Route 
        path="/admin" 
        element={
          currentUser && userRole === 'ADMIN' 
            ? <Dashboard /> 
            : <Navigate to="/home" replace />
        } 
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
};

export default AppRoutes;
