# Proyecto Final - Marketplace de Tecnología 🇨🇴

Este repositorio contiene la versión productiva de **Malcom**, un marketplace móvil premium para el mercado colombiano de objetos tecnológicos (audio, wearables, computación, periféricos, foto y video). La aplicación móvil está construida en **Ionic React** con persistencia en tiempo real en **Firebase** y sensores de dispositivo, cumpliendo rigurosamente con la rúbrica del curso.

---

## 👥 Datos del Proyecto
* **Integrantes del Grupo:**
  1. Malcolm - Desarrollo Frontend Móvil & Integración de Sensores
  2. Integrante de Proyecto - Arquitectura de Datos & Colaborador Git
* **Enlace al Prototipo Original:** [Prototipo Navigable Malcom (Lovable/Figma)](https://lovable.dev/projects/malcom-proyecto)
* **Rama Principal:** `main` (todas las ramas de características y desarrollo han sido mezcladas sobre `main`).

---

## 🛠️ Stack Tecnológico Utilizado
* **Frontend Móvil:** Ionic React (`@ionic/react`) + SCSS Modules + Lucide Icons.
* **Base de Datos en Tiempo Real & Auth:** Firebase Suite:
  * **Firebase Auth:** Login real con roles protegidos.
  * **Cloud Firestore:** Almacenamiento seguro de Catálogo, Categorías y Pedidos.
  * **Firebase Realtime Database:** Mensajería y chat bidireccional comprador-vendedor instantáneo.
* **Sensores de Dispositivo:**
  * **Sensor de GPS (Geolocalización):** Para georreferenciar direcciones de envío.
  * **Sensor de Cámara:** Para capturar y cargar fotos de perfil desde el teléfono.
* **Testing:** Suite de pruebas unitarias para validación de importes de compra y formateo.

---

## 📂 Estructura del Monorepo

```
/proyecto_final
  ├── /mobile             # Aplicación Móvil en Ionic React
  │     ├── /src
  │     │     ├── /Helpers     # Formateadores, constantes y tests unitarios
  │     │     ├── /Context     # Proveedor de Autenticación y Carrito de compras
  │     │     ├── /Pages       # Vistas de Onboarding, Login, Buscar, Detalle, etc.
  │     │     ├── /Components  # Tarjetas de productos, Skeleton loaders, Navbar
  │     │     ├── /Hooks       # Conexiones en tiempo real Firebase, Sensores GPS/Cámara
  │     │     └── /Routes      # Rutas base, de comprador y de administración
  │     ├── package.json  # Dependencias del cliente
  │     └── vite.config.js # Configuración del empaquetador
  ├── /infra              # Orquestación de infraestructura local Docker
  ├── README.md           # Este archivo de documentación
  └── documentacion.md    # Documento final de alcance del sistema
```

---

## 🔑 Variables de Entorno (.env)
Crea un archivo `.env` en la raíz de la carpeta `/mobile` con las siguientes credenciales para conectar tu propio proyecto Firebase:

```env
VITE_FIREBASE_API_KEY=AIzaSyYourActualApiKeyHere
VITE_FIREBASE_AUTH_DOMAIN=malcom-proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=malcom-proyecto
VITE_FIREBASE_STORAGE_BUCKET=malcom-proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:abcdef123456
VITE_FIREBASE_DATABASE_URL=https://malcom-proyecto-rtdb.firebaseio.com
```

*Nota: Si no se configuran estas variables, la aplicación cuenta con un **Modo de Respaldo Local (Sandbox)** inteligente que permite explorar y realizar todo el flujo de compra completo utilizando bases de datos simuladas en localStorage.*

---

## ⚡ Comandos para Iniciar el Proyecto

### 1. Clonar el repositorio e instalar dependencias
```bash
cd mobile
npm install
```

### 2. Ejecutar la Aplicación en Modo Desarrollo (Vite)
```bash
npm run dev
```
Abre tu navegador en [http://localhost:5173](http://localhost:5173) para ver la aplicación web de inmediato con su diseño móvil interactivo.

### 3. Ejecutar Pruebas Unitarias
```bash
# Para correr las pruebas unitarias de lógica de carrito/checkout
npm run test
```

---

## 🧬 Datos de Semilla (Seed Data) Pre-cargados
El sistema carga automáticamente los siguientes perfiles de usuario y productos para facilitar las pruebas del evaluador:

### 1. Usuarios:
* **Administrador:**
  * Correo: `admin@malcomproyecto.com`
  * Contraseña: `malcomproyecto2026`
  * Rol: `ADMIN` *(Habilita el panel de stock y analíticas en la barra de navegación)*
* **Cliente Demo:**
  * Correo: `cliente@malcomproyecto.com`
  * Contraseña: `malcomproyecto2026`
  * Rol: `CLIENT`

### 2. Catálogo Tecnológico (6 Productos en COP reales):
1. **Sony WH-1000XM5 ANC** – $1.499.000 COP
2. **Apple Watch Series 9 GPS** – $1.899.000 COP
3. **MacBook Air 13" Apple M2** – $2.999.000 COP *(Precio límite de filtros)*
4. **Logitech MX Master 3S** – $459.000 COP
5. **GoPro HERO12 Black** – $1.999.000 COP
6. **JBL Charge 5 Waterproof** – $699.000 COP

---

## 🛰️ APIs de Backend Consumidas
* **Firebase Auth REST API:** Para autenticación federada, registros y JWT refresh tokens.
* **Google Firestore API:** Transacciones de datos de catálogo e inventario.
* **Firebase RTDB WebSocket API:** Flujo bidireccional para chat Comprador-Vendedor en tiempo real.
* **Mercado Pago Colombia Sandbox API:** Simulación de checkout y pasarela de cobros con PSE y tarjetas.
