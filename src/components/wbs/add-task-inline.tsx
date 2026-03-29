"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Loader2 } from "lucide-react";

export default function AddTaskInline({ projectId, parentId, placeholder = "Add top-level deliverable..." }: any) {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
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
      user_id: user?.id
    });

    setTitle("");
    setLoading(false);
    window.location.reload();
  };

  return (
    <form onSubmit={handleAdd} className="flex gap-2">
      <input 
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
      />
      <button disabled={loading} className="bg-slate-800 hover:bg-slate-700 p-2 rounded-xl text-blue-400 transition-colors">
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5" />}
      </button>
    </form>
  );
}