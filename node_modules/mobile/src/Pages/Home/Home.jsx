import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFirebaseData } from '../../Hooks/useFirebase';
import { CardItem } from '../../Components/CardItem/CardItem';
import { SkeletonLoader } from '../../Components/SkeletonLoader/SkeletonLoader';
import { Header } from '../../Components/Shared/Header';
import { Menu } from '../../Components/Shared/Menu';

export const Home = () => {
  const { products, categories, loading } = useFirebaseData();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.categoryId === selectedCategory);

  return (
    <div className="min-h-screen pb-28 bg-[#1a1a2e]">
      <Header />

      <div className="p-6 flex flex-col gap-7">
        {/* Banner Promocional */}
        <div className="bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-3xl p-6 text-white relative overflow-hidden shadow-[0_10px_25px_rgba(79,70,229,0.3)] flex justify-between items-center">
          <div className="max-w-[60%] flex flex-col gap-2 z-10">
            <h2 className="text-xl font-extrabold leading-tight">¡Envío Gratis!</h2>
            <p className="text-xs opacity-90 leading-relaxed">
              Por compras superiores a $2.000.000 COP en referencias seleccionadas de Computación.
            </p>
            <button className="bg-white text-indigo-600 border-none py-2 px-4 rounded-xl font-bold text-xs cursor-pointer w-fit transition-all duration-200 hover:scale-105 hover:shadow-[0_5px_15px_rgba(255,255,255,0.3)]" onClick={() => setSelectedCategory('cat-computing')}>
              Ver Ofertas
            </button>
          </div>
          <div className="absolute -right-[50px] -top-[50px] w-[150px] h-[150px] bg-white/20 blur-[40px] rounded-full" />
          <img 
            src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&auto=format&fit=crop&q=80" 
            alt="Oferta" 
            className="w-[100px] h-[100px] object-contain z-10"
          />
        </div>

        {/* Sección Categorías */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-white">Categorías</h3>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
            {/* Categoría "Todos" */}
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

