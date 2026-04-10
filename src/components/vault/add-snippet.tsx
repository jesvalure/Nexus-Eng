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
      category: formData.get("category"), // <-- ¡No olvides esta línea!
      user_id: user?.id,
    });

    if (error) alert(error.message);
    else window.location.reload(); 
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 mb-8">
      {/* Cambiamos md:grid-cols-2 por md:grid-cols-3 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input 
          name="title" 
          placeholder="Snippet Title..." 
          className="bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-sm text-white outline-none focus:ring-1 focus:ring-blue-500" 
          required 
        />
        <input 
          name="language" 
          placeholder="Language (python, sql...)" 
          className="bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-sm text-white outline-none focus:ring-1 focus:ring-blue-500" 
          required 
        />
        {/* Nuevo campo de categoría */}
        <select 
          name="category" 
          className="bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-sm text-slate-400 outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="General">General</option>
          <option value="Backend">Backend</option>
          <option value="Frontend">Frontend</option>
          <option value="DevOps">DevOps</option>
          <option value="Embedded">Embedded</option>
        </select>
      </div>

      <textarea 
        name="description" 
        placeholder="What does this do?" 
        className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-sm text-white outline-none focus:ring-1 focus:ring-blue-500" 
        rows={2} 
      />
      <textarea 
        name="code" 
        placeholder="Paste your logic here..." 
        className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg font-mono text-sm text-emerald-400 outline-none focus:ring-1 focus:ring-blue-500" 
        rows={4} 
        required 
      />
      
      <button 
        disabled={loading} 
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-6 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50 text-white"
      >
        {loading ? <Loader2 className="animate-spin h-4 w-4" /> : <Plus className="h-4 w-4" />}
        Save to Vault
      </button>
    </form>
  );
}