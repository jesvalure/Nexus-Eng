"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Loader2 } from "lucide-react";

export default function AddTaskInline({ projectId, parentId, placeholder = "Add deliverable..." }: any) {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState(""); // Nuevo estado
  const supabase = createClient();

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("wbs_tasks").insert({
      title,
      project_id: projectId,
      parent_id: parentId,
      user_id: user?.id,
      deadline: deadline || null // Enviamos la fecha
    });

    setTitle("");
    setDeadline("");
    setLoading(false);
    window.location.reload();
  };

  return (
    <form onSubmit={handleAdd} className="flex flex-wrap gap-2">
      <input 
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={placeholder}
        className="flex-1 min-w-[200px] bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none"
      />
      <input 
        type="date"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
        className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-400 focus:ring-1 focus:ring-blue-500 outline-none"
        required
      />
      <button disabled={loading} className="bg-slate-800 hover:bg-slate-700 p-2 rounded-xl text-blue-400 transition-colors shrink-0">
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5" />}
      </button>
    </form>
  );
}