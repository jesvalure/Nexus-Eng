"use client";

import { useState } from "react";
import { 
  ChevronRight, ChevronDown, Trash2, CheckCircle2, 
  Circle, Clock, Pencil, Save, X, Calendar 
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function WbsNode({ node, allTasks }: { node: any, allTasks: any[] }) {
  const [isOpen, setIsOpen] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(node.title);
  const [editDeadline, setEditDeadline] = useState(node.deadline || "");
  const supabase = createClient();

  const children = allTasks.filter(t => t.parent_id === node.id);

  // 1. Lógica de Alerta de Fecha
  const getDeadlineStatus = () => {
    if (!node.deadline || node.status === 'done') return "text-slate-500";
    const now = new Date();
    const deadline = new Date(node.deadline);
    const diff = deadline.getTime() - now.getTime();
    const hours = diff / (1000 * 60 * 60);

    if (hours < 0) return "text-red-500 font-bold"; // Vencido
    if (hours < 48) return "text-amber-500 animate-pulse"; // Urgente (48h)
    return "text-slate-400";
  };

  // 2. Función para borrar tarea
  const handleDelete = async () => {
    if (confirm("¿Borrar esta tarea y sus sub-tareas permanentemente?")) {
      const { error } = await supabase.from("wbs_tasks").delete().eq("id", node.id);
      if (error) alert(error.message);
      else window.location.reload();
    }
  };

  // 3. Función para actualizar título y fecha
  const handleUpdate = async () => {
    const { error } = await supabase.from("wbs_tasks").update({ 
      title: editTitle,
      deadline: editDeadline || null
    }).eq("id", node.id);
    
    if (error) alert(error.message);
    else {
      setIsEditing(false);
      window.location.reload();
    }
  };

  // 4. Función CRÍTICA: Actualizar Estado
  const updateStatus = async (newStatus: string) => {
    const { error } = await supabase
      .from("wbs_tasks")
      .update({ status: newStatus })
      .eq("id", node.id);

    if (error) {
      console.error("Error al actualizar estado:", error.message);
      alert("No se pudo actualizar el estado: " + error.message);
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="ml-4 md:ml-8 mt-3 animate-in fade-in slide-in-from-left-2 duration-200">
      <div className={`group flex items-center gap-3 border p-3 rounded-xl transition-all ${
        node.status === 'done' 
          ? 'border-slate-800 bg-slate-900/20 opacity-70' 
          : 'border-slate-800 bg-slate-900/40 hover:border-slate-600 shadow-sm'
      }`}>
        
        {/* Toggle de Hijos */}
        <button onClick={() => setIsOpen(!isOpen)} className="text-slate-500 hover:text-white transition-colors">
          {children.length > 0 ? (isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />) : <div className="w-4" />}
        </button>
        
        {/* Selector de Estado (Ciclo) */}
        <button 
          onClick={() => {
            const next = node.status === 'todo' ? 'in-progress' : node.status === 'in-progress' ? 'done' : 'todo';
            updateStatus(next);
          }}
          className="hover:scale-110 transition-transform shrink-0"
        >
          {node.status === 'todo' && <Circle className="h-5 w-5 text-slate-500" />}
          {node.status === 'in-progress' && <Clock className="h-5 w-5 text-blue-500 animate-pulse" />}
          {node.status === 'done' && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
        </button>

        {/* Contenido Principal */}
        <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-2 min-w-0">
          {isEditing ? (
            <div className="flex flex-col md:flex-row gap-2 w-full">
              <input 
                value={editTitle} 
                onChange={(e) => setEditTitle(e.target.value)}
                className="bg-slate-950 border border-blue-500 rounded-lg px-3 py-1 text-sm text-white flex-1 outline-none shadow-[0_0_10px_rgba(59,130,246,0.2)]"
                autoFocus
              />
              <input 
                type="date"
                value={editDeadline?.split('T')[0] || ""}
                onChange={(e) => setEditDeadline(e.target.value)}
                className="bg-slate-950 border border-blue-500 rounded-lg px-3 py-1 text-xs text-white outline-none"
                required
              />
              <div className="flex gap-1">
                <button onClick={handleUpdate} className="text-emerald-500 hover:bg-emerald-500/10 p-1.5 rounded-md transition-colors"><Save className="h-4 w-4" /></button>
                <button onClick={() => setIsEditing(false)} className="text-red-500 hover:bg-red-500/10 p-1.5 rounded-md transition-colors"><X className="h-4 w-4" /></button>
              </div>
            </div>
          ) : (
            <>
              <h4 className={`text-sm font-medium truncate ${node.status === 'done' ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                {node.title}
              </h4>
              
              {/* Badge de Fecha */}
              {node.deadline && (
                <div className={`flex items-center gap-1.5 text-[10px] font-mono uppercase shrink-0 ${getDeadlineStatus()}`}>
                  <Calendar className="h-3 w-3" />
                  {new Date(node.deadline).toLocaleDateString()}
                </div>
              )}
            </>
          )}
        </div>

        {/* Acciones de Edición y Borrado */}
        {!isEditing && (
          <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-all">
            <button 
              onClick={() => setIsEditing(true)} 
              className="p-1.5 text-slate-500 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition-colors"
              title="Editar"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button 
              onClick={handleDelete} 
              className="p-1.5 text-slate-500 hover:text-red-500 hover:bg-slate-800 rounded-lg transition-colors"
              title="Eliminar"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Renderizado Recursivo de Hijos con línea jerárquica */}
      {isOpen && children.length > 0 && (
        <div className="border-l-2 border-slate-800/60 ml-2 md:ml-3 pl-1">
          {children.map(child => (
            <WbsNode key={child.id} node={child} allTasks={allTasks} />
          ))}
        </div>
      )}
    </div>
  );
}