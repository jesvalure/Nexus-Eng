import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-slate-950 overflow-hidden">
      
      {/* Efecto de fondo: Gradiente sutil */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>

      {/* Contenido principal */}
      <main className="relative z-10 flex flex-col items-center text-center px-4">
        
        {/* Badge de versión */}
        <span className="px-3 py-1 text-xs font-medium text-blue-400 bg-blue-400/10 border border-blue-400/20 rounded-full mb-8">
          Nexus-Eng v0.1.0 Beta
        </span>

        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-6">
          NEXUS<span className="text-blue-500">ENG</span>
        </h1>

        <p className="max-w-xl text-lg md:text-xl text-slate-400 mb-10 leading-relaxed">
          The central nervous system for your engineering career. 
          Manage WBS projects, logic snippets, and your professional growth in one place.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            href="/auth/login" 
            className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all hover:scale-105 shadow-[0_0_20px_rgba(37,99,235,0.3)]"
          >
            Launch System
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

      {/* Footer minimalista */}
      <footer className="absolute bottom-8 w-full flex justify-center gap-8 text-slate-600 text-xs font-mono tracking-widest uppercase">
        <span>Logic Repository</span>
        <span>•</span>
        <span>WBS Engine</span>
        <span>•</span>
        <span>Career Hub</span>
      </footer>
    </div>
  );
}