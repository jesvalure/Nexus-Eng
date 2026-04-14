"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Plus, 
  ListTree, 
  Projector,
  Calendar,
  ChevronRight,
  Loader2,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function WBSPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchProjects() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from("projects")
          .select(`
            *,
            wbs_tasks (id, status)
          `)
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (!error) setProjects(data);
      }
      setLoading(false);
    }
    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-950 gap-4">
        <Loader2 className="animate-spin text-blue-500 h-10 w-10" />
        <p className="text-slate-500 font-mono text-[10px] tracking-[0.2em] uppercase">Loading_Project_Registry...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 min-h-screen">
      {/* Header */}
      <header className="flex justify-between items-end border-b border-slate-900 pb-8">
        <div>
          <h1 className="text-4xl font-black text-white flex items-center gap-3 tracking-tighter">
            <ListTree className="text-blue-500 h-10 w-10" /> WBS ENGINE
          </h1>
          <p className="text-slate-400 mt-2 font-medium">Selecciona un proyecto para desglosar su estructura técnica.</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-blue-900/20 active:scale-95">
          <Plus size={20} /> Nuevo Proyecto
        </button>
      </header>

      {/* Grid de Proyectos */}
      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-800 rounded-[2rem] bg-slate-900/20">
          <AlertCircle className="text-slate-600 h-12 w-12 mb-4" />
          <p className="text-slate-500 font-mono">No se detectaron proyectos activos en el Kernel.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, i) => {
            const totalTasks = project.wbs_tasks?.length || 0;
            const completedTasks = project.wbs_tasks?.filter((t: any) => t.status === 'done').length || 0;
            const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={`/wbs/projects/${project.id}`}>
                  <div className="group bg-slate-900/40 border border-slate-800 p-8 rounded-[2rem] hover:border-blue-500/50 hover:bg-slate-900/60 transition-all shadow-xl relative overflow-hidden h-full flex flex-col justify-between">
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-blue-500 group-hover:scale-110 transition-transform">
                          <Projector size={24} />
                        </div>
                        <span className="text-[10px] font-mono text-slate-500 bg-slate-950 px-3 py-1 rounded-full border border-slate-800">
                          ID: {project.id.slice(0,8)}
                        </span>
                      </div>
                      
                      <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors tracking-tight">
                        {project.name}
                      </h2>
                      <p className="text-slate-400 text-sm line-clamp-2 font-light leading-relaxed">
                        {project.description || "Sin descripción definida para este hito de ingeniería."}
                      </p>
                    </div>

                    <div className="mt-8 relative z-10">
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Progreso Global</span>
                        <span className="text-blue-400 font-black text-sm">{progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                        <div 
                          className="h-full bg-blue-600 transition-all duration-1000" 
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-slate-500 text-xs">
                          <Calendar size={12} />
                          <span>{new Date(project.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1 text-blue-400 text-xs font-bold opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
                          DESGLOSAR <ChevronRight size={14} />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Footer Info */}
      <footer className="pt-8 flex justify-center">
        <div className="px-4 py-2 bg-slate-900/50 border border-slate-800 rounded-full flex items-center gap-3">
          <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
            Sincronización de Proyectos: Activa
          </span>
        </div>
      </footer>
    </div>
  );
}