import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './Context/AuthContext';
import { CartProvider } from './Context/CartContext';
import AppRoutes from './Routes/AppRoutes';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
