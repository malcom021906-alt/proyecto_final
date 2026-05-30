import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const SLIDES = [
  {
    title: 'Dispositivos de Última Generación',
    description: 'Explora y compra lo mejor en audio, wearables, computación, foto y video de las mejores marcas del mundo.',
    image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=500&auto=format&fit=crop&q=80'
  },
  {
    title: 'Transacciones 100% Seguras',
    description: 'Paga con total tranquilidad mediante Mercado Pago Colombia. Soporte nativo para PSE, tarjetas de crédito y Efecty.',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1d704d3?w=500&auto=format&fit=crop&q=80'
  },
  {
    title: 'Chat en Tiempo Real',
    description: 'Comunícate directamente con los vendedores para resolver dudas sobre stock, características y despachos de forma inmediata.',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=80'
  }
];

export const Onboarding = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      finishOnboarding();
    }
  };

  const finishOnboarding = () => {
    localStorage.setItem('tecnostore_onboarded', 'true');
    navigate('/login');
  };

  const slide = SLIDES[currentSlide];

  return (
    <div className="min-h-screen flex flex-col justify-between p-8 bg-gradient-to-b from-[#1e1b4b] to-[#1a1a2e] relative overflow-hidden">
      <div className="absolute -top-[10%] -right-[10%] w-[300px] h-[300px] bg-indigo-600/15 blur-[80px] rounded-full pointer-events-none" />
      
      <div className="flex justify-end pt-4">
        <button className="bg-transparent border-none text-slate-400 font-semibold cursor-pointer text-sm transition-colors duration-200 hover:text-white" onClick={finishOnboarding}>
          Omitir
        </button>
      </div>

      <div className="flex-grow flex items-center justify-center">
        <div className="flex flex-col items-center text-center gap-6 max-w-[380px] animate-fade" key={currentSlide}>
          <img 
            src={slide.image} 
            alt={slide.title} 
            className="w-full h-[220px] object-cover rounded-[2rem] border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.4)]" 
          />
          <h2 className="text-2xl font-extrabold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">{slide.title}</h2>
          <p className="text-slate-400 text-[15px] leading-relaxed">{slide.description}</p>
        </div>
      </div>

      <div className="flex flex-col gap-8 pb-8 items-center w-full">
        <div className="flex gap-2">
          {SLIDES.map((_, index) => (
            <div 
              key={index} 
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-indigo-500 w-6 shadow-[0_0_8px_rgba(79,70,229,0.8)]' 
                  : 'bg-white/20 w-2'
              }`}
            />
          ))}
        </div>

        <button className="w-full max-w-[320px] btn-primary flex justify-center items-center gap-2 py-3.5" onClick={handleNext}>
          {currentSlide === SLIDES.length - 1 ? 'Empezar' : 'Siguiente'}
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default Onboarding;

