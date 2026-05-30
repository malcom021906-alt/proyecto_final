import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, Cpu, Globe } from 'lucide-react';

import { useAuth } from '../../Context/AuthContext';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/home');
    } catch (err) {
      setError(err.message || 'Error de autenticación. Verifica tus datos.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    setEmail(provider === 'Google' ? 'cliente@proyectostore.com' : 'admin@proyectostore.com');
    setPassword('proyectostore2026');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center p-8 bg-gradient-to-br from-[#1e1b4b] to-[#1a1a2e] relative overflow-hidden">
      <div className="absolute -bottom-[10%] -left-[10%] w-[300px] h-[300px] bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none" />
      
      <div className="w-full max-w-[400px] mx-auto p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
        <div className="text-center mb-8 flex flex-col items-center gap-2">
          <Cpu className="text-indigo-500 drop-shadow-[0_0_10px_rgba(79,70,229,0.5)]" size={40} />
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">TECNOSTORE</h1>
          <p className="text-slate-400 text-sm">Marketplace de tecnología colombiana</p>
        </div>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-300">Correo electrónico</label>
            <div className="relative flex items-center">
              <Mail className="absolute left-4 text-slate-500" size={18} />
              <input 
                type="email" 
                className="w-full py-3 pl-12 pr-4 bg-slate-950/60 border border-white/10 rounded-2xl text-white font-medium text-sm transition-all duration-200 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/25" 
                placeholder="ejemplo@proyectostore.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-300">Contraseña</label>
            <div className="relative flex items-center">
              <Lock className="absolute left-4 text-slate-500" size={18} />
              <input 
                type="password" 
                className="w-full py-3 pl-12 pr-4 bg-slate-950/60 border border-white/10 rounded-2xl text-white font-medium text-sm transition-all duration-200 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/25" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {error && <p className="text-red-400 text-xs font-medium text-center">{error}</p>}

          <div className="text-right">
            <span className="text-cyan-400 text-xs font-semibold hover:underline cursor-pointer" onClick={() => alert("Se ha enviado un enlace de recuperación a: " + (email || "tu correo"))}>
              ¿Olvidaste tu contraseña?
            </span>
          </div>

          <button type="submit" className="w-full btn-primary flex justify-center items-center gap-2 py-3" disabled={loading}>
            <LogIn size={18} />
            {loading ? 'Iniciando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="flex items-center text-center text-slate-500 text-xs my-6 before:content-[''] before:flex-1 before:border-b before:border-white/10 before:mr-2 after:content-[''] after:flex-1 after:border-b after:border-white/10 after:ml-2">O inicia sesión con</div>

        <div className="grid grid-cols-2 gap-4">
          <button className="bg-white/5 border border-white/10 text-white py-3 px-4 rounded-2xl font-semibold text-xs cursor-pointer flex items-center justify-center gap-2 transition-all duration-200 hover:bg-white/10 hover:border-white/20" onClick={() => handleSocialLogin('Google')}>
            <Globe size={18} />
            Google
          </button>
          <button className="bg-white/5 border border-white/10 text-white py-3 px-4 rounded-2xl font-semibold text-xs cursor-pointer flex items-center justify-center gap-2 transition-all duration-200 hover:bg-white/10 hover:border-white/20" onClick={() => handleSocialLogin('Apple')}>
            <Globe size={18} />
            Apple
          </button>
        </div>

        <div className="text-center mt-6 text-sm text-slate-400">
          ¿No tienes una cuenta?{' '}
          <Link to="/register" className="text-cyan-400 text-xs font-semibold hover:underline cursor-pointer">
            Regístrate aquí
          </Link>
        </div>

        <div className="mt-6 p-4 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-xs text-slate-300 leading-relaxed shadow-inner">
          💡 <strong>Credenciales Seed:</strong><br />
          • Admin: <code>admin@proyectostore.com</code><br />
          • Cliente: <code>cliente@proyectostore.com</code><br />
          • Contraseña: <code>proyectostore2026</code>
        </div>
      </div>
    </div>
  );
};

export default Login;

