"use client"; // Cambiamos a Client Component para el filtrado en tiempo real

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import AddSnippet from "@/components/vault/add-snippet";
import CodeBlock from "@/components/layout/code-block";
import { Search, Filter, Code2, Terminal, Hash } from "lucide-react";

export default function VaultPage() {
  const [snippets, setSnippets] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    async function fetchSnippets() {
      const { data } = await supabase.from("vault").select("*").order("created_at", { ascending: false });
      if (data) setSnippets(data);
      setLoading(false);
    }
    fetchSnippets();
  }, []);

  // Lógica de filtrado
  const filteredSnippets = snippets.filter(s => {
    const matchesSearch = s.title.toLowerCase().includes(search.toLowerCase()) || 
                          s.description?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "All" || s.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["All", "General", "Backend", "Frontend", "DevOps", "Embedded"];

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-bold flex items-center gap-3 text-white">
          <Code2 className="text-blue-500" /> Logic Vault
        </h1>
        <p className="text-slate-400 mt-2">Find your technical snippets instantly.</p>
      </header>

      <AddSnippet />

      {/* Controles de Búsqueda y Filtro */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
          <input 
            type="text"
            placeholder="Search by title or description..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeCategory === cat 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40" 
                : "bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Snippets Filtrada */}
      <div className="grid grid-cols-1 gap-6">
        {filteredSnippets.map((snippet) => (
          <div key={snippet.id} className="group bg-slate-900/40 border border-slate-800 rounded-2xl p-6 hover:border-blue-500/30 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold text-blue-500 uppercase tracking-tighter bg-blue-500/10 px-2 py-0.5 rounded">
                    {snippet.category}
                  </span>
                  <span className="text-[10px] text-slate-600 font-mono italic">
                    {snippet.language}
                  </span>
                </div>
                <h3 className="font-bold text-xl text-slate-100 group-hover:text-blue-400 transition-colors">
                  {snippet.title}
                </h3>
              </div>
              <Terminal className="text-slate-700 h-5 w-5" />
            </div>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">{snippet.description}</p>
            <CodeBlock code={snippet.code} language={snippet.language} />
          </div>
        ))}
        
        {filteredSnippets.length === 0 && !loading && (
          <div className="text-center py-20 text-slate-500 italic border-2 border-dashed border-slate-800 rounded-2xl">
            No snippets found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}