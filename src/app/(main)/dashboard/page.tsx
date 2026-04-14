"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Projector, 
  Code2, 
  Briefcase, 
  TrendingUp,
  Clock,
  ChevronRight,
  Activity,
  Loader2,
  AlertCircle
} from "lucide-react";
import { useProfile } from "@/context/ProfileContext";
import { createClient } from "@/lib/supabase/client";

export default function Dashboard() {
  const { profile, loading: profileLoading } = useProfile();
  const [counts, setCounts] = useState({ projects: 0, snippets: 0, starCases: 0 });
  const [featuredProject, setFeaturedProject] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(true);
  const supabase = createClient();

  const fetchDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Obtener conteos generales
      const [projectsCount, vaultCount, starCasesCount] = await Promise.all([
        supabase.from('projects').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('vault').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('career_star_cases').select('*', { count: 'exact', head: true }).eq('user_id', user.id)
      ]);

      setCounts({
        projects: projectsCount.count || 0,
        snippets: vaultCount.count || 0,
        starCases: starCasesCount.count || 0
      });

      // 2. Obtener el proyecto más reciente con sus tareas para el Pipeline
      const { data: projectData, error: pError } = await supabase
        .from('projects')
        .select(`
          *,
          wbs_tasks (id, status, deadline)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (!pError && projectData) {
        const total = projectData.wbs_tasks?.length || 0;
        const completed = projectData.wbs_tasks?.filter((t: any) => t.status === 'done' || t.status === 'completed').length || 0;
        const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
        
        // Buscamos el deadline más cercano de las tareas
        const deadlines = projectData.wbs_tasks?.map((t: any) => t.deadline).filter(Boolean);
        const nextDeadline = deadlines.length > 0 ? new Date(Math.min(...deadlines.map((d: any) => new Date(d).getTime()))).toLocaleDateString() : 'TBD';

        setFeaturedProject({
          ...projectData,
          progress,
          nextDeadline,
          totalTasks: total
        });
      }
    } catch (error) {
      console.error("Error cargando Dashboard:", error);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (profileLoading || loadingData) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-950 gap-4">
        <Loader2 className="animate-spin text-blue-500 h-10 w-10" />
        <p className="text-slate-500 font-mono text-[10px] tracking-[0.2em] animate-pulse uppercase">Syncing_Nexus_Pulse...</p>
      </div>
    );
  }

  const stats = [
    { label: "Proyectos Activos", value: counts.projects, icon: Projector, color: "text-blue-500", href: "/wbs" },
    { label: "Snippets en Vault", value: counts.snippets, icon: Code2, color: "text-purple-500", href: "/vault" },
    { label: "Casos STAR", value: counts.starCases, icon: Briefcase, color: "text-emerald-500", href: "/career" },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 min-h-screen">
      
      {/* Header (Igual que antes) */}
      <header>
        <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-4xl font-bold text-white tracking-tight">
          Bienvenido, <span className="text-blue-500 font-black">{profile?.full_name?.split(' ')[0] || "Ingeniero"}</span>
        </motion.h1>
        <div className="flex items-center gap-3 mt-2">
          <span className="flex items-center gap-1 text-slate-400 font-mono text-[10px] uppercase tracking-wider">
            <Activity size={12} className="text-emerald-500" /> Kernel: Active
          </span>
          <span className="text-slate-700">|</span>
          <span className="text-slate-400 font-mono text-[10px] uppercase tracking-wider">
            {profile?.program || "Ingeniería"} // S{profile?.semester || "8"}
          </span>
        </div>
      </header>

      {/* Stats Grid con Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <Link key={stat.label} href={stat.href}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl hover:border-slate-700 hover:bg-slate-900/80 transition-all group cursor-pointer shadow-lg"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-slate-500 text-[10px] font-mono uppercase tracking-[0.2em]">{stat.label}</p>
                  <h3 className="text-3xl font-bold text-white mt-1 tracking-tight">{stat.value}</h3>
                </div>
                <div className={`p-3 rounded-xl bg-slate-950 border border-slate-800 ${stat.color} group-hover:scale-110 transition-transform`}>
                  <stat.icon size={20} />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-[9px] font-mono text-slate-600 group-hover:text-blue-400">
                <span>ACCESS_MODULE</span>
                <ChevronRight size={10} />
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* --- PIPELINE STATUS DINÁMICO --- */}
        <Link href={featuredProject ? `/wbs/projects/${featuredProject.id}` : "/wbs"} className="lg:col-span-2 group relative">
          <div className="h-full bg-slate-900/40 border border-slate-800 rounded-[2rem] p-8 overflow-hidden transition-all hover:border-blue-500/50 hover:bg-slate-900/60 shadow-2xl">
            <div className="relative z-10 flex flex-col h-full justify-between">
              {featuredProject ? (
                <>
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Clock className="text-blue-500 h-5 w-5" /> Pipeline Status
                      </h3>
                      <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20 uppercase tracking-tighter">
                        LIVE_SYNC_ON
                      </span>
                    </div>
                    
                    <div className="mt-8 space-y-5">
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Current Milestone</p>
                          <p className="text-lg text-slate-200 font-medium mt-1 truncate max-w-md">{featuredProject.name}</p>
                        </div>
                        <span className="text-2xl font-black text-blue-500">{featuredProject.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${featuredProject.progress}%` }}
                          transition={{ duration: 2, ease: "circOut" }}
                          className="bg-blue-600 h-full shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                        />
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 uppercase">
                        <p>TASKS: {featuredProject.totalTasks}</p>
                        <p className="text-blue-400 italic">Next Deadline: {featuredProject.nextDeadline}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 flex items-center gap-2 text-blue-400 text-xs font-bold opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
                    Continuar Desarrollo <ChevronRight size={14} />
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center py-10">
                  <AlertCircle className="text-slate-700 h-12 w-12 mb-4" />
                  <h3 className="text-lg font-bold text-white">No hay proyectos activos</h3>
                  <p className="text-slate-500 text-sm mt-2">Crea un proyecto en el WBS Engine para ver tu progreso aquí.</p>
                </div>
              )}
            </div>
            <Projector size={200} className="absolute -bottom-10 -right-10 text-slate-800 opacity-10 group-hover:opacity-20 transition-all duration-1000" />
          </div>
        </Link>

        {/* Career Hub Card (Igual que antes) */}
        <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 rounded-[2rem] p-8 text-white flex flex-col justify-between shadow-xl group transition-all">
          <div>
            <TrendingUp className="h-7 w-7 mb-6 opacity-80" />
            <h3 className="text-2xl font-black leading-tight tracking-tight">¿Listo para las <br /> pasantías?</h3>
            <p className="text-blue-100/70 text-sm mt-4 leading-relaxed font-light italic">
               Analizando: {profile?.technical_interests || "General Engineering"}
            </p>
          </div>
          <Link href="/career" className="mt-8 w-full py-4 bg-white text-blue-600 font-extrabold rounded-2xl flex items-center justify-center gap-2 hover:bg-blue-50 transition-all shadow-lg active:scale-95">
            Optimizar Perfil <ChevronRight size={18} />
          </Link>
        </div>
      </div>

      <footer className="pt-8 border-t border-slate-900 flex justify-between items-center text-[9px] text-slate-600 font-mono tracking-widest uppercase">
        <p>© 2026 NEXUS-ENG // STAGE: 0.1.0_BETA</p>
        <p>DB_SYNC_STATUS: {featuredProject ? "REAL_TIME_DATA" : "IDLE"}</p>
      </footer>
    </div>
  );
}