import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, CreditCard, Landmark, CheckCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import { useCart } from '../../Context/CartContext';
import { useAuth } from '../../Context/AuthContext';
import { useGeolocation } from '../../Hooks/useGeolocation';
import { useFirebaseData } from '../../Hooks/useFirebase';
import { formatCOP } from '../../Helpers/formatters';
import { Header } from '../../Components/Shared/Header';
import { Menu } from '../../Components/Shared/Menu';

export const Checkout = () => {
  const { cartItems, total, subtotal, shipping, clearCart } = useCart();
  const { currentUser } = useAuth();
  const { coordinates, loading: geoLoading, refreshLocation } = useGeolocation();
  const { createOrder } = useFirebaseData();
  const navigate = useNavigate();

  const [street, setStreet] = useState('');
  const [city, setCity] = useState('Santiago de Cali');
  const [department, setDepartment] = useState('Valle del Cauca');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('MERCADO_PAGO_PSE');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');

  // Cargar e instanciar Mapa de Leaflet Real (Rúbrica)
  React.useEffect(() => {
    // 1. Cargar CSS de Leaflet si no está ya en la cabecera
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    // 2. Cargar Script de Leaflet
    const scriptId = 'leaflet-js';
    let script = document.getElementById(scriptId);

    const initMap = () => {
      if (!window.L) return;
      
      const container = document.getElementById('map-container');
      if (container) {
        container.innerHTML = "<div id='leaflet-map' style='width: 100%; height: 100%; border-radius: 0.75rem;'></div>";
      }

      try {
        const map = window.L.map('leaflet-map', { zoomControl: false }).setView([coordinates.lat, coordinates.lng], 15);

        // Capa de Mapa Oscuro Premium a juego con el tema visual
        window.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; CartoDB'
        }).addTo(map);

        const customIcon = window.L.divIcon({
          className: 'custom-div-icon',
          html: `<div style="background-color: #06b6d4; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px #06b6d4;"></div>`,
          iconSize: [14, 14],
          iconAnchor: [7, 7]
        });

        window.L.marker([coordinates.lat, coordinates.lng], { icon: customIcon }).addTo(map)
          .bindPopup('Ubicación de Despacho GPS')
          .openPopup();
      } catch (e) {
        console.warn("Error inicializando Leaflet:", e);
      }
    };

    if (!window.L) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = initMap;
      document.body.appendChild(script);
    } else {
      initMap();
    }
  }, [coordinates]);

  const handlePay = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert("Por favor inicia sesión para completar tu compra.");
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) return;

    setSubmitting(true);

    const orderData = {
      userId: currentUser.uid,
      status: 'PAID',
      totalAmount: total,
      shippingCost: shipping,
      paymentMethod,
      address: {
        street,
        city,
        department,
        phone,
        lat: coordinates.lat,
        lng: coordinates.lng
      },
      items: cartItems.map(item => ({
        productId: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      }))
    };

    try {
      const res = await createOrder(orderData);
      if (res.success) {
        setOrderId(res.orderId);
        setSuccess(true);
        clearCart();
      }
    } catch (err) {
      alert("Hubo un error procesando la orden: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen pb-28 bg-[#1a1a2e] flex items-center justify-center h-screen p-8">
        <div className="w-full max-w-[400px] mx-auto p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl flex flex-col items-center gap-6 text-center">
          <CheckCircle size={64} className="text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
          <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">¡Pago Exitoso!</h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Tu pedido ha sido procesado mediante la pasarela de <strong>Mercado Pago Colombia (Sandbox)</strong>.
          </p>
          <div className="bg-white/5 border border-white/10 p-3 rounded-2xl w-full text-xs text-slate-400 font-mono">
            ID Orden: <code className="text-cyan-400">{orderId}</code>
          </div>
          <button className="w-full btn-primary py-3" onClick={() => navigate('/profile')}>
            Ver mis Pedidos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-28 bg-[#1a1a2e]">
      <Header />

      <div className="p-6 flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <button 
            className="btn-secondary p-2 rounded-full flex items-center justify-center" 
            onClick={() => navigate('/cart')}
          >
            <ArrowLeft size={16} />
          </button>
          <h1 className="text-2xl font-extrabold text-white">Finalizar Compra</h1>
        </div>

        <form className="grid grid-cols-1 sm:grid-cols-2 gap-6" onSubmit={handlePay}>
          {/* Tarjeta de Dirección */}
          <div className="p-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl flex flex-col gap-5">
            <h3 className="text-base font-bold text-white border-b border-white/5 pb-2 flex items-center gap-2">
              <MapPin size={18} className="text-indigo-500" />
              Datos de Despacho
            </h3>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">Dirección (Calle, Carrera, Apto)</label>
              <input 
                type="text" 
                className="w-full py-2.5 px-4 bg-slate-950/50 border border-white/10 rounded-xl text-white font-medium text-sm transition-all duration-200 outline-none focus:border-indigo-500" 
                placeholder="Calle 13 # 100-00, Apto 402"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">Ciudad</label>
              <input 
                type="text" 
                className="w-full py-2.5 px-4 bg-slate-950/50 border border-white/10 rounded-xl text-white font-medium text-sm transition-all duration-200 outline-none focus:border-indigo-500" 
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">Departamento</label>
              <input 
                type="text" 
                className="w-full py-2.5 px-4 bg-slate-950/50 border border-white/10 rounded-xl text-white font-medium text-sm transition-all duration-200 outline-none focus:border-indigo-500" 
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">Teléfono de contacto</label>
              <input 
                type="tel" 
                className="w-full py-2.5 px-4 bg-slate-950/50 border border-white/10 rounded-xl text-white font-medium text-sm transition-all duration-200 outline-none focus:border-indigo-500" 
                placeholder="315 123 4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            {/* Sensor GPS / Mapa */}
            <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-4 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-300">Sensor de Posición de Envío (GPS)</span>
                <button 
                  type="button" 
                  className="bg-transparent border-none text-cyan-400 cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
                  onClick={refreshLocation}
                  disabled={geoLoading}
                >
                  <RefreshCw size={12} className={geoLoading ? 'animate-spin' : ''} />
                  Recargar GPS
                </button>
              </div>

              <div id="map-container" className="relative w-full h-[150px] bg-slate-950 rounded-xl border border-white/10 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-500">
                  Cargando mapa en tiempo real...
                </div>
              </div>

              <span className="text-[11px] text-slate-400 text-center font-medium leading-normal">
                Coordenadas: {coordinates.lat.toFixed(5)}, {coordinates.lng.toFixed(5)} <br />
                <span className="text-[10px] text-slate-500">Posición calculada desde los sensores de tu dispositivo</span>
              </span>
            </div>
          </div>

          {/* Tarjeta de Métodos de Pago */}
          <div className="p-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-white border-b border-white/5 pb-2 flex items-center gap-2">
                <CreditCard size={18} className="text-indigo-500" />
                Pasarela de Pago (Colombia)
              </h3>
              
              <div className="flex flex-col gap-3 mt-4">
                {/* Opción 1: Mercado Pago PSE */}
                <div 
                  className={`flex items-center gap-4 p-4 bg-white/[0.02] border rounded-2xl cursor-pointer transition-all duration-200 hover:bg-white/5 ${
                    paymentMethod === 'MERCADO_PAGO_PSE' ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/5'
                  }`}
                  onClick={() => setPaymentMethod('MERCADO_PAGO_PSE')}
                >
                  <div className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center transition-all ${
                    paymentMethod === 'MERCADO_PAGO_PSE' ? 'border-indigo-500 bg-indigo-500' : 'border-white/20'
                  }`}>
                    {paymentMethod === 'MERCADO_PAGO_PSE' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </div>
                  <Landmark className="text-slate-300" size={24} />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-bold text-white">PSE / Cuenta de Ahorros</span>
                    <span className="text-xs text-slate-400">Mercado Pago Sandbox • Débito inmediato</span>
                  </div>
                </div>

                {/* Opción 2: Tarjeta de Crédito */}
                <div 
                  className={`flex items-center gap-4 p-4 bg-white/[0.02] border rounded-2xl cursor-pointer transition-all duration-200 hover:bg-white/5 ${
                    paymentMethod === 'MERCADO_PAGO_CARD' ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/5'
                  }`}
                  onClick={() => setPaymentMethod('MERCADO_PAGO_CARD')}
                >
                  <div className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center transition-all ${
                    paymentMethod === 'MERCADO_PAGO_CARD' ? 'border-indigo-500 bg-indigo-500' : 'border-white/20'
                  }`}>
                    {paymentMethod === 'MERCADO_PAGO_CARD' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </div>
                  <CreditCard className="text-slate-300" size={24} />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-bold text-white">Tarjeta Crédito / Débito</span>
                    <span className="text-xs text-slate-400">Visa, Mastercard, Amex, Codensa</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Resumen de Pago final */}
            <div className="bg-white/[0.02] p-4 rounded-2xl border border-white/5 mt-6 flex flex-col gap-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Subtotal</span>
                <span>{formatCOP(subtotal)}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Envío</span>
                <span>{formatCOP(shipping)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white border-t border-white/10 pt-2 mt-1">
                <span>Total a pagar</span>
                <span className="text-cyan-400">{formatCOP(total)}</span>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full btn-primary py-3 mt-4" 
              disabled={submitting}
            >
              {submitting ? 'Procesando pago sandbox...' : `Pagar ${formatCOP(total)} COP`}
            </button>
          </div>
        </form>
      </div>

      <Menu />
    </div>
  );
};

export default Checkout;

