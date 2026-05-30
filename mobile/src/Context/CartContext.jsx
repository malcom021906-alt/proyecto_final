import React, { createContext, useContext, useState, useEffect } from 'react';
import { SHIPPING_COST } from '../Helpers/formatters';
import { useAuth } from './AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('tecnostore_cart');
    if (savedCart) {
      try {
        return JSON.parse(savedCart);
      } catch (e) {
        console.error("Error leyendo carrito de memoria:", e);
      }
    }
    return [];
  });

  // Cargar el carrito desde Firebase cuando el usuario inicia sesión
  useEffect(() => {
    if (!currentUser) return;

    const loadFirebaseCart = async () => {
      try {
        const cartDoc = await getDoc(doc(db, 'carts', currentUser.uid));
        if (cartDoc.exists()) {
          const items = cartDoc.data().items || [];
          setCartItems(items);
        }
      } catch (e) {
        console.warn("Error cargando carrito de Firebase:", e);
      }
    };

    loadFirebaseCart();
  }, [currentUser]);

  // Guardar el carrito en localStorage y en Firebase en tiempo real
  useEffect(() => {
    localStorage.setItem('tecnostore_cart', JSON.stringify(cartItems));

    if (currentUser) {
      const saveFirebaseCart = async () => {
        try {
          await setDoc(doc(db, 'carts', currentUser.uid), {
            items: cartItems,
            updatedAt: new Date().toISOString()
          });
        } catch (e) {
          console.warn("Error guardando carrito en Firebase:", e);
        }
      };
      saveFirebaseCart();
    }
  }, [cartItems, currentUser]);

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

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

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
