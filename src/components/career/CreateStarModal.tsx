"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { X, Target, Loader2, Github, CheckCircle2, Search, TrendingUp } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userId: string;
}

export default function CreateStarModal({ isOpen, onClose, onSuccess, userId }: Props) {
  const [loading, setLoading] = useState(false);
  
  // GitHub Integration States
  const [githubUser, setGithubUser] = useState("");
  const [repos, setRepos] = useState<any[]>([]);
  const [fetchingRepos, setFetchingRepos] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState<any>(null);

  const supabase = createClient();

  if (!isOpen) return null;

  // Lógica de conexión real con GitHub API
  const fetchGithubRepos = async () => {
    if (!githubUser) return;
    setFetchingRepos(true);
    try {
      const res = await fetch(`https://api.github.com/users/${githubUser}/repos?sort=updated&per_page=10`);
      if (res.ok) {
        const data = await res.json();
        setRepos(data);
      } else {
        alert("Usuario de GitHub no encontrado.");
      }
    } catch (error) {
      console.error("Error fetching repos:", error);
    }
    setFetchingRepos(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    const { error } = await supabase.from("career_star_cases").insert({
      user_id: userId,
      title: formData.get("title"),
      situation: formData.get("situation"),
      task: formData.get("task"),
      action: formData.get("action"),
      result: formData.get("result"),
      impact_metric: formData.get("impact_metric"),
      github_url: selectedRepo ? selectedRepo.html_url : null,
      github_repo_name: selectedRepo ? selectedRepo.name : null,
      is_public: true // Por defecto público para el Career Hub
    });

    if (!error) {
      onSuccess();
      onClose();
    } else {
      alert("Error al guardar el caso STAR: " + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900 border border-slate-800 w-full max-w-4xl rounded-[2rem] shadow-2xl my-8 overflow-hidden flex flex-col"
      >
        <div className="bg-slate-950 px-8 py-6 border-b border-slate-800 flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 text-purple-500 rounded-xl"><Target size={24} /></div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Documentar Caso STAR</h2>
              <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">Career_Framework</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors"><X size={24} /></button>
        </div>

        <div className="p-8 overflow-y-auto max-h-[75vh] custom-scrollbar">
          <form id="star-form" onSubmit={handleSubmit} className="space-y-8">
            
            {/* 1. Título y GitHub Integration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
              <div>
                <label className="text-xs font-mono text-slate-500 uppercase tracking-widest ml-1">Título del Logro</label>
                <input required name="title" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none mt-2" placeholder="Ej: Migración de Base de Datos TEC" />
              </div>

              {/* GitHub Live Fetching UI */}
              <div>
                <label className="text-xs font-mono text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Github size={14} /> Conectar Repositorio
                </label>
                {!selectedRepo ? (
                  <div className="mt-2 space-y-3">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">github.com/</span>
                        <input 
                          value={githubUser} 
                          onChange={(e) => setGithubUser(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-[90px] pr-4 text-white focus:border-purple-500 outline-none text-sm" 
                          placeholder="username" 
                        />
                      </div>
                      <button type="button" onClick={fetchGithubRepos} disabled={fetchingRepos || !githubUser} className="bg-slate-800 hover:bg-slate-700 text-white px-4 rounded-xl transition-all">
                        {fetchingRepos ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
                      </button>
                    </div>
                    
                    {repos.length > 0 && (
                      <div className="bg-slate-950 border border-slate-800 rounded-xl max-h-32 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                        {repos.map(repo => (
                          <div 
                            key={repo.id} 
                            onClick={() => setSelectedRepo(repo)}
                            className="p-2 hover:bg-purple-500/10 rounded-lg cursor-pointer flex justify-between items-center group transition-all"
                          >
                            <span className="text-sm text-slate-300 group-hover:text-purple-400">{repo.name}</span>
                            {repo.language && <span className="text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-400 font-mono">{repo.language}</span>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="mt-2 bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-500" />
                      <span className="text-sm text-emerald-400 font-medium">{selectedRepo.name}</span>
                    </div>
                    <button type="button" onClick={() => setSelectedRepo(null)} className="text-xs text-slate-400 hover:text-red-400">Desvincular</button>
                  </div>
                )}
              </div>
            </div>

            {/* 2. El Framework S-T-A-R */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-blue-400 uppercase tracking-widest ml-1 block mb-2">S - Situación</label>
                  <textarea required name="situation" rows={3} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-300 text-sm focus:border-blue-500 outline-none resize-none" placeholder="Contexto: El proyecto final requería procesar 10k registros en tiempo real..." />
                </div>
                <div>
                  <label className="text-xs font-bold text-amber-400 uppercase tracking-widest ml-1 block mb-2">T - Tarea</label>
                  <textarea required name="task" rows={3} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-300 text-sm focus:border-amber-500 outline-none resize-none" placeholder="Mi responsabilidad era diseñar la arquitectura de la base de datos..." />
                </div>
                <div>
                  <label className="text-xs font-bold text-purple-400 uppercase tracking-widest ml-1 block mb-2">A - Acción</label>
                  <textarea required name="action" rows={4} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-300 text-sm focus:border-purple-500 outline-none resize-none" placeholder="Implementé Next.js con Supabase, usando índices B-Tree en PostgreSQL para..." />
                </div>
                <div>
                  <label className="text-xs font-bold text-emerald-400 uppercase tracking-widest ml-1 block mb-2">R - Resultado</label>
                  <textarea required name="result" rows={4} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-300 text-sm focus:border-emerald-500 outline-none resize-none" placeholder="El sistema pasó las pruebas de estrés del profesor sin caídas..." />
                </div>
              </div>
            </div>

            {/* 3. Métrica de Impacto (El "Gancho" para Reclutadores) */}
            <div className="bg-purple-500/5 border border-purple-500/20 p-6 rounded-2xl flex flex-col md:flex-row items-center gap-6">
              <div className="bg-purple-500/10 p-4 rounded-full">
                <TrendingUp size={32} className="text-purple-400" />
              </div>
              <div className="flex-1 w-full">
                <label className="text-xs font-mono text-purple-400 uppercase tracking-widest block mb-2">Métrica Cuantificable (Opcional pero clave)</label>
                <input name="impact_metric" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none" placeholder="Ej: Reducción del tiempo de carga en un 40%" />
              </div>
            </div>

          </form>
        </div>

        <div className="bg-slate-950 px-8 py-6 border-t border-slate-800 flex justify-end gap-4">
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-white px-6 py-3 font-medium transition-colors">Cancelar</button>
          <button form="star-form" type="submit" disabled={loading} className="bg-purple-600 hover:bg-purple-500 text-white font-black px-8 py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-900/20">
            {loading ? <Loader2 className="animate-spin" /> : "CONSOLIDAR CASO DE ÉXITO"}
          </button>
        </div>

      </motion.div>
    </div>
  );
}