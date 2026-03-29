import { HardHat, Wrench, Cpu, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-center">
      {/* Icono animado de construcción */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full animate-pulse"></div>
        <div className="relative bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-2xl">
          <HardHat className="h-16 w-16 text-blue-500 animate-bounce" />
        </div>
        <Wrench className="absolute -bottom-2 -right-2 h-8 w-8 text-slate-500 bg-slate-950 rounded-full p-1.5 border border-slate-800" />
      </div>

      <h1 className="text-4xl font-black text-white tracking-tighter mb-4">
        SETTINGS <span className="text-blue-500">ENGINE</span>
      </h1>
      
      <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6">
        <Cpu className="h-3 w-3 text-blue-400" />
        <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">Status: Optimization in progress</span>
      </div>

      <p className="max-w-md text-slate-400 leading-relaxed mb-10">
        The configuration core is currently undergoing a refactor to support multi-tenant parameters. 
        Deployment of this module is scheduled for the next development cycle.
      </p>

      <Link 
        href="/dashboard" 
        className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-white transition-colors group"
      >
        <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        Return to Command Center
      </Link>

      {/* Decoración de fondo tipo código */}
      <div className="mt-12 font-mono text-[10px] text-slate-800 select-none">
        <code>
          {`// TODO: Implement user profile preferences`} <br />
          {`// TODO: Add API Key management for Supabase`} <br />
          {`// STACK_STATUS: Stable_v0.1.0`}
        </code>
      </div>
    </div>
  );
}