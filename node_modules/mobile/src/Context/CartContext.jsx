import React, { createContext, useContext, useState, useEffect } from 'react';
import { SHIPPING_COST } from '../Helpers/formatters';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Cargar carrito de memoria al iniciar (Criterio de Rúbrica: Memoria)
  useEffect(() => {
    const savedCart = localStorage.getItem('malcom_cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Error leyendo carrito de memoria:", e);
      }
    }
  }, []);

  // Guardar carrito en memoria cada vez que cambie
  useEffect(() => {
    localStorage.setItem('malcom_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Agregar al carrito
  const addToCart = (product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock || 99) }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  // Actualizar cantidad de un ítem
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) => 
      prev.map(item => 
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  // Remover un producto
  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter(item => item.id !== productId));
  };

  // Limpiar carrito
  const clearCart = () => {
    setCartItems([]);
  };

  // Cálculos totales
  const subtotal = cartItems.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const shipping = subtotal > 0 ? SHIPPING_COST : 0;
  const total = subtotal + shipping;

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      subtotal,
      shipping,
      total,
      totalItemsCount
    }}>
      {children}
    </CartContext.Provider>
  );
};
