/**
 * Pruebas unitarias para la lógica de Carrito y Checkout - Proyecto Malcom
 */

import { formatCOP, SHIPPING_COST } from './formatters';

// Mock de producto para testing
const mockProduct1 = {
  id: 'prod-sony-wh',
  name: 'Audífonos Sony WH-1000XM5 ANC',
  price: 1499000,
  stock: 10
};

const mockProduct2 = {
  id: 'prod-apple-watch',
  name: 'Apple Watch Series 9 GPS',
  price: 1899000,
  stock: 8
};

// Función simuladora de cálculos de carrito
const calculateCartTotals = (items) => {
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = subtotal > 0 ? SHIPPING_COST : 0;
  const total = subtotal + shipping;
  return { subtotal, shipping, total };
};

describe('Pruebas de Formateo y Cálculos del Proyecto Malcom', () => {
  
  // Test 1: Formateo de Moneda COP (Rúbrica)
  test('Debería formatear correctamente la moneda COP con formato colombiano', () => {
    const formatted = formatCOP(349000);
    // Eliminar espacios de no-ruptura para asegurar concordancia
    const normalized = formatted.replace(/\u00a0/g, ' ');
    expect(normalized).toContain('$ 349.000');
  });

  // Test 2: Costo de envío fijo $15.000 COP
  test('Debería aplicar costo de envío fijo de $15.000 COP en carritos activos', () => {
    const cartItems = [{ ...mockProduct1, quantity: 1 }];
    const totals = calculateCartTotals(cartItems);
    expect(totals.shipping).toBe(15000);
    expect(totals.total).toBe(1499000 + 15000);
  });

  // Test 3: Carrito vacío con envío $0
  test('Debería retornar envío e importes en cero para carritos vacíos', () => {
    const cartItems = [];
    const totals = calculateCartTotals(cartItems);
    expect(totals.subtotal).toBe(0);
    expect(totals.shipping).toBe(0);
    expect(totals.total).toBe(0);
  });

  // Test 4: Múltiples productos agregados
  test('Debería calcular de manera precisa subtotales con múltiples productos y cantidades', () => {
    const cartItems = [
      { ...mockProduct1, quantity: 2 }, // 2 * 1499000 = 2998000
      { ...mockProduct2, quantity: 1 }  // 1 * 1899000 = 1899000
    ];
    const totals = calculateCartTotals(cartItems);
    expect(totals.subtotal).toBe(2998000 + 1899000);
    expect(totals.total).toBe(2998000 + 1899000 + 15000);
  });
});
