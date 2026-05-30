/**
 * Script de Seed para Firebase Firestore - Proyecto Malcom
 * 
 * CÓMO USARLO:
 * 1. Completa el .env con tus credenciales reales
 * 2. Ejecuta desde la carpeta /mobile:
 *    node src/scripts/seedFirebase.js
 *
 * ⚠️  Requiere Node.js 18+ (usa fetch nativo)
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  databaseURL: process.env.VITE_FIREBASE_DATABASE_URL,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ─────────────────────────────────────────────
// DATOS: CATEGORÍAS
// ─────────────────────────────────────────────
const CATEGORIES = [
  { id: 'cat-audio',       name: 'Audio',        slug: 'audio',       imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60' },
  { id: 'cat-wearables',   name: 'Wearables',    slug: 'wearables',   imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60' },
  { id: 'cat-computing',   name: 'Computación',  slug: 'computacion', imageUrl: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=500&auto=format&fit=crop&q=60' },
  { id: 'cat-peripherals', name: 'Periféricos',  slug: 'perifericos', imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&auto=format&fit=crop&q=60' },
  { id: 'cat-photo',       name: 'Foto y Video', slug: 'foto-video',  imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&auto=format&fit=crop&q=60' },
];

// ─────────────────────────────────────────────
// DATOS: PRODUCTOS
// ─────────────────────────────────────────────
const PRODUCTS = [
  {
    id: 'prod-sony-wh',
    name: 'Audífonos Sony WH-1000XM5 ANC',
    description: 'Audífonos inalámbricos premium con Noise Cancelling líder en la industria, 30 horas de autonomía y sonido de alta resolución para audiófilos exigentes.',
    price: 1499000,
    stock: 10,
    rating: 4.8,
    categoryId: 'cat-audio',
    sellerId: 'admin-seed-id',
    images: [
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&auto=format&fit=crop&q=80',
    ],
  },
  {
    id: 'prod-apple-watch',
    name: 'Apple Watch Series 9 GPS',
    description: 'Reloj inteligente con chip S9, pantalla retina siempre activa super brillante, sensor de temperatura y mediciones avanzadas de salud.',
    price: 1899000,
    stock: 8,
    rating: 4.7,
    categoryId: 'cat-wearables',
    sellerId: 'admin-seed-id',
    images: [
      'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80',
    ],
  },
  {
    id: 'prod-macbook-air',
    name: 'MacBook Air 13" Apple M2',
    description: 'Laptop ultradelgada con chip M2 de Apple, 8GB de RAM, 256GB SSD, pantalla Liquid Retina y hasta 18 horas de duración de batería.',
    price: 2999000,
    stock: 5,
    rating: 4.9,
    categoryId: 'cat-computing',
    sellerId: 'admin-seed-id',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&auto=format&fit=crop&q=80',
    ],
  },
  {
    id: 'prod-mx-master',
    name: 'Mouse Logitech MX Master 3S',
    description: 'Mouse inalámbrico ergonómico de precisión extrema, sensor de 8000 DPI que funciona sobre cristal, y scroll electromagnético MagSpeed ultra veloz.',
    price: 459000,
    stock: 15,
    rating: 4.6,
    categoryId: 'cat-peripherals',
    sellerId: 'admin-seed-id',
    images: [
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80',
    ],
  },
  {
    id: 'prod-gopro-12',
    name: 'Cámara Deportiva GoPro HERO12 Black',
    description: 'Captura videos en 5.3K hiperestabilizados con HyperSmooth 6.0, fotos de 27 MP y sumergible a 10 metros sin carcasa.',
    price: 1999000,
    stock: 6,
    rating: 4.5,
    categoryId: 'cat-photo',
    sellerId: 'admin-seed-id',
    images: [
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&auto=format&fit=crop&q=80',
    ],
  },
  {
    id: 'prod-jbl-charge',
    name: 'Altavoz JBL Charge 5 Waterproof',
    description: 'Parlante bluetooth portátil e impermeable con sonido Pro Sound optimizado, powerbank integrado para cargar tus dispositivos y hasta 20 horas de fiesta.',
    price: 699000,
    stock: 12,
    rating: 4.7,
    categoryId: 'cat-audio',
    sellerId: 'admin-seed-id',
    images: [
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop&q=80',
    ],
  },
  {
    id: 'prod-ipad-air',
    name: 'iPad Air 11" M2 WiFi 128GB',
    description: 'La tablet más versátil de Apple con chip M2, pantalla Liquid Retina de 11 pulgadas y compatibilidad con Apple Pencil Pro y Magic Keyboard.',
    price: 2499000,
    stock: 7,
    rating: 4.8,
    categoryId: 'cat-computing',
    sellerId: 'admin-seed-id',
    images: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80',
    ],
  },
  {
    id: 'prod-samsung-buds',
    name: 'Samsung Galaxy Buds3 Pro ANC',
    description: 'Audífonos True Wireless con ANC inteligente, sonido Hi-Fi de 24 bits y diseño ergonómico con ajuste de aleta para máximo confort.',
    price: 899000,
    stock: 9,
    rating: 4.4,
    categoryId: 'cat-audio',
    sellerId: 'admin-seed-id',
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
    ],
  },
  {
    id: 'prod-keychron-k2',
    name: 'Teclado Mecánico Keychron K2 Pro',
    description: 'Teclado mecánico inalámbrico 75% compacto con switches intercambiables en caliente, retroiluminación RGB y compatibilidad Mac/Windows.',
    price: 549000,
    stock: 11,
    rating: 4.6,
    categoryId: 'cat-peripherals',
    sellerId: 'admin-seed-id',
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
    ],
  },
  {
    id: 'prod-garmin-forerunner',
    name: 'Smartwatch Garmin Forerunner 265',
    description: 'Reloj GPS para corredores con pantalla AMOLED, métricas avanzadas de rendimiento, recuperación y salud. Hasta 13 días de batería.',
    price: 1650000,
    stock: 4,
    rating: 4.7,
    categoryId: 'cat-wearables',
    sellerId: 'admin-seed-id',
    images: [
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&auto=format&fit=crop&q=80',
    ],
  },
];

// ─────────────────────────────────────────────
// FUNCIÓN PRINCIPAL
// ─────────────────────────────────────────────
async function seedDatabase() {
  console.log('\n🔥 Iniciando seed de Firebase Firestore...\n');

  // Seed Categorías
  console.log('📁 Creando colección: categories');
  for (const cat of CATEGORIES) {
    await setDoc(doc(db, 'categories', cat.id), cat);
    console.log(`   ✅ ${cat.name}`);
  }

  // Seed Productos
  console.log('\n📦 Creando colección: products');
  for (const prod of PRODUCTS) {
    await setDoc(doc(db, 'products', prod.id), prod);
    console.log(`   ✅ ${prod.name} — $${prod.price.toLocaleString('es-CO')} COP`);
  }

  console.log('\n🎉 ¡Seed completado exitosamente!');
  console.log(`   • ${CATEGORIES.length} categorías creadas`);
  console.log(`   • ${PRODUCTS.length} productos creados`);
  console.log('\n💡 Recuerda crear el usuario ADMIN desde Firebase Console → Authentication\n');
  process.exit(0);
}

seedDatabase().catch((err) => {
  console.error('\n❌ Error durante el seed:', err.message);
  console.error('   Verifica que el .env esté configurado correctamente.\n');
  process.exit(1);
});
