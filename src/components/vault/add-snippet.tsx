"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Loader2 } from "lucide-react";

export default function AddSnippet() {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from("vault").insert({
      title: formData.get("title"),
      description: formData.get("description"),
      code: formData.get("code"),
      language: formData.get("language"),
      user_id: user?.id,
    });

    if (error) alert(error.message);
    else window.location.reload(); // Recarga simple para ver el cambio
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="title" placeholder="Snippet Title (e.g. Docker Compose Postgres)" className="bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-sm" required />
        <input name="language" placeholder="Language (python, bash, etc.)" className="bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-sm" required />
      </div>
      <textarea name="description" placeholder="What does this do?" className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-sm" rows={2} />
      <textarea name="code" placeholder="Paste your logic here..." className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg font-mono text-sm" rows={4} required />
      
      <button disabled={loading} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-sm font-bold transition-all">
        {loading ? <Loader2 className="animate-spin h-4 w-4" /> : <Plus className="h-4 w-4" />}
        Save to Vault
      </button>
    </form>
  );
}