/**
 * Helpers y utilidades del proyecto Malcom
 */

// Formatear precio a Pesos Colombianos (COP) sin decimales innecesarios
export const formatCOP = (value) => {
  const num = Number(value) || 0;
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(num);
};

// Costo de envío fijo
export const SHIPPING_COST = 15000;

// Validar correo del sistema o formato general
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

// Generar avatar por defecto basado en nombre
export const getAvatarFallback = (name) => {
  if (!name) return 'https://api.dicebear.com/7.x/bottts/svg?seed=malcom';
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=4f46e5`;
};
