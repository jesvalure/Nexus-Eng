"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  ListTree, 
  Projector,
  Trash2, // Icono para borrar
  Loader2,
  AlertCircle
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import CreateProjectModal from "@/components/projects/create-project-modal";
import Link from "next/link";

export default function WBSPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const supabase = createClient();

  const fetchProjects = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from("projects")
        .select(`*, wbs_tasks(id, status)`)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (data) setProjects(data);
    }
    setLoading(false);
  };

  const deleteProject = async (id: string, e: React.MouseEvent) => {
    e.preventDefault(); // Evita que el Link se dispare
    if (!confirm("¿Seguro que quieres borrar este proyecto y todas sus tareas?")) return;

    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (!error) {
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 min-h-screen">
      <header className="flex justify-between items-end border-b border-slate-900 pb-8">
        <div>
          <h1 className="text-4xl font-black text-white flex items-center gap-3 tracking-tighter uppercase">
            WBS Engine
          </h1>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95 text-sm"
        >
          <Plus size={18} /> INICIAR NUEVO PROYECTO
        </button>
      </header>

      {/* Grid de Proyectos con botón de borrado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence>
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative group"
            >
              <Link href={`/wbs/projects/${project.id}`}>
                <div className="h-full bg-slate-900/40 border border-slate-800 p-8 rounded-[2rem] hover:border-blue-500/50 transition-all shadow-xl">
                   {/* ... contenido de la tarjeta igual al anterior ... */}
                   <h2 className="text-2xl font-bold text-white mb-2">{project.name}</h2>
                   <p className="text-slate-400 text-sm line-clamp-2">{project.description}</p>
                </div>
              </Link>
              
              {/* Botón de Borrado Absoluto */}
              <button 
                onClick={(e) => deleteProject(project.id, e)}
                className="absolute top-6 right-6 p-3 bg-slate-950 border border-slate-800 text-slate-600 hover:text-red-500 hover:border-red-500/50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <CreateProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchProjects}
      />
    </div>
  );
}