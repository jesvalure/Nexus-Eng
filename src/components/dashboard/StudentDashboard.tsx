"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { Clock, Shield, ShieldOff, Projector, Activity, Code, Zap, Loader2, AlertTriangle } from "lucide-react";

export default function StudentDashboard({ profile }: { profile: any }) {
  const [projects, setProjects] = useState<any[]>([]);
  const [criticalTasks, setCriticalTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  
  const supabase = createClient();

  // 1. Carga de datos reales
  useEffect(() => {
    const fetchData = async () => {
      // Traer proyectos
      const { data: projData } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", profile.id)
        .order("created_at", { ascending: false });
      
      if (projData) setProjects(projData);

      // Traer tareas urgentes (Hitos críticos)
      const today = new Date().toISOString().split('T')[0];
      const { data: taskData } = await supabase
        .from("wbs_tasks")
        .select("*, projects(name)")
        .eq("user_id", profile.id)
        .neq("status", "done")
        .lte("deadline", new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()) // Próximos 7 días
        .order("deadline", { ascending: true })
        .limit(3);

      if (taskData) setCriticalTasks(taskData);
      setLoading(false);
    };

    fetchData();
  }, [profile.id, supabase]);

  // 2. Lógica de Update para el Toggle de Privacidad
  const togglePrivacy = async (projectId: string, currentStatus: boolean) => {
    setUpdatingId(projectId);
    
    const { error } = await supabase
      .from("projects")
      .update({ is_public: !currentStatus })
      .eq("id", projectId);

    if (!error) {
      // Actualizar la UI localmente sin recargar
      setProjects(projects.map(p => 
        p.id === projectId ? { ...p, is_public: !currentStatus } : p
      ));
    } else {
      console.error("Error actualizando privacidad:", error);
    }
    
    setUpdatingId(null);
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-500" /></div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <header className="border-b border-slate-800 pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tighter">
            Bienvenido, <span className="text-blue-500">{profile.full_name}</span>
          </h1>
          <p className="text-slate-400 mt-2 font-mono text-sm uppercase tracking-widest">
            {profile.program} • Semestre {profile.semester}
          </p>
        </div>
        {/* Nueva Mejora: Botón de Acción Rápida */}
        <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 text-sm shadow-lg shadow-blue-500/20 transition-all active:scale-95">
          <Zap size={16} /> LOG_ACTIVITY
        </button>
      </header>

      {/* Nueva Mejora: Panel de Telemetría (Métricas) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl flex items-center gap-4">
          <div className="p-4 bg-purple-500/10 text-purple-500 rounded-2xl"><Activity size={24} /></div>
          <div>
            <p className="text-sm text-slate-500 font-mono uppercase">Activity_Score</p>
            <p className="text-3xl font-black text-white">{profile.activity_score || 0}</p>
          </div>
        </div>
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl flex items-center gap-4">
          <div className="p-4 bg-blue-500/10 text-blue-500 rounded-2xl"><Projector size={24} /></div>
          <div>
            <p className="text-sm text-slate-500 font-mono uppercase">Active_Nodes</p>
            <p className="text-3xl font-black text-white">{projects.length}</p>
          </div>
        </div>
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl flex items-center gap-4">
          <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-2xl"><Code size={24} /></div>
          <div>
            <p className="text-sm text-slate-500 font-mono uppercase">Vault_Snippets</p>
            <p className="text-3xl font-black text-white">0</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna Principal: Proyectos y Privacidad */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2 text-white">
            <Projector className="text-blue-500" /> Proyectos Registrados
          </h2>
          
          {projects.length === 0 ? (
            <div className="p-8 border border-dashed border-slate-700 rounded-3xl text-center text-slate-500">
              No hay proyectos inicializados. Ve al WBS Engine para crear uno.
            </div>
          ) : (
            <div className="grid gap-4">
              {projects.map(proj => (
                <div key={proj.id} className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl flex justify-between items-center hover:border-slate-700 transition-all group">
                  <div>
                    <h3 className="font-bold text-lg text-white">{proj.name}</h3>
                    <p className="text-sm text-slate-500 mt-1 line-clamp-1">{proj.description || "Sin descripción"}</p>
                  </div>
                  
                  {/* Toggle Funcional de Privacidad */}
                  <button 
                    onClick={() => togglePrivacy(proj.id, proj.is_public)}
                    disabled={updatingId === proj.id}
                    className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${
                      proj.is_public 
                        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/20' 
                        : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-600 hover:text-slate-300'
                    }`}
                  >
                    {updatingId === proj.id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : proj.is_public ? (
                      <><Shield size={16} /> Público</>
                    ) : (
                      <><ShieldOff size={16} /> Privado</>
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Columna Lateral: Radar de Hitos (Deadlines) */}
        <div className="space-y-6">
          <div className="bg-red-500/5 border border-red-500/10 p-6 rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <AlertTriangle size={100} className="text-red-500" />
            </div>
            <h3 className="text-red-400 font-bold mb-4 flex items-center gap-2 relative z-10">
              <Clock size={18} /> Radar de Hitos (7 Días)
            </h3>
            
            <div className="space-y-3 relative z-10">
              {criticalTasks.length === 0 ? (
                <p className="text-sm text-slate-500 italic">No hay hitos críticos próximos. Sistema estable.</p>
              ) : (
                criticalTasks.map(task => (
                  <div key={task.id} className="bg-slate-950/80 p-4 rounded-xl border border-red-500/20 shadow-lg shadow-red-500/5">
                    <p className="text-xs text-red-400/80 mb-1 font-mono">{task.projects?.name}</p>
                    <p className="text-sm text-slate-200 font-medium">{task.title}</p>
                    <p className="text-xs text-red-500 mt-2 font-mono flex justify-between">
                      <span>Deadline:</span>
                      <strong>{task.deadline}</strong>
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}