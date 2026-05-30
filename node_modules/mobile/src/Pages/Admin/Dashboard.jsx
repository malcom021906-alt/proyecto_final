import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, ShieldAlert, Award, Package2, DollarSign } from 'lucide-react';
import { useAuth } from '../../Context/AuthContext';
import { useFirebaseData } from '../../Hooks/useFirebase';
import { formatCOP } from '../../Helpers/formatters';
import { Header } from '../../Components/Shared/Header';
import { Menu } from '../../Components/Shared/Menu';

export const Dashboard = () => {
  const { currentUser } = useAuth();
  const { products, saveProduct, loading } = useFirebaseData();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!currentUser || currentUser.role !== 'ADMIN')) {
      alert("Acceso denegado. Se requieren privilegios de Administrador.");
      navigate('/home');
    }
  }, [currentUser, loading, navigate]);

  const handleUpdateStock = async (product, newStock) => {
    const stockVal = parseInt(newStock);
    if (isNaN(stockVal) || stockVal < 0) return;

    const updatedProduct = {
      ...product,
      stock: stockVal
    };

    await saveProduct(updatedProduct);
  };

  const totalProducts = products.length;
  const totalStock = products.reduce((acc, p) => acc + p.stock, 0);
  const averagePrice = products.reduce((acc, p) => acc + Number(p.price), 0) / (totalProducts || 1);
  const totalEstSales = 8490000;

  if (loading || !currentUser || currentUser.role !== 'ADMIN') {
    return (
      <div className="min-h-screen pb-28 bg-[#1a1a2e] flex items-center justify-center h-screen">
        <p className="text-slate-400">Verificando privilegios de administrador...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-28 bg-[#1a1a2e]">
      <Header />

      <div className="p-6 flex flex-col gap-7">
        <div className="flex items-center gap-2">
          <ShieldAlert className="text-indigo-500" />
          <h1 className="text-2xl font-extrabold text-white">Panel Administrativo</h1>
        </div>

        {/* Grilla de Métricas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl flex flex-col gap-1.5">
            <DollarSign size={20} className="text-emerald-400" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ventas del Mes</span>
            <span className="text-lg font-extrabold text-white">{formatCOP(totalEstSales)}</span>
          </div>

          <div className="p-5 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl flex flex-col gap-1.5">
            <Package2 size={20} className="text-cyan-400" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Items Catálogo</span>
            <span className="text-lg font-extrabold text-white">{totalProducts} referencias</span>
          </div>

          <div className="p-5 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl flex flex-col gap-1.5">
            <Award size={20} className="text-yellow-500" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Stock Total</span>
            <span className="text-lg font-extrabold text-white">{totalStock} unidades</span>
          </div>

          <div className="p-5 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl flex flex-col gap-1.5">
            <BarChart3 size={20} className="text-indigo-300" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Precio Promedio</span>
            <span className="text-lg font-extrabold text-white">{formatCOP(averagePrice)}</span>
          </div>
        </div>

        {/* Gráfico de Ventas Simulado */}
        <div className="p-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl flex flex-col gap-4">
          <h3 className="text-base font-extrabold text-white">Participación de Ventas por Categoría</h3>
          <div className="h-[150px] flex items-end justify-around pt-4 border-b-2 border-white/10">
            <div className="flex flex-col items-center gap-2 w-full">
              <div className="w-6 bg-gradient-to-t from-indigo-600 to-cyan-400 rounded-t-lg shadow-[0_0_10px_rgba(79,70,229,0.3)] transition-all duration-1000" style={{ height: '120px' }} />
              <span className="text-[10px] text-slate-400 font-semibold text-center">Audio (52%)</span>
            </div>
            <div className="flex flex-col items-center gap-2 w-full">
              <div className="w-6 bg-gradient-to-t from-indigo-600 to-cyan-400 rounded-t-lg shadow-[0_0_10px_rgba(79,70,229,0.3)] transition-all duration-1000" style={{ height: '70px' }} />
              <span className="text-[10px] text-slate-400 font-semibold text-center">Wearables (28%)</span>
            </div>
            <div className="flex flex-col items-center gap-2 w-full">
              <div className="w-6 bg-gradient-to-t from-indigo-600 to-cyan-400 rounded-t-lg shadow-[0_0_10px_rgba(79,70,229,0.3)] transition-all duration-1000" style={{ height: '90px' }} />
              <span className="text-[10px] text-slate-400 font-semibold text-center">Computación (35%)</span>
            </div>
            <div className="flex flex-col items-center gap-2 w-full">
              <div className="w-6 bg-gradient-to-t from-indigo-600 to-cyan-400 rounded-t-lg shadow-[0_0_10px_rgba(79,70,229,0.3)] transition-all duration-1000" style={{ height: '40px' }} />
              <span className="text-[10px] text-slate-400 font-semibold text-center">Otros (15%)</span>
            </div>
          </div>
        </div>

        {/* Gestión del Catálogo */}
        <div className="flex flex-col gap-4">
          <h3 className="text-base font-extrabold text-white">Gestión de Inventario y Stock</h3>
          
          <div className="flex flex-col gap-3">
            {products.map(product => (
              <div key={product.id} className="flex gap-4 p-4 bg-[#16213e]/50 border border-white/10 rounded-2xl items-center">
                <img src={product.images[0]} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                
                <div className="flex-grow flex flex-col gap-0.5">
                  <span className="text-sm font-bold text-white">{product.name}</span>
                  <span className="text-xs text-slate-400">Precio: {formatCOP(product.price)}</span>
                </div>

                <div className="flex gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-300 font-semibold">Stock:</span>
                    <input 
                      type="number" 
                      className="w-14 p-1.5 bg-slate-950/60 border border-white/10 rounded-lg text-white text-center font-bold text-xs outline-none focus:border-indigo-500" 
                      value={product.stock}
                      onChange={(e) => handleUpdateStock(product, e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Menu />
    </div>
  );
};

export default Dashboard;

