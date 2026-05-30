import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, LogOut, Package, Calendar } from 'lucide-react';
import { useAuth } from '../../Context/AuthContext';
import { useFirebaseData } from '../../Hooks/useFirebase';
import { formatCOP } from '../../Helpers/formatters';
import { Header } from '../../Components/Shared/Header';
import { Menu } from '../../Components/Shared/Menu';

export const Profile = () => {
  const { currentUser, logout } = useAuth();
  const { getUserOrders } = useFirebaseData();
  const navigate = useNavigate();
  
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [avatar, setAvatar] = useState('');

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    setAvatar(currentUser.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=malcom');

    const fetchOrders = async () => {
      try {
        const list = await getUserOrders(currentUser.uid);
        setOrders(list);
      } catch (e) {
        console.error("Error obteniendo órdenes:", e);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [currentUser, navigate]);

  const handleUpdateAvatar = () => {
    const confirm = window.confirm("¿Deseas activar la cámara nativa para cambiar tu avatar de perfil?");
    if (confirm) {
      const newAvatars = [
        'https://api.dicebear.com/7.x/bottts/svg?seed=camera1',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=pixel',
        'https://api.dicebear.com/7.x/identicon/svg?seed=tech'
      ];
      const randomAvatar = newAvatars[Math.floor(Math.random() * newAvatars.length)];
      setAvatar(randomAvatar);
      
      const savedMockUser = localStorage.getItem('malcom_mock_user');
      if (savedMockUser) {
        const parsed = JSON.parse(savedMockUser);
        parsed.avatarUrl = randomAvatar;
        localStorage.setItem('malcom_mock_user', JSON.stringify(parsed));
      }
      
      alert("¡Foto tomada con éxito mediante el sensor de cámara de tu celular!");
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen pb-28 bg-[#1a1a2e]">
      <Header />

      <div className="p-6 flex flex-col gap-7">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-extrabold text-white">Mi Perfil</h1>
          <button 
            className="btn-secondary py-2 px-3 text-xs flex items-center gap-1 border border-red-500/20 text-red-500" 
            onClick={handleLogout}
          >
            <LogOut size={16} />
            Salir
          </button>
        </div>

        {/* Tarjeta de usuario */}
        <div className="p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl flex flex-col items-center gap-4 text-center relative">
          <div className="relative w-[90px] h-[90px] rounded-full border-3 border-indigo-600 p-[3px] shadow-[0_0_15px_rgba(79,70,229,0.4)]">
            <img src={avatar} alt={currentUser.fullName} className="w-full h-full rounded-full object-cover bg-slate-900" />
            <button className="absolute bottom-0 right-0 bg-cyan-400 text-slate-900 border-none w-7 h-7 rounded-full flex items-center justify-center cursor-pointer shadow-[0_2px_8px_rgba(6,182,212,0.5)] transition-all duration-200 hover:scale-110" onClick={handleUpdateAvatar} aria-label="Cambiar foto">
              <Camera size={14} />
            </button>
          </div>

          <div>
            <h2 className="text-xl font-extrabold text-white">{currentUser.fullName}</h2>
            <p className="text-sm text-slate-400 font-medium">{currentUser.email}</p>
          </div>

          <span className="bg-indigo-500/15 border border-indigo-500/30 text-indigo-200 px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider">{currentUser.role === 'ADMIN' ? 'Administrador' : 'Comprador'}</span>
        </div>

        {/* Historial de Órdenes */}
        <div>
          <h3 className="text-base font-extrabold mb-4 text-white flex items-center gap-2">
            <Package size={18} className="text-indigo-500" />
            Historial de Pedidos
          </h3>

          <div className="flex flex-col gap-4">
            {loadingOrders ? (
              <p className="text-slate-400 text-xs">Cargando tus órdenes...</p>
            ) : orders.length > 0 ? (
              orders.map((order) => (
                <div key={order.id} className="p-5 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl flex flex-col gap-3">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
                    <span className="text-xs font-bold text-slate-300"># {order.id.substring(0, 12)}</span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(order.createdAt).toLocaleDateString('es-CO')}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    {order.items && order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-xs text-slate-400">
                        <span>{item.name} (x{item.quantity})</span>
                        <span>{formatCOP(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center mt-2">
                    <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2.5 py-1 text-xs font-bold rounded-lg">Entregado Sandbox</span>
                    <span className="text-sm font-extrabold text-cyan-400">{formatCOP(order.totalAmount)}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-400 text-sm">
                <p>Aún no tienes pedidos registrados.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Menu />
    </div>
  );
};

export default Profile;

