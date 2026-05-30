import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, Star, RefreshCw } from 'lucide-react';
import { useFirebaseData } from '../../Hooks/useFirebase';
import { CardItem } from '../../Components/CardItem/CardItem';
import { Header } from '../../Components/Shared/Header';
import { Menu } from '../../Components/Shared/Menu';
import { formatCOP } from '../../Helpers/formatters';

export const Search = () => {
  const { products, categories } = useFirebaseData();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [maxPrice, setMaxPrice] = useState(3000000);
  const [minRating, setMinRating] = useState(0);

  const filteredProducts = products.filter(product => {
    const matchesQuery = product.name.toLowerCase().includes(query.toLowerCase()) || 
                         product.description.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = selectedCat === 'all' || product.categoryId === selectedCat;
    const matchesPrice = Number(product.price) <= maxPrice;
    const matchesRating = product.rating >= minRating;

    return matchesQuery && matchesCategory && matchesPrice && matchesRating;
  });

  const handleReset = () => {
    setQuery('');
    setSelectedCat('all');
    setMaxPrice(3000000);
    setMinRating(0);
  };

  return (
    <div className="min-h-screen pb-28 bg-[#1a1a2e]">
      <Header />

      <div className="p-6 flex flex-col gap-6">
        {/* Barra de Búsqueda */}
        <div className="relative flex items-center">
          <SearchIcon className="absolute left-4 text-slate-500" size={18} />
          <input 
            type="text" 
            className="w-full py-3 pl-12 pr-4 bg-[#22213e]/60 border border-white/10 rounded-2xl text-white font-medium text-sm transition-all duration-200 outline-none focus:border-indigo-500" 
            placeholder="Buscar audífonos, computadores, relojes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* Panel de Filtros */}
        <div className="p-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl flex flex-col gap-5">
          <div className="flex justify-between items-center">
            <h4 className="text-base font-bold text-white border-b border-white/5 pb-2 w-full">Filtros Avanzados</h4>
          </div>

          {/* Categorías */}
          <div className="flex flex-col gap-2.5">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Categoría</span>
            <div className="flex flex-wrap gap-2">
              <button 
                className={`bg-white/5 border border-white/10 text-slate-400 py-1.5 px-3 rounded-full text-xs font-semibold cursor-pointer transition-all duration-200 hover:bg-white/10 hover:text-white ${
                  selectedCat === 'all' ? 'bg-indigo-600 text-white border-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.4)]' : ''
                }`}
                onClick={() => setSelectedCat('all')}
              >
                Todos
              </button>
              {categories.map(cat => (
                <button 
                  key={cat.id}
                  className={`bg-white/5 border border-white/10 text-slate-400 py-1.5 px-3 rounded-full text-xs font-semibold cursor-pointer transition-all duration-200 hover:bg-white/10 hover:text-white ${
                    selectedCat === cat.id ? 'bg-indigo-600 text-white border-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.4)]' : ''
                  }`}
                  onClick={() => setSelectedCat(cat.id)}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Precio Máximo */}
          <div className="flex flex-col gap-2.5">
            <div className="flex justify-between w-full">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Precio Máximo</span>
              <span className="text-sm text-cyan-400 font-bold">
                {formatCOP(maxPrice)}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <input 
                type="range" 
                min="100000" 
                max="3000000" 
                step="50000"
                value={maxPrice} 
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-xs text-slate-400 font-semibold">
                <span>$100.000</span>
                <span>$3.000.000 COP</span>
              </div>
            </div>
          </div>

          {/* Calificación */}
          <div className="flex flex-col gap-2.5">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Calificación mínima</span>
            <div className="flex gap-2">
              {[0, 3, 4, 4.5].map((stars) => (
                <button 
                  key={stars}
                  className={`bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 min-w-[3.5rem] h-9 flex items-center justify-center gap-1 cursor-pointer text-slate-300 text-xs font-bold transition-all duration-200 hover:border-yellow-500 hover:text-white ${
                    minRating === stars ? 'border-yellow-500 bg-yellow-500/10 text-yellow-500' : ''
                  }`}
                  onClick={() => setMinRating(stars)}
                >
                  {stars === 0 ? 'Cualquiera' : (
                    <>
                      {stars} <Star className="fill-current text-yellow-500" size={12} />
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Botón Reset */}
          <button 
            className="btn-secondary py-2.5 text-xs flex justify-center items-center gap-2" 
            onClick={handleReset}
          >
            <RefreshCw size={14} />
            Restablecer Filtros
          </button>
        </div>

        {/* Resultados */}
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm text-slate-400 font-medium">
            {filteredProducts.length} productos encontrados
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <CardItem 
                key={product.id} 
                product={product} 
                onClick={() => navigate(`/product/${product.id}`)}
              />
            ))
          ) : (
            <p className="col-span-full text-center text-slate-400 py-12">
              No encontramos productos que coincidan con tu búsqueda. ¡Prueba ajustando los filtros!
            </p>
          )}
        </div>
      </div>

      <Menu />
    </div>
  );
};

export default Search;

