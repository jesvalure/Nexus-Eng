"use client";

import { useState } from "react";
import { Pencil, Trash2, MoreVertical } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import EditProjectModal from "./edit-project-modal";

export default function ProjectActions({ project }: any) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleDelete = async () => {
    if (confirm("⚠️ Peligro: ¿Estás seguro de borrar el proyecto completo? Se eliminarán todas las tareas del WBS permanentemente.")) {
      const { error } = await supabase.from("projects").delete().eq("id", project.id);
      if (error) alert(error.message);
      else router.push("/dashboard");
    }
  };

  return (
    <div className="relative">
      <div className="flex gap-2">
        <button 
          onClick={() => setIsEditOpen(true)}
          className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
          title="Edit Project"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button 
          onClick={handleDelete}
          className="p-2 bg-slate-800 hover:bg-red-900/30 text-slate-400 hover:text-red-500 rounded-lg transition-colors border border-transparent hover:border-red-500/50"
          title="Delete Project"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <EditProjectModal 
        project={project} 
        isOpen={isEditOpen} 
        onClose={() => setIsEditOpen(false)} 
      />
    </div>
  );
}