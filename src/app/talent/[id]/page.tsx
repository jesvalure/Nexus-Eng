"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, User, Projector, Code, Award, Terminal, CheckCircle2, GraduationCap, Github, TrendingUp, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function TalentProfile({ params }: { params: { id: string } }) {
  const [talent, setTalent] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [vaultSnippets, setVaultSnippets] = useState<any[]>([]);
  const [starCases, setStarCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedStarId, setExpandedStarId] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const fetchTalentData = async () => {
      const { data: profileData } = await supabase.from("profiles").select("*").eq("id", params.id).single();
      if (profileData) setTalent(profileData);

      const { data: projectsData } = await supabase.from("projects").select("*").eq("user_id", params.id).eq("is_public", true).order("created_at", { ascending: false });
      if (projectsData) setProjects(projectsData);

      const { data: vaultData } = await supabase.from("logic_vault").select("*").eq("user_id", params.id).eq("is_public", true).limit(3);
      if (vaultData) setVaultSnippets(vaultData);

      // NUEVO: Fetch de Casos STAR Públicos
      const { data: starData } = await supabase.from("career_star_cases").select("*").eq("user_id", params.id).eq("is_public", true).order("created_at", { ascending: false });
      if (starData) setStarCases(starData);

      setLoading(false);
    };

    fetchTalentData();
  }, [params.id, supabase]);

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><Loader2 className="animate-spin text-purple-500" size={40} /></div>;
  if (!talent) return <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white"><h1 className="text-2xl font-bold mb-4">Perfil no encontrado</h1></div>;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Cabecera (Se mantiene igual que antes) */}
        <div className="space-y-6">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-sm font-medium">
            <ArrowLeft size={16} /> Volver al Talent Marketplace
          </Link>
          <header className="bg-slate-900/40 border border-slate-800 p-10 rounded-[2.5rem] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5"><User size={150} /></div>
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-purple-500/10 text-purple-400 text-xs font-black px-3 py-1 rounded-lg border border-purple-500/20 uppercase tracking-widest flex items-center gap-2">
                    <Award size={14} /> Activity Score: {talent.activity_score || 0}
                  </span>
                </div>
                <h1 className="text-5xl font-black tracking-tighter mb-2">{talent.full_name}</h1>
                <p className="text-slate-400 font-mono text-sm uppercase tracking-widest flex items-center gap-2">
                  <GraduationCap size={16} /> {talent.program} • Semestre {talent.semester}
                </p>
              </div>
              <button className="bg-white text-slate-950 px-8 py-4 rounded-2xl font-black text-sm hover:bg-slate-200 transition-all shadow-xl shadow-white/10 active:scale-95 flex items-center gap-2">
                <CheckCircle2 size={18} /> Contactar Talento
              </button>
            </div>
          </header>
        </div>

        {/* NUEVA SECCIÓN: Highlight Track Record (Casos STAR) */}
        {starCases.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <TrendingUp className="text-purple-500" /> Track Record Verificable
            </h2>
            <div className="grid gap-4">
              {starCases.map((star) => (
                <div key={star.id} className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden transition-all">
                  {/* STAR Header (Siempre visible) */}
                  <div 
                    onClick={() => setExpandedStarId(expandedStarId === star.id ? null : star.id)}
                    className="p-6 cursor-pointer hover:bg-slate-900/80 transition-colors flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                  >
                    <div className="flex-1">
                      <h3 className="font-bold text-xl text-white tracking-tight">{star.title}</h3>
                      {star.impact_metric && (
                        <p className="text-purple-400 text-sm font-medium mt-2 flex items-center gap-2">
                          <span className="bg-purple-500/20 p-1 rounded"><TrendingUp size={14} /></span> {star.impact_metric}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                      {star.github_url && (
                        <a 
                          href={star.github_url} 
                          target="_blank" 
                          rel="noreferrer" 
                          onClick={(e) => e.stopPropagation()} 
                          className="flex items-center gap-2 text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-lg hover:bg-emerald-500/20 transition-colors"
                        >
                          <Github size={14} /> Source Verificado
                        </a>
                      )}
                      <button className="text-slate-500">
                        {expandedStarId === star.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </button>
                    </div>
                  </div>

                  {/* STAR Body (Expansible) */}
                  <AnimatePresence>
                    {expandedStarId === star.id && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }} 
                        animate={{ height: "auto", opacity: 1 }} 
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-slate-800 bg-slate-950"
                      >
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-2">
                            <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest">Situación</h4>
                            <p className="text-slate-300 text-sm leading-relaxed">{star.situation}</p>
                          </div>
                          <div className="space-y-2">
                            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest">Tarea</h4>
                            <p className="text-slate-300 text-sm leading-relaxed">{star.task}</p>
                          </div>
                          <div className="space-y-2">
                            <h4 className="text-xs font-bold text-purple-400 uppercase tracking-widest">Acción</h4>
                            <p className="text-slate-300 text-sm leading-relaxed">{star.action}</p>
                          </div>
                          <div className="space-y-2">
                            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Resultado</h4>
                            <p className="text-slate-300 text-sm leading-relaxed">{star.result}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Proyectos y Snippets (Igual que antes pero en Grid si hay ambos) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 border-t border-slate-800 pt-8">
          <div className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2"><Projector className="text-blue-500" /> Proyectos Activos</h2>
            {/* ... Renderizado de projects ... */}
          </div>
          <div className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2"><Code className="text-blue-500" /> Logic Vault</h2>
            {/* ... Renderizado de vaultSnippets ... */}
          </div>
        </div>
        
      </div>
    </div>
  );
}