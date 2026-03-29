"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { FolderPlus, Loader2, X } from "lucide-react";

export default function NewProjectModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  if (!isOpen) return null;

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from("projects").insert({
      name: formData.get("name"),
      description: formData.get("description"),
      user_id: user?.id,
    });

    if (error) alert(error.message);
    else window.location.reload();
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FolderPlus className="text-blue-500 h-5 w-5" /> New WBS Project
          </h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white"><X /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-mono text-slate-500 uppercase">Project Name</label>
            <input name="name" required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 mt-1 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Puriscal Credit System" />
          </div>
          <div>
            <label className="text-xs font-mono text-slate-500 uppercase">Short Description</label>
            <textarea name="description" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 mt-1 text-sm focus:ring-2 focus:ring-blue-500 outline-none" rows={3} placeholder="High-level goal of this project..." />
          </div>
          <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2">
            {loading ? <Loader2 className="animate-spin" /> : "Create Project"}
          </button>
        </form>
      </div>
    </div>
  );
}