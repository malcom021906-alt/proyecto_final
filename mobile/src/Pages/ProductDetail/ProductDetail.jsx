import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, ShoppingCart, MessageSquare, Plus, Minus } from 'lucide-react';
import { useFirebaseData } from '../../Hooks/useFirebase';
import { useCart } from '../../Context/CartContext';
import { useAuth } from '../../Context/AuthContext';
import { formatCOP } from '../../Helpers/formatters';

export const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, loading } = useFirebaseData();
  const { addToCart } = useCart();
  const { currentUser } = useAuth();
  
  const [quantity, setQuantity] = useState(1);

  const product = products.find(p => p.id === id);

  if (loading) {
    return (
      <div className="min-h-screen pb-28 bg-[#1a1a2e] flex items-center justify-center h-screen">
        <p className="text-slate-400">Cargando detalles del producto...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pb-28 bg-[#1a1a2e] p-8 text-center flex flex-col justify-center items-center gap-4">
        <p className="text-slate-400">Producto no encontrado.</p>
        <button className="btn-primary" onClick={() => navigate('/home')}>Volver al Inicio</button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    alert(`¡Se agregaron ${quantity} unidades al carrito!`);
  };

  const handleGoToCart = () => {
    navigate('/cart');
  };

  return (
    <div className="min-h-screen pb-28 bg-[#1a1a2e] relative">
      {/* Botón Volver */}
      <button className="absolute top-6 left-6 z-10 bg-slate-900/60 border border-white/10 text-white w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-slate-900/80 hover:scale-110" onClick={() => navigate(-1)}>
        <ArrowLeft size={20} />
      </button>

      {/* Galería de imágenes */}
      <div className="relative w-full aspect-[1.2] bg-black/20">
        <img 
          src={product.images && product.images[0]} 
          alt={product.name} 
          className="w-full h-full object-cover" 
        />
      </div>

      {/* Contenedor del contenido */}
      <div className="p-6 flex flex-col gap-6 rounded-t-[2rem] bg-[#1a1a2e] -mt-6 relative z-10">
        <div className="flex justify-between items-start gap-4">
          <h1 className="text-2xl font-extrabold text-white leading-tight">{product.name}</h1>
          <span className="text-2xl font-extrabold text-cyan-400 whitespace-nowrap">{formatCOP(product.price)}</span>
        </div>

        <div className="flex items-center gap-6 border-b border-white/5 pb-4">
          <div className="flex items-center gap-1.5 text-yellow-500 font-bold text-sm">
            <Star className="fill-current" size={16} />
            <span>{product.rating.toFixed(1)}</span>
          </div>
          
          <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${
            product.stock === 0 
              ? 'bg-red-500/10 border-red-500/20 text-red-500' 
              : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'
          }`}>
            {product.stock === 0 ? 'Agotado' : `${product.stock} unidades disponibles`}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Descripción</span>
          <p className="text-slate-400 text-sm leading-relaxed">{product.description}</p>
        </div>

        {/* Caja de Información del Vendedor */}
        <div className="flex justify-between items-center p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
          <div className="flex items-center gap-3">
            <img 
              src="https://api.dicebear.com/7.x/bottts/svg?seed=admin" 
              alt="Vendedor" 
              className="w-10 h-10 rounded-full object-cover bg-indigo-600"
            />
            <div>
              <h4 className="text-sm font-bold text-white">Tienda Oficial Malcom</h4>
              <p className="text-xs text-slate-400">Vendedor verificado • Nivel Premium</p>
            </div>
          </div>
          <button 
            className="btn-secondary py-1.5 px-3 text-xs flex items-center gap-1" 
            onClick={handleGoToCart}
          >
            <ShoppingCart size={14} />
            Ver Carrito
          </button>
        </div>

        {/* Acciones de Compra */}
        {product.stock > 0 && (
          <div className="flex gap-4 mt-4">
            <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <button 
                className="bg-transparent border-none text-white w-10 h-11 flex items-center justify-center cursor-pointer transition-colors duration-200 hover:bg-white/5" 
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
              >
                <Minus size={16} />
              </button>
              <span className="w-8 text-center font-bold text-base text-white">{quantity}</span>
              <button 
                className="bg-transparent border-none text-white w-10 h-11 flex items-center justify-center cursor-pointer transition-colors duration-200 hover:bg-white/5" 
                onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
              >
                <Plus size={16} />
              </button>
            </div>

            <button className="flex-grow btn-primary flex justify-center items-center gap-2 py-3" onClick={handleAddToCart}>
              <ShoppingCart size={18} />
              Agregar al Carrito
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
