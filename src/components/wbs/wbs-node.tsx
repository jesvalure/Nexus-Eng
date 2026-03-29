"use client";

import { useState } from "react";
import { ChevronRight, ChevronDown, Plus, Trash2, CheckCircle2, Circle, Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function WbsNode({ node, allTasks, level = 0 }: { node: any, allTasks: any[], level?: number }) {
  const [isOpen, setIsOpen] = useState(true);
  const supabase = createClient();
  const children = allTasks.filter(t => t.parent_id === node.id);

  const deleteNode = async () => {
    if (confirm("Delete this task and all its sub-tasks?")) {
      await supabase.from("wbs_tasks").delete().eq("id", node.id);
      window.location.reload();
    }
  };

  const updateStatus = async (newStatus: string) => {
    await supabase.from("wbs_tasks").update({ status: newStatus }).eq("id", node.id);
    window.location.reload();
  };

  const statusIcons: any = {
    todo: <Circle className="h-4 w-4 text-slate-500" />,
    "in-progress": <Clock className="h-4 w-4 text-blue-500" />,
    done: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
  };

  return (
    <div className="ml-4 md:ml-8 mt-2">
      <div className="group flex items-center gap-3 bg-slate-900/40 border border-slate-800 p-3 rounded-xl hover:border-slate-600 transition-all">
        <button onClick={() => setIsOpen(!isOpen)} className="text-slate-500">
          {children.length > 0 ? (isOpen ? <ChevronDown /> : <ChevronRight />) : <div className="w-6" />}
        </button>
        
        <button onClick={() => updateStatus(node.status === 'done' ? 'todo' : 'done')}>
          {statusIcons[node.status]}
        </button>

        <div className="flex-1">
          <h4 className={`text-sm font-semibold ${node.status === 'done' ? 'line-through text-slate-500' : 'text-slate-200'}`}>
            {node.title}
          </h4>
        </div>

        <div className="opacity-0 group-hover:opacity-100 flex gap-2 transition-opacity">
          <button onClick={deleteNode} className="p-1 text-slate-500 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
        </div>
      </div>

      {isOpen && children.length > 0 && (
        <div className="border-l border-slate-800 ml-3">
          {children.map(child => (
            <WbsNode key={child.id} node={child} allTasks={allTasks} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}