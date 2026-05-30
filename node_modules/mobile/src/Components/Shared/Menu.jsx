import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Search, ShoppingCart, User, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../Context/AuthContext';
import { useCart } from '../../Context/CartContext';
import styles from './Menu.module.scss';

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
        className={`${styles.menuBtn} ${isActive ? styles.active : ''}`}
        onClick={() => navigate(path)}
      >
        <div className="relative">
          <Icon 
            className={`w-[22px] h-[22px] transition-all duration-200 ${
              isActive ? 'text-indigo-500 drop-shadow-[0_0_8px_rgba(79,70,229,0.6)] -translate-y-0.5' : 'text-slate-400'
            }`} 
          />
          {badge > 0 && (
            <span className={styles.badge}>
              {badge > 9 ? '9+' : badge}
            </span>
          )}
        </div>
        <span className="text-[11px] font-semibold">{label}</span>
        {isActive && (
          <span className={styles.activeDot}></span>
        )}
      </button>
    );
  };

  return (
    <nav className={styles.navContainer}>
      {renderMenuItem('/home', Home, 'Inicio')}
      {renderMenuItem('/search', Search, 'Buscar')}
      {renderMenuItem('/cart', ShoppingCart, 'Carrito', totalItems)}
      {renderMenuItem('/profile', User, 'Perfil')}
      {userRole === 'ADMIN' && renderMenuItem('/admin', ShieldAlert, 'Admin')}
    </nav>
  );
};

export default Menu;

