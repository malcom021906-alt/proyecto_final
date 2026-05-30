import React from 'react';
import { Star, Plus } from 'lucide-react';
import { formatCOP } from '../../Helpers/formatters';
import { useCart } from '../../Context/CartContext';

export const CardItem = ({ product, onClick }) => {
  const { addToCart } = useCart();

  const handleAdd = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <div
      className="flex flex-col bg-[#16213e]/60 backdrop-blur-md border border-white/8 rounded-2xl overflow-hidden
                 transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/20"
      onClick={onClick}
    >
      {/* Imagen */}
      <div className="relative w-full aspect-square overflow-hidden bg-black/10">
        {product.stock <= 3 && (
          <span className="absolute top-2 left-2 z-10 bg-cyan-400/90 text-slate-900 text-xs font-bold px-2 py-0.5 rounded-lg">
            {product.stock === 0 ? 'Agotado' : 'Últimas unidades'}
          </span>
        )}
        <img
          src={product.images && product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* Contenido */}
      <div className="flex flex-col gap-2 p-3 flex-grow">
        <div className="flex items-center gap-1 text-yellow-400 text-xs font-semibold">
          <Star size={12} className="fill-current" />
          <span>{product.rating?.toFixed(1)}</span>
        </div>
        <h3 className="text-sm font-semibold text-white leading-tight line-clamp-2 h-10">
          {product.name}
        </h3>
        <div className="flex justify-between items-center mt-1">
          <span className="text-cyan-400 font-bold text-base">{formatCOP(product.price)}</span>
          {product.stock > 0 && (
            <button
              onClick={handleAdd}
              aria-label="Agregar al carrito"
              className="w-8 h-8 rounded-full bg-indigo-600 hover:bg-indigo-500 hover:scale-110
                         flex items-center justify-center transition-all duration-200 border-none cursor-pointer"
            >
              <Plus size={16} className="text-white" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardItem;
