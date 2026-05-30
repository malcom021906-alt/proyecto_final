import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ArrowLeft } from 'lucide-react';
import { useCart } from '../../Context/CartContext';
import { formatCOP } from '../../Helpers/formatters';
import { Header } from '../../Components/Shared/Header';
import { Menu } from '../../Components/Shared/Menu';

export const Cart = () => {
  const { 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    subtotal, 
    shipping, 
    total 
  } = useCart();
  
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pb-28 bg-[#1a1a2e]">
      <Header />

      <div className="p-6 flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <button 
            className="btn-secondary p-2 rounded-full flex items-center justify-center" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={16} />
          </button>
          <h1 className="text-2xl font-extrabold text-white">Mi Carrito</h1>
        </div>

        {cartItems.length > 0 ? (
          <>
            {/* Lista de productos */}
            <div className="flex flex-col gap-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 bg-[#16213e]/60 border border-white/10 rounded-2xl items-center">
                  <img src={item.images[0]} alt={item.name} className="w-[70px] h-[70px] rounded-xl object-cover bg-black/20" />
                  <div className="flex-grow flex flex-col gap-1">
                    <h3 className="text-sm font-bold text-white line-clamp-1">{item.name}</h3>
                    <span className="text-sm font-bold text-cyan-400">{formatCOP(item.price)}</span>
                    <div className="flex items-center gap-2">
                      <button 
                        className="bg-white/5 border border-white/10 text-white w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-white/10" 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus size={12} />
                      </button>
                      <span className="font-bold text-sm w-5 text-center text-white">{item.quantity}</span>
                      <button 
                        className="bg-white/5 border border-white/10 text-white w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-white/10" 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                  <button 
                    className="bg-transparent border-none text-red-500 cursor-pointer p-2 rounded-lg transition-colors duration-200 hover:bg-red-500/10" 
                    onClick={() => removeFromCart(item.id)}
                    aria-label="Eliminar producto"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            {/* Resumen de Valores */}
            <div className="p-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl flex flex-col gap-4">
              <h3 className="text-base font-extrabold text-white mb-2">Resumen de Compra</h3>
              
              <div className="flex justify-between text-sm text-slate-300">
                <span>Subtotal</span>
                <span>{formatCOP(subtotal)}</span>
              </div>
              
              <div className="flex justify-between text-sm text-slate-300">
                <span>Envío nacional (Fijo)</span>
                <span>{formatCOP(shipping)}</span>
              </div>

              <div className="flex justify-between text-lg font-extrabold text-white border-t border-white/10 pt-4">
                <span>Total</span>
                <span className="text-cyan-400">{formatCOP(total)}</span>
              </div>

              <button className="w-full mt-2 btn-primary flex justify-center items-center gap-2 py-3" onClick={() => navigate('/checkout')}>
                Proceder al Pago
                <ArrowRight size={18} />
              </button>
            </div>
          </>
        ) : (
          <div className="text-center p-16 flex flex-col items-center gap-4 text-slate-400 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
            <ShoppingCart size={48} className="text-indigo-500" />
            <h3 className="text-lg font-bold text-white">Tu carrito está vacío</h3>
            <p className="text-sm">Explora nuestras categorías y agrega productos tecnológicos increíbles.</p>
            <button className="btn-primary mt-2" onClick={() => navigate('/home')}>
              Explorar Tienda
            </button>
          </div>
        )}
      </div>

      <Menu />
    </div>
  );
};

export default Cart;

