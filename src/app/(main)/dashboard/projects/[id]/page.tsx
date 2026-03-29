import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import WbsNode from "@/components/wbs/wbs-node";
import AddTaskInline from "@/components/wbs/add-task-inline";
import { ListTree, ChevronLeft } from "lucide-react";
import Link from "next/link";

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

  const rootTasks = tasks?.filter(t => !t.parent_id) || [];

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <Link href="/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-blue-400 text-sm mb-6 transition-colors">
        <ChevronLeft className="h-4 w-4" /> Back to Projects
      </Link>

      <header className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <ListTree className="text-blue-500 h-8 w-8" />
          <h1 className="text-4xl font-extrabold text-white tracking-tight">{project.name}</h1>
        </div>
        <p className="text-slate-400 max-w-2xl">{project.description}</p>
      </header>

      <section className="bg-slate-900/20 border border-slate-800 rounded-3xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-slate-300">Work Breakdown Structure</h2>
          <span className="text-xs font-mono text-slate-500 bg-slate-800 px-3 py-1 rounded-full">
            {tasks?.length || 0} Nodes Defined
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