import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import WbsNode from "@/components/wbs/wbs-node";
import AddTaskInline from "@/components/wbs/add-task-inline";
import { ListTree, ChevronLeft } from "lucide-react";
import Link from "next/link";
import ProjectActions from "@/components/projects/project-actions";

export default async function ProjectWbsPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase.from("projects").select("*").eq("id", id).single();
  if (!project) notFound();

  const { data: tasks } = await supabase
    .from("wbs_tasks")
    .select("*")
    .eq("project_id", id)
    .order("order_index", { ascending: true });

  const totalTasks = tasks?.length || 0;
  const completedTasks = tasks?.filter(t => t.status === 'done').length || 0;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const rootTasks = tasks?.filter(t => !t.parent_id) || [];

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <Link href="/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-blue-400 text-sm mb-6 transition-colors">
        <ChevronLeft className="h-4 w-4" /> Back to Projects
      </Link>

      <header className="mb-10 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <ListTree className="text-blue-500 h-8 w-8" />
            <h1 className="text-4xl font-extrabold text-white tracking-tight">{project.name}</h1>
          </div>
          <p className="text-slate-400 max-w-2xl">{project.description}</p>
        </div>
        <ProjectActions project={project} />
      </header>

      {/* --- NUEVA BARRA DE PROGRESO --- */}
      <div className="mb-8 p-6 bg-slate-900/40 border border-slate-800 rounded-3xl">
        <div className="flex justify-between items-end mb-4">
          <div>
            <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">Project Completion</p>
            <h3 className="text-2xl font-black text-white">{progressPercentage}%</h3>
          </div>
          <p className="text-xs text-slate-500 font-mono">{completedTasks} / {totalTasks} Tasks Done</p>
        </div>
        <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
          <div 
            className="h-full bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all duration-1000 ease-out" 
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      <section className="bg-slate-900/20 border border-slate-800 rounded-3xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-slate-300">Work Breakdown Structure</h2>
          <span className="text-xs font-mono text-slate-500 bg-slate-800 px-3 py-1 rounded-full">
            {totalTasks} Nodes Defined
          </span>
        </div>

        <AddTaskInline projectId={id} parentId={null} />

        <div className="mt-8 space-y-4">
          {rootTasks.map(task => (
            <div key={task.id} className="space-y-4">
              <WbsNode node={task} allTasks={tasks || []} />
              <div className="ml-12 mt-2">
                 <AddTaskInline projectId={id} parentId={task.id} placeholder="Add sub-task..." />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}