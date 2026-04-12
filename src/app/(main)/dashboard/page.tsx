import { createClient } from "@/lib/supabase/server";
import DashboardClient from "@/components/projects/dashboard-client";
import { Clock } from "lucide-react"; // Importamos el icono

export default async function DashboardPage() {
  const supabase = await createClient();
  
  // 1. Traemos los proyectos
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  // 2. Traemos las tareas urgentes (con el join de proyectos para el nombre)
  const { data: urgentTasks } = await supabase
    .from("wbs_tasks")
    .select("*, projects(name)")
    .eq("status", "todo")
    .order("deadline", { ascending: true })
    .limit(5);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Sección principal de proyectos */}
      <DashboardClient initialProjects={projects || []} />

      {/* --- SECCIÓN DE ENTREGAS CRÍTICAS --- */}
      {urgentTasks && urgentTasks.length > 0 && (
        <section className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Clock className="text-amber-500 animate-pulse" /> 
            Próximas Entregas (Crítico)
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-3">
            {urgentTasks.map((task: any) => (
              <div 
                key={task.id} 
                className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl flex justify-between items-center group hover:border-amber-500/30 transition-all hover:bg-slate-900/60 shadow-lg shadow-black/20"
              >
                <div>
                  <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                    {task.projects?.name || "Proyecto sin nombre"}
                  </p>
                  <h4 className="text-sm font-bold text-slate-200 group-hover:text-amber-500 transition-colors">
                    {task.title}
                  </h4>
                </div>
                
                <div className="text-right">
                  <p className="text-xs font-bold text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                    {new Date(task.deadline).toLocaleDateString()}
                  </p>
                  <p className="text-[10px] text-slate-600 uppercase mt-1 font-mono">
                    Deadline
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Mensaje si no hay nada urgente (Opcional pero recomendado) */}
      {urgentTasks?.length === 0 && (
        <div className="mt-12 p-8 border border-dashed border-slate-800 rounded-3xl text-center">
          <p className="text-slate-500 text-sm italic">No hay entregas pendientes para esta semana. ¡Buen trabajo!</p>
        </div>
      )}
    </div>
  );
}