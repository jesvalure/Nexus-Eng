"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Star, Loader2, Plus, X } from "lucide-react";

export default function AddStarCase() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from("career_star_cases").insert({
      title: formData.get("title"),
      situation: formData.get("situation"),
      task: formData.get("task"),
      action: formData.get("action"),
      result: formData.get("result"),
      user_id: user?.id,
    });

    if (error) alert(error.message);
    else window.location.reload();
    setLoading(false);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full py-4 border-2 border-dashed border-slate-800 rounded-2xl text-slate-500 hover:text-blue-400 hover:border-blue-500/50 transition-all flex items-center justify-center gap-2 mb-8"
      >
        <Plus className="h-5 w-5" /> Add New STAR Case
      </button>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl mb-8 relative animate-in fade-in zoom-in duration-200">
      <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white">
        <X className="h-5 w-5" />
      </button>
      
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <Star className="text-yellow-500 h-5 w-5 fill-yellow-500" /> New STAR Case
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" placeholder="Case Title (e.g. Solving Concurrent Access in Puriscal DB)" className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-500" required />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <textarea name="situation" placeholder="S: Situation (Context)" className="bg-slate-950 border border-slate-800 p-3 rounded-xl text-sm h-32" required />
          <textarea name="task" placeholder="T: Task (What needed to be done?)" className="bg-slate-950 border border-slate-800 p-3 rounded-xl text-sm h-32" required />
          <textarea name="action" placeholder="A: Action (What DID you do?)" className="bg-slate-950 border border-slate-800 p-3 rounded-xl text-sm h-32" required />
          <textarea name="result" placeholder="R: Result (Outcome with metrics)" className="bg-slate-950 border border-slate-800 p-3 rounded-xl text-sm h-32" required />
        </div>

        <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all">
          {loading ? <Loader2 className="animate-spin" /> : "Save Experience"}
        </button>
      </form>
    </div>
  );
}