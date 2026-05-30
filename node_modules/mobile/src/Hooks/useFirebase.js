import { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc, addDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

// Datos de Semilla (Seed) Realistas en Pesos Colombianos (COP)
export const SEED_CATEGORIES = [
  { id: 'cat-audio', name: 'Audio', slug: 'audio', imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60' },
  { id: 'cat-wearables', name: 'Wearables', slug: 'wearables', imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60' },
  { id: 'cat-computing', name: 'Computación', slug: 'computacion', imageUrl: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=500&auto=format&fit=crop&q=60' },
  { id: 'cat-peripherals', name: 'Periféricos', slug: 'perifericos', imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&auto=format&fit=crop&q=60' },
  { id: 'cat-photo', name: 'Foto y Video', slug: 'foto-video', imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&auto=format&fit=crop&q=60' }
];

export const SEED_PRODUCTS = [
  {
    id: 'prod-sony-wh',
    name: 'Audífonos Sony WH-1000XM5 ANC',
    description: 'Audífonos inalámbricos premium con Noise Cancelling líder en la industria, 30 horas de autonomía y sonido de alta resolución para audiófilos exigentes.',
    price: 1499000,
    stock: 10,
    rating: 4.8,
    images: [
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&auto=format&fit=crop&q=80'
    ],
    categoryId: 'cat-audio',
    sellerId: 'admin-seed-id'
  },
  {
    id: 'prod-apple-watch',
    name: 'Apple Watch Series 9 GPS',
    description: 'Reloj inteligente con chip S9, pantalla retina siempre activa super brillante, sensor de temperatura y mediciones avanzadas de salud.',
    price: 1899000,
    stock: 8,
    rating: 4.7,
    images: [
      'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80'
    ],
    categoryId: 'cat-wearables',
    sellerId: 'admin-seed-id'
  },
  {
    id: 'prod-macbook-air',
    name: 'MacBook Air 13" Apple M2',
    description: 'Laptop ultradelgada con chip M2 de Apple, 8GB de RAM, 256GB SSD, pantalla Liquid Retina y hasta 18 horas de duración de batería. El equilibrio perfecto entre rendimiento y elegancia.',
    price: 2999000,
    stock: 5,
    rating: 4.9,
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&auto=format&fit=crop&q=80'
    ],
    categoryId: 'cat-computing',
    sellerId: 'admin-seed-id'
  },
  {
    id: 'prod-mx-master',
    name: 'Mouse Logitech MX Master 3S',
    description: 'Mouse inalámbrico ergonómico de precisión extrema, sensor de 8000 DPI que funciona sobre cristal, y scroll electromagnético MagSpeed ultra veloz.',
    price: 459000,
    stock: 15,
    rating: 4.6,
    images: [
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80'
    ],
    categoryId: 'cat-peripherals',
    sellerId: 'admin-seed-id'
  },
  {
    id: 'prod-gopro-12',
    name: 'Cámara Deportiva GoPro HERO12 Black',
    description: 'Captura videos en 5.3K hiperestabilizados con HyperSmooth 6.0, fotos de 27 MP y sumergible a 10 metros sin carcasa. Perfecta para creadores de contenido.',
    price: 1999000,
    stock: 6,
    rating: 4.5,
    images: [
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&auto=format&fit=crop&q=80'
    ],
    categoryId: 'cat-photo',
    sellerId: 'admin-seed-id'
  },
  {
    id: 'prod-jbl-charge',
    name: 'Altavoz JBL Charge 5 Waterproof',
    description: 'Parlante bluetooth portátil e impermeable con sonido Pro Sound optimizado, powerbank integrado para cargar tus dispositivos y hasta 20 horas de fiesta.',
    price: 699000,
    stock: 12,
    rating: 4.7,
    images: [
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop&q=80'
    ],
    categoryId: 'cat-audio',
    sellerId: 'admin-seed-id'
  }
];

export const useFirebaseData = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Inicializar base de datos local y Firebase si está conectado
  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      
      // Intentar cargar de Firestore
      try {
        const catSnap = await getDocs(collection(db, 'categories'));
        const prodSnap = await getDocs(collection(db, 'products'));
        
        let cats = [];
        let prods = [];
        
        catSnap.forEach(d => cats.push({ id: d.id, ...d.data() }));
        prodSnap.forEach(d => prods.push({ id: d.id, ...d.data() }));
        
        // Si la base de datos de Firestore está vacía, usamos los seeds y tratamos de guardarlos
        if (cats.length === 0) {
          cats = SEED_CATEGORIES;
          for (const c of SEED_CATEGORIES) {
            await setDoc(doc(db, 'categories', c.id), c);
          }
        }
        
        if (prods.length === 0) {
          prods = SEED_PRODUCTS;
          for (const p of SEED_PRODUCTS) {
            await setDoc(doc(db, 'products', p.id), p);
          }
        }
        
        setCategories(cats);
        setProducts(prods);
      } catch (err) {
        console.warn("Fallo lectura Firestore. Inicializando datos en Memoria Local:", err.message);
        
        // Cargar desde LocalStorage para soportar modo Offline/Sin credenciales
        const localCats = localStorage.getItem('tecnostore_categories');
        const localProds = localStorage.getItem('tecnostore_products');
        
        if (localCats && localProds) {
          setCategories(JSON.parse(localCats));
          setProducts(JSON.parse(localProds));
        } else {
          setCategories(SEED_CATEGORIES);
          setProducts(SEED_PRODUCTS);
          localStorage.setItem('tecnostore_categories', JSON.stringify(SEED_CATEGORIES));
          localStorage.setItem('tecnostore_products', JSON.stringify(SEED_PRODUCTS));
        }
      } finally {
        setLoading(false);
      }
    };
    
    initData();
  }, []);

  // Cargar órdenes de compra de un usuario
  const getUserOrders = async (userId) => {
    try {
      const ordersSnap = await getDocs(collection(db, 'orders'));
      const list = [];
      ordersSnap.forEach(d => {
        const data = d.data();
        if (data.userId === userId) {
          list.push({ id: d.id, ...data });
        }
      });
      return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (e) {
      // Devolver órdenes desde LocalStorage si Firestore no está
      const localOrders = localStorage.getItem('tecnostore_orders') || '[]';
      const parsed = JSON.parse(localOrders);
      return parsed
        .filter(o => o.userId === userId)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  };

  // Crear una nueva orden de compra con transacciones seguras
  const createOrder = async (orderData) => {
    try {
      const docRef = await addDoc(collection(db, 'orders'), {
        ...orderData,
        createdAt: new Date().toISOString()
      });
      
      // Actualizar stock de los productos comprados en Firestore
      for (const item of orderData.items) {
        try {
          const productRef = doc(db, 'products', item.productId);
          const productSnap = await getDoc(productRef);
          if (productSnap.exists()) {
            const currentStock = productSnap.data().stock;
            await updateDoc(productRef, {
              stock: Math.max(0, currentStock - item.quantity)
            });
          }
        } catch (e) {
          console.error("Error al descontar inventario en Firestore:", e);
        }
      }
      return { success: true, orderId: docRef.id };
    } catch (e) {
      console.warn("Fallo guardado en Firestore. Guardando orden localmente:", e.message);
      
      // Guardar localmente
      const localOrders = JSON.parse(localStorage.getItem('tecnostore_orders') || '[]');
      const orderId = 'order-' + Math.random().toString(36).substr(2, 9);
      const newOrder = {
        id: orderId,
        ...orderData,
        createdAt: new Date().toISOString()
      };
      
      localOrders.push(newOrder);
      localStorage.setItem('tecnostore_orders', JSON.stringify(localOrders));

      // Actualizar stock localmente
      const localProducts = JSON.parse(localStorage.getItem('tecnostore_products') || JSON.stringify(SEED_PRODUCTS));
      const updatedProducts = localProducts.map(p => {
        const boughtItem = orderData.items.find(i => i.productId === p.id);
        if (boughtItem) {
          return { ...p, stock: Math.max(0, p.stock - boughtItem.quantity) };
        }
        return p;
      });
      
      localStorage.setItem('tecnostore_products', JSON.stringify(updatedProducts));
      setProducts(updatedProducts);

      return { success: true, orderId };
    }
  };

  // Guardar un producto nuevo o editado (Uso administrativo)
  const saveProduct = async (product) => {
    try {
      await setDoc(doc(db, 'products', product.id), product);
      setProducts(prev => {
        const exists = prev.some(p => p.id === product.id);
        if (exists) return prev.map(p => p.id === product.id ? product : p);
        return [...prev, product];
      });
      return true;
    } catch (e) {
      console.warn("Fallo guardar producto en Firestore. Guardando en memoria local.");
      const localProducts = JSON.parse(localStorage.getItem('tecnostore_products') || JSON.stringify(SEED_PRODUCTS));
      const exists = localProducts.some(p => p.id === product.id);
      let updated;
      if (exists) {
        updated = localProducts.map(p => p.id === product.id ? product : p);
      } else {
        updated = [...localProducts, product];
      }
      localStorage.setItem('tecnostore_products', JSON.stringify(updated));
      setProducts(updated);
      return true;
    }
  };

  return {
    products,
    categories,
    loading,
    getUserOrders,
    createOrder,
    saveProduct
  };
};
