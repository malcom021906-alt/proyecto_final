import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Cpu, User } from 'lucide-react';
import { useCart } from '../../Context/CartContext';
import { useAuth } from '../../Context/AuthContext';

export const Header = () => {
  const { totalItemsCount } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 flex justify-between items-center py-4 px-6 bg-[#1a1a2e]/80 backdrop-blur-xl border-b border-white/10">
      <Link to="/home" className="flex items-center gap-2 text-white no-underline">
        <Cpu className="text-indigo-600 drop-shadow-[0_0_8px_rgba(79,70,229,0.6)]" size={28} />
        <div className="flex flex-col leading-tight">
          <span className="text-xl font-extrabold tracking-tight">TECNOSTORE</span>
          <span className="text-[10px] text-cyan-400 font-bold tracking-widest uppercase -mt-1">Tech</span>
        </div>
      </Link>

      <div className="flex items-center gap-4">
        <button 
          className="bg-white/5 text-white border border-white/10 w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-200 relative hover:bg-white/10 hover:-translate-y-0.5 hover:border-indigo-500/30" 
          onClick={() => navigate('/cart')}
          aria-label="Ver Carrito"
        >
          <ShoppingBag size={20} />
          {totalItemsCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center">{totalItemsCount}</span>
          )}
        </button>

        <button 
          className="bg-white/5 text-white border border-white/10 w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-200 relative hover:bg-white/10 hover:-translate-y-0.5 hover:border-indigo-500/30 overflow-hidden" 
          onClick={() => navigate('/profile')}
          aria-label="Perfil de usuario"
        >
          {currentUser && currentUser.avatarUrl ? (
            <img 
              src={currentUser.avatarUrl} 
              alt="Avatar" 
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <User size={20} />
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;

