import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Battery, BatteryCharging, Smartphone } from 'lucide-react';
import { useFirebaseData } from '../../Hooks/useFirebase';
import { CardItem } from '../../Components/CardItem/CardItem';
import { SkeletonLoader } from '../../Components/SkeletonLoader/SkeletonLoader';
import { Header } from '../../Components/Shared/Header';
import { Menu } from '../../Components/Shared/Menu';
import { useBattery } from '../../Hooks/useBattery';
import styles from './Home.module.scss';

export const Home = () => {
  const { products, categories, loading } = useFirebaseData();
  const { batteryLevel, isCharging } = useBattery();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCoupon, setShowCoupon] = useState(false);
  const navigate = useNavigate();

  // Activar modo de bajo consumo si la batería es baja (< 20%) y no está cargando
  const isLowBatteryMode = batteryLevel < 0.20 && !isCharging;

  // Sensor de Acelerómetro (Shake to discount)
  useEffect(() => {
    let lastUpdate = 0;
    let lastX = 0, lastY = 0, lastZ = 0;
    const SHAKE_THRESHOLD = 900; 

    const handleMotion = (event) => {
      const acceleration = event.accelerationIncludingGravity;
      if (!acceleration) return;

      const curTime = Date.now();
      if ((curTime - lastUpdate) > 100) {
        const diffTime = curTime - lastUpdate;
        lastUpdate = curTime;

        const x = acceleration.x || 0;
        const y = acceleration.y || 0;
        const z = acceleration.z || 0;

        const speed = Math.abs(x + y + z - lastX - lastY - lastZ) / diffTime * 10000;

        if (speed > SHAKE_THRESHOLD) {
          setShowCoupon(true);
        }

        lastX = x;
        lastY = y;
        lastZ = z;
      }
    };

    if (window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', handleMotion);
    }

    return () => {
      if (window.DeviceMotionEvent) {
        window.removeEventListener('devicemotion', handleMotion);
      }
    };
  }, []);

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.categoryId === selectedCategory);

  return (
    <div className={`min-h-screen pb-28 transition-colors duration-500 ${isLowBatteryMode ? 'bg-black' : 'bg-[#1a1a2e]'}`}>
      <Header />

      <div className="p-6 flex flex-col gap-7">
        
        {/* Banner de Sensor de Batería */}
        {isLowBatteryMode && (
          <div className="bg-amber-600/25 border border-amber-500/40 rounded-2xl p-4 flex items-center justify-between text-white text-xs">
            <div className="flex items-center gap-2">
              <Battery size={18} className="text-amber-400 animate-pulse" />
              <span>
                <strong>Modo Ahorro Activado:</strong> Batería al {(batteryLevel * 100).toFixed(0)}%. Animaciones del sistema desactivadas.
              </span>
            </div>
          </div>
        )}

        {/* Banner Promocional / Acelerómetro */}
        <div className={styles.shakeBanner}>
          <div className="max-w-[70%] flex flex-col gap-2 z-10 text-white">
            <span className={styles.shakeLabel}>
              <Smartphone size={10} className="inline mr-1" /> Sensor de Movimiento
            </span>
            <h2 className="text-xl font-extrabold leading-tight">¡Agita tu celular!</h2>
            <p className="text-xs opacity-90 leading-relaxed">
              Prueba los sensores de movimiento físicos agitando tu dispositivo móvil para recibir una sorpresa en tiempo real.
            </p>
            {showCoupon ? (
              <div className="bg-white/20 border border-white/40 p-2 rounded-xl text-center font-bold text-sm tracking-wide text-cyan-200 mt-2 animate-bounce">
                🎉 ¡CUPÓN ACTIVADO: <code className="text-white font-mono bg-indigo-950/60 px-2 py-0.5 rounded">SHAKESTORE</code>! (10% OFF)
              </div>
            ) : (
              <button 
                className="bg-white text-indigo-600 border-none py-2 px-4 rounded-xl font-bold text-xs cursor-pointer w-fit transition-all duration-200 hover:scale-105" 
                onClick={() => setShowCoupon(true)}
              >
                Simular Agitar
              </button>
            )}
          </div>
          <div className="absolute -right-[50px] -top-[50px] w-[150px] h-[150px] bg-white/20 blur-[40px] rounded-full" />
          <Sparkles className="w-[80px] h-[80px] text-white/30 z-10" />
        </div>

        {/* Sección Categorías */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-white">Categorías</h3>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
            <div 
              className="flex-shrink-0 flex flex-col items-center gap-2 w-20 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 group"
              onClick={() => setSelectedCategory('all')}
            >
              <div className={`w-14 h-14 rounded-full overflow-hidden border-2 transition-all duration-200 group-hover:border-indigo-500 group-hover:shadow-[0_0_10px_rgba(79,70,229,0.5)] ${
                selectedCategory === 'all' 
                  ? 'border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.6)]' 
                  : 'border-white/10'
              }`}>
                <img 
                  src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=100&auto=format&fit=crop&q=80" 
                  alt="Todos" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <span className={`text-xs font-semibold text-center whitespace-nowrap transition-colors ${
                selectedCategory === 'all' ? 'text-white font-bold' : 'text-slate-400'
              }`}>Todos</span>
            </div>

            {categories.map(cat => (
              <div 
                key={cat.id} 
                className="flex-shrink-0 flex flex-col items-center gap-2 w-20 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 group"
                onClick={() => setSelectedCategory(cat.id)}
              >
                <div className={`w-14 h-14 rounded-full overflow-hidden border-2 transition-all duration-200 group-hover:border-indigo-500 group-hover:shadow-[0_0_10px_rgba(79,70,229,0.5)] ${
                  selectedCategory === cat.id 
                    ? 'border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.6)]' 
                    : 'border-white/10'
                }`}>
                  <img 
                    src={cat.imageUrl} 
                    alt={cat.name} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <span className={`text-xs font-semibold text-center whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id ? 'text-white font-bold' : 'text-slate-400'
                }`}>{cat.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sección Productos Destacados */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-white">Productos Destacados</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {loading ? (
              Array(6).fill(0).map((_, i) => <SkeletonLoader key={i} />)
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <CardItem 
                  key={product.id} 
                  product={product} 
                  onClick={() => navigate(`/product/${product.id}`)}
                />
              ))
            ) : (
              <p className="col-span-full text-center text-slate-400 py-8">
                No hay productos en esta categoría por el momento.
              </p>
            )}
          </div>
        </div>
      </div>

      <Menu />
    </div>
  );
};

export default Home;

