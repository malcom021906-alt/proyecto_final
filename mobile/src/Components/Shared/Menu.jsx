import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Search, ShoppingCart, User, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../Context/AuthContext';
import { useCart } from '../../Context/CartContext';

export const Menu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userRole } = useAuth();
  const { cartItems } = useCart();

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const renderMenuItem = (path, Icon, label, badge) => {
    const isActive = location.pathname === path;
    return (
      <button 
        className={`flex flex-col items-center gap-1 no-underline bg-transparent border-none cursor-pointer p-2 rounded-2xl transition-all duration-200 relative ${
          isActive ? 'text-indigo-500 font-bold' : 'text-slate-400 hover:text-white'
        }`}
        onClick={() => navigate(path)}
      >
        <div className="relative">
          <Icon 
            className={`w-[22px] h-[22px] transition-all duration-200 ${
              isActive ? 'text-indigo-500 drop-shadow-[0_0_8px_rgba(79,70,229,0.6)] -translate-y-0.5' : 'text-slate-400'
            }`} 
          />
          {badge > 0 && (
            <span className="absolute -top-2 -right-2 bg-cyan-400 text-slate-900 text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-[0_0_8px_rgba(6,182,212,0.6)]">
              {badge > 9 ? '9+' : badge}
            </span>
          )}
        </div>
        <span className="text-[11px] font-semibold">{label}</span>
        {isActive && (
          <span className="absolute bottom-[-1px] w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_8px_#06b6d4]"></span>
        )}
      </button>
    );
  };

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[480px] bg-[#16213e]/85 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex justify-around py-2.5 px-4 z-[1000] transition-all duration-300">
      {renderMenuItem('/home', Home, 'Inicio')}
      {renderMenuItem('/search', Search, 'Buscar')}
      {renderMenuItem('/cart', ShoppingCart, 'Carrito', totalItems)}
      {renderMenuItem('/profile', User, 'Perfil')}
      {userRole === 'ADMIN' && renderMenuItem('/admin', ShieldAlert, 'Admin')}
    </nav>
  );
};

export default Menu;

