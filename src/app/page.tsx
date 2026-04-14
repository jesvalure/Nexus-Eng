"use client";

import { useState, useEffect } from 'react'; // Añadimos useEffect
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Terminal, Cpu, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [isLaunching, setIsLaunching] = useState(false);
  const router = useRouter();

  // 1. La función de lanzamiento (ahora centralizada)
  const handleLaunch = () => {
    if (isLaunching) return; // Evitar disparos múltiples
    setIsLaunching(true);
    
    setTimeout(() => {
      router.push(isLoggedIn ? "/dashboard" : "/auth/login");
    }, 850);
  };

  // 2. Listener de Teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault(); // Evitar comportamientos por defecto del navegador
        handleLaunch();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    // Limpieza al desmontar el componente (Buena práctica de ingeniería)
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLoggedIn, isLaunching]); // Dependencias para asegurar que use los estados frescos

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-slate-950 overflow-hidden text-slate-200">
      
      {/* Background Effects (Mismos de antes) */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.08),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 pointer-events-none"></div>

      {/* Overlay de Transición */}
      <AnimatePresence>
        {isLaunching && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950"
          >
            <motion.div 
              initial={{ top: "-10%" }}
              animate={{ top: "110%" }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute left-0 w-full h-1 bg-blue-500 shadow-[0_0_20px_#3b82f6] z-[110]"
            />
            <div className="flex flex-col items-center gap-4">
              <Cpu className="h-12 w-12 text-blue-500 animate-pulse" />
              <p className="font-mono text-xs tracking-[0.3em] text-blue-400 uppercase animate-pulse">
                Initializing Kernel...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* UI Principal */}
      <motion.main 
        animate={isLaunching ? { scale: 0.95, opacity: 0, filter: "blur(10px)" } : { scale: 1, opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex flex-col items-center text-center px-4"
      >
        <div className="flex items-center gap-2 px-3 py-1 text-xs font-medium text-blue-400 bg-blue-400/10 border border-blue-400/20 rounded-full mb-8">
          <Terminal className="h-3 w-3" />
          <span>Nexus-Eng v0.1.0 Beta</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-6">
          NEXUS<span className="text-blue-500">ENG</span>
        </h1>

        <p className="max-w-xl text-lg md:text-xl text-slate-400 mb-10 leading-relaxed font-light">
          The central nervous system for your engineering career. 
          {/* <span className="block mt-2 text-sm font-mono text-slate-500">Press [ENTER] to launch system.</span> */}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <button 
            onClick={handleLaunch}
            disabled={isLaunching}
            className="group relative px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(37,99,235,0.2)] flex items-center gap-2 overflow-hidden"
          >
            {isLaunching ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
              
                {isLoggedIn ? "Open Dashboard" : "Launch System"}
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
            <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white/20 opacity-40 group-hover:animate-shine" />
          </button>
        </div>
      </motion.main>
    </div>
  );
}