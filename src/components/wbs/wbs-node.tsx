"use client";

import { useState } from "react";
import { 
  ChevronRight, 
  ChevronDown, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Pencil,
  Save,
  X
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function WbsNode({ node, allTasks, level = 0 }: { node: any, allTasks: any[], level?: number }) {
  const [isOpen, setIsOpen] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(node.title);
  const supabase = createClient();

  const children = allTasks.filter(t => t.parent_id === node.id);

  const handleDelete = async () => {
    if (confirm("¿Borrar esta tarea y todas sus sub-tareas? Esta acción es irreversible.")) {
      await supabase.from("wbs_tasks").delete().eq("id", node.id);
      window.location.reload();
    }
  };

  const handleUpdateTitle = async () => {
    await supabase.from("wbs_tasks").update({ title: editTitle }).eq("id", node.id);
    setIsEditing(false);
    window.location.reload();
  };

  const updateStatus = async (newStatus: string) => {
    await supabase.from("wbs_tasks").update({ status: newStatus }).eq("id", node.id);
    window.location.reload();
  };

  const statusColors: any = {
    todo: "border-slate-800",
    "in-progress": "border-blue-500/50 bg-blue-500/5",
    done: "border-emerald-500/50 bg-emerald-500/5 opacity-70"
  };

  return (
    <div className="ml-4 md:ml-8 mt-3 animate-in slide-in-from-left-2 duration-200">
      <div className={`group flex items-center gap-3 border p-3 rounded-xl transition-all ${statusColors[node.status]}`}>
        
        {/* Toggle de Hijos */}
        <button onClick={() => setIsOpen(!isOpen)} className="text-slate-500 hover:text-white transition-colors">
          {children.length > 0 ? (isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />) : <div className="w-4" />}
        </button>
        
        {/* Selector de Estado */}
        <button 
          onClick={() => {
            const next = node.status === 'todo' ? 'in-progress' : node.status === 'in-progress' ? 'done' : 'todo';
            updateStatus(next);
          }}
          className="hover:scale-110 transition-transform"
        >
          {node.status === 'todo' && <Circle className="h-5 w-5 text-slate-500" />}
          {node.status === 'in-progress' && <Clock className="h-5 w-5 text-blue-500 animate-pulse" />}
          {node.status === 'done' && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
        </button>

        {/* Título / Input de Edición */}
        <div className="flex-1">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input 
                value={editTitle} 
                onChange={(e) => setEditTitle(e.target.value)}
                className="bg-slate-950 border border-blue-500 rounded px-2 py-1 text-sm text-white w-full outline-none"
                autoFocus
              />
              <button onClick={handleUpdateTitle} className="text-emerald-500"><Save className="h-4 w-4" /></button>
              <button onClick={() => setIsEditing(false)} className="text-red-500"><X className="h-4 w-4" /></button>
            </div>
          ) : (
            <h4 className={`text-sm font-medium ${node.status === 'done' ? 'line-through text-slate-500' : 'text-slate-200'}`}>
              {node.title}
            </h4>
          )}
        </div>

        {/* Acciones Rápidas */}
        {!isEditing && (
          <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
            <button onClick={() => setIsEditing(true)} className="p-1.5 text-slate-500 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition-colors">
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button onClick={handleDelete} className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Renderizado Recursivo de Hijos */}
      {isOpen && children.length > 0 && (
        <div className="border-l-2 border-slate-800/50 ml-2 shadow-[inset_1px_0_0_0_rgba(255,255,255,0.05)]">
          {children.map(child => (
            <WbsNode key={child.id} node={child} allTasks={allTasks} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}