import Link from 'next/link';
import { ArrowRight, Terminal } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

export default async function LandingPage() {
  // Verificamos la sesión en el servidor
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Si hay usuario, el botón apunta al Dashboard, si no, al Login
  const mainHref = user ? "/dashboard" : "/auth/login";
  const buttonText = user ? "Open Dashboard" : "Launch System";

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-slate-950 overflow-hidden text-slate-200">
      
      {/* Efecto de fondo: Gradiente sutil y Grid de ingeniería */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.08),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 pointer-events-none"></div>

      {/* Contenido principal */}
      <main className="relative z-10 flex flex-col items-center text-center px-4">
        
        {/* Badge de versión */}
        <div className="flex items-center gap-2 px-3 py-1 text-xs font-medium text-blue-400 bg-blue-400/10 border border-blue-400/20 rounded-full mb-8 animate-fade-in">
          <Terminal className="h-3 w-3" />
          <span>Nexus-Eng v0.1.0 Beta</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-6 drop-shadow-2xl">
          NEXUS<span className="text-blue-500">ENG</span>
        </h1>

        <p className="max-w-xl text-lg md:text-xl text-slate-400 mb-10 leading-relaxed font-light">
          The central nervous system for your engineering career. 
          Manage <span className="text-slate-200">WBS projects</span>, <span className="text-slate-200">logic snippets</span>, and <span className="text-slate-200">STAR cases</span> in one place.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Link 
            href={mainHref} 
            className="group px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all hover:scale-105 shadow-[0_0_30px_rgba(37,99,235,0.2)] flex items-center gap-2"
          >
            {buttonText}
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link 
            href="https://github.com/jesvalure/Nexus-Eng" 
            target="_blank"
            className="px-8 py-4 bg-slate-900/50 hover:bg-slate-800 text-slate-300 font-bold rounded-xl border border-slate-800 transition-all flex items-center gap-2"
          >
            Documentation
          </Link>
        </div>
      </main>

      {/* Footer minimalista con tags de módulos */}
      <footer className="absolute bottom-8 w-full flex flex-wrap justify-center gap-4 md:gap-8 text-slate-600 text-[10px] font-mono tracking-[0.2em] uppercase">
        <span className="hover:text-blue-500 transition-colors cursor-default">Logic Repository</span>
        <span className="hidden md:inline text-slate-800">•</span>
        <span className="hover:text-blue-500 transition-colors cursor-default">WBS Engine</span>
        <span className="hidden md:inline text-slate-800">•</span>
        <span className="hover:text-blue-500 transition-colors cursor-default">Career Hub</span>
      </footer>
    </div>
  );
}