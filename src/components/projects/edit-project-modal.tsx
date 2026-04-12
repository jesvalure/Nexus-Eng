"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { X, Save, Loader2 } from "lucide-react";

export default function EditProjectModal({ project, isOpen, onClose }: any) {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  if (!isOpen) return null;

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    const { error } = await supabase
      .from("projects")
      .update({
        name: formData.get("name"),
        description: formData.get("description"),
      })
      .eq("id", project.id);

    if (error) alert(error.message);
    else window.location.reload();
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Edit Project Meta</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white"><X /></button>
        </div>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-500 uppercase">Project Name</label>
            <input 
              name="name" 
              defaultValue={project.name} 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:ring-2 focus:ring-blue-500/50" 
              required 
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-500 uppercase">Description</label>
            <textarea 
              name="description" 
              defaultValue={project.description} 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:ring-2 focus:ring-blue-500/50" 
              rows={4} 
            />
          </div>
          <button 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Save className="h-5 w-5" />}
            Update Project
          </button>
        </form>
      </div>
    </div>
  );
}