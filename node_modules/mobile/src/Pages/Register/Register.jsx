import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, UserPlus, Cpu } from 'lucide-react';
import { useAuth } from '../../Context/AuthContext';

export const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      return setError('Las contraseñas no coinciden.');
    }

    if (password.length < 6) {
      return setError('La contraseña debe tener al menos 6 caracteres.');
    }

    setLoading(true);

    try {
      await register(email, password, fullName);
      navigate('/home');
    } catch (err) {
      setError(err.message || 'Error al registrarse. Intenta con otro correo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center p-8 bg-gradient-to-br from-[#1e1b4b] to-[#1a1a2e] relative overflow-hidden">
      <div className="absolute -bottom-[10%] -left-[10%] w-[300px] h-[300px] bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none" />
      
      <div className="w-full max-w-[400px] mx-auto p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
        <div className="text-center mb-8 flex flex-col items-center gap-2">
          <Cpu className="text-indigo-500 drop-shadow-[0_0_10px_rgba(79,70,229,0.5)]" size={40} />
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">REGISTRO</h1>
          <p className="text-slate-400 text-sm">Únete al marketplace líder en tecnología</p>
        </div>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-300">Nombre completo</label>
            <div className="relative flex items-center">
              <User className="absolute left-4 text-slate-500" size={18} />
              <input 
                type="text" 
                className="w-full py-3 pl-12 pr-4 bg-slate-950/60 border border-white/10 rounded-2xl text-white font-medium text-sm transition-all duration-200 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/25" 
                placeholder="Juan Pérez"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-300">Correo electrónico</label>
            <div className="relative flex items-center">
              <Mail className="absolute left-4 text-slate-500" size={18} />
              <input 
                type="email" 
                className="w-full py-3 pl-12 pr-4 bg-slate-950/60 border border-white/10 rounded-2xl text-white font-medium text-sm transition-all duration-200 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/25" 
                placeholder="tuemail@malcomproyecto.com"
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
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-300">Confirmar contraseña</label>
            <div className="relative flex items-center">
              <Lock className="absolute left-4 text-slate-500" size={18} />
              <input 
                type="password" 
                className="w-full py-3 pl-12 pr-4 bg-slate-950/60 border border-white/10 rounded-2xl text-white font-medium text-sm transition-all duration-200 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/25" 
                placeholder="Repite tu contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {error && <p className="text-red-400 text-xs font-medium text-center">{error}</p>}

          <button type="submit" className="w-full btn-primary flex justify-center items-center gap-2 py-3" disabled={loading}>
            <UserPlus size={18} />
            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-slate-400">
          ¿Ya tienes una cuenta?{' '}
          <Link to="/login" className="text-cyan-400 text-xs font-semibold hover:underline cursor-pointer">
            Inicia sesión aquí
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;

