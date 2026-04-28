"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Code2, Copy, CheckCircle2, Lock, Globe, TerminalSquare, Loader2, Hash } from "lucide-react";
import Link from "next/link";
import CreateSnippetModal from "@/components/vault/CreateSnippetModal";

export default function LogicVaultPage() {
  const [snippets, setSnippets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userId, setUserId] = useState<string>("");

  const supabase = createClient();

  // Filtros rápidos enfocados en desarrollo backend/frontend robusto
  const quickFilters = ["All", "React", "Python", "Kotlin", "Java", "SQL", "Docker"];

  const fetchVault = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      setUserId(user.id);
      const { data, error } = await supabase
        .from("logic_vault")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (data) setSnippets(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchVault();
  }, []);

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000); // Vuelve al icono normal en 2s
  };

  // Lógica de filtrado doble (Buscador + Pills)
  const filteredSnippets = snippets.filter(snippet => {
    const matchesSearch = snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          snippet.code_content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === "All" || 
                          snippet.language.toLowerCase() === activeFilter.toLowerCase() ||
                          snippet.tags?.some((tag: string) => tag.toLowerCase() === activeFilter.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 min-h-screen">
      <header className="border-b border-slate-800 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter flex items-center gap-3 text-white">
            <Code2 className="text-blue-500" size={36} /> Logic_Vault
          </h1>
          <p className="text-slate-400 mt-2 font-mono text-sm uppercase tracking-widest">
            Repositorio de Conocimiento Persistente
          </p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95 text-sm flex items-center gap-2"
        >
          <TerminalSquare size={18} /> INYECTAR_SNIPPET
        </button>
      </header>

      {/* Barra de Búsqueda y Quick Filters */}
      <div className="space-y-4">
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por título o contenido del código..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-blue-500 outline-none transition-all"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {quickFilters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-widest border transition-all ${
                activeFilter === filter 
                  ? "bg-blue-500/20 text-blue-400 border-blue-500/50" 
                  : "bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-500" size={40} /></div>
      ) : filteredSnippets.length === 0 ? (
        <div className="p-12 border border-dashed border-slate-800 rounded-[2rem] text-center bg-slate-900/20">
          <Code2 className="mx-auto text-slate-600 mb-4" size={32} />
          <p className="text-slate-400 font-medium">Bóveda vacía o sin coincidencias de búsqueda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <AnimatePresence>
            {filteredSnippets.map((snippet, index) => (
              <motion.div
                key={snippet.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="bg-slate-900/40 border border-slate-800 rounded-[2rem] overflow-hidden flex flex-col"
              >
                {/* Header del Snippet */}
                <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    {snippet.is_public ? <Globe size={14} className="text-emerald-500" /> : <Lock size={14} className="text-amber-500" />}
                    <h3 className="font-bold text-white tracking-tight truncate max-w-[200px]">{snippet.title}</h3>
                  </div>
                  <span className="text-[10px] bg-blue-500/10 text-blue-400 px-3 py-1 rounded-lg border border-blue-500/10 font-mono uppercase">
                    {snippet.language}
                  </span>
                </div>

                {/* Área de Código (Tokyo Night embedded) */}
                <div className="relative group flex-grow">
                  <button 
                    onClick={() => copyToClipboard(snippet.id, snippet.code_content)}
                    className="absolute top-4 right-4 p-2 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-lg backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all z-10 shadow-lg"
                  >
                    {copiedId === snippet.id ? <CheckCircle2 size={16} className="text-emerald-400" /> : <Copy size={16} />}
                  </button>
                  {/* Color exacto del editor Tokyo Night */}
                  <pre className="p-6 text-sm text-blue-300 font-mono overflow-x-auto bg-[#1a1b26] h-full">
                    <code>{snippet.code_content}</code>
                  </pre>
                </div>

                {/* Footer / Tags */}
                {snippet.tags && snippet.tags.length > 0 && (
                  <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex flex-wrap gap-2">
                    {snippet.tags.map((tag: string) => (
                      <span key={tag} className="text-[10px] text-slate-500 font-mono uppercase tracking-widest flex items-center gap-1">
                        <Hash size={10} />{tag}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Modal de Creación */}
      <CreateSnippetModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchVault}
        userId={userId}
      />
    </div>
  );
}