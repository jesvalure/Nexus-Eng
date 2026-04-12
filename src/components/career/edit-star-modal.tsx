"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { X, Save, Loader2, Star } from "lucide-react";

export default function EditStarModal({ starCase, isOpen, onClose, onUpdate }: any) {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  if (!isOpen) return null;

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    const { error } = await supabase
      .from("career_star_cases")
      .update({
        title: formData.get("title"),
        situation: formData.get("situation"),
        task: formData.get("task"),
        action: formData.get("action"),
        result: formData.get("result"),
      })
      .eq("id", starCase.id);

    if (error) alert(error.message);
    else onUpdate();
    
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-3xl rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in duration-200 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Star className="text-yellow-500 h-6 w-6 fill-yellow-500" /> Edit STAR Case
          </h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors"><X /></button>
        </div>

        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-500 uppercase tracking-widest">Case Title</label>
            <input name="title" defaultValue={starCase.title} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:ring-2 focus:ring-blue-500/50" required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-500 uppercase">Situation</label>
              <textarea name="situation" defaultValue={starCase.situation} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-300 h-32 outline-none focus:ring-2 focus:ring-blue-500/50" required />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-500 uppercase">Task</label>
              <textarea name="task" defaultValue={starCase.task} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-300 h-32 outline-none focus:ring-2 focus:ring-blue-500/50" required />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-500 uppercase text-blue-400">Action</label>
              <textarea name="action" defaultValue={starCase.action} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white h-32 outline-none focus:ring-2 focus:ring-blue-500/50" required />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-500 uppercase text-emerald-400">Result</label>
              <textarea name="result" defaultValue={starCase.result} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-emerald-500/90 h-32 outline-none focus:ring-2 focus:ring-blue-500/50" required />
            </div>
          </div>

          <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all">
            {loading ? <Loader2 className="animate-spin" /> : <Save className="h-5 w-5" />}
            Sync Improvements
          </button>
        </form>
      </div>
    </div>
  );
}