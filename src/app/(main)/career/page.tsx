"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import AddStarCase from "@/components/career/add-star-case";
import EditStarModal from "@/components/career/edit-star-modal";
import { Briefcase, Search, Pencil, Trash2, Target, Award, Trophy, Copy, Check } from "lucide-react";

export default function CareerPage() {
  const [cases, setCases] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [editingCase, setEditingCase] = useState<any>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  // Función para obtener los casos de la DB
  const fetchCases = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("career_star_cases")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (data) setCases(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCases();
  }, []);

  // Función para eliminar un caso
  const handleDelete = async (id: string) => {
    if (confirm("¿Confirmas la eliminación? Esta acción no se puede deshacer.")) {
      const { error } = await supabase.from("career_star_cases").delete().eq("id", id);
      if (error) alert(error.message);
      else fetchCases();
    }
  };

  // Función para copiar el resultado al portapapeles
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filtrar casos según el término de búsqueda
  const filteredCases = cases.filter(c => 
    c.title.toLowerCase().includes(search.toLowerCase()) || 
    c.result.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* --- HEADER --- */}
      <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Briefcase className="text-blue-500" /> Career Hub
          </h1>
          <p className="text-slate-400 mt-2">Diferénciate en procesos de selección con respuestas estructuradas.</p>
        </div>
        
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
          <input 
            placeholder="Search cases..." 
            className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/50 text-white"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

      {/* Componente de inserción con el prop onUpdate */}
      <AddStarCase onUpdate={fetchCases} />

      {/* Lista de Casos STAR */}
      <div className="space-y-8 mt-8">
        {filteredCases.map((item) => (
          <div key={item.id} className="group bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden hover:border-blue-500/30 transition-all">
            <div className="p-6 border-b border-slate-800 bg-slate-900/80 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-blue-400">{item.title}</h3>
                <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase tracking-widest">
                  Engineering Achievement Record
                </p>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => setEditingCase(item)} 
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => handleDelete(item.id)} 
                  className="p-2 bg-slate-800 hover:bg-red-900/20 text-slate-400 hover:text-red-500 rounded-lg border border-slate-700 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-800">
              <div className="p-5 space-y-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                  <Target className="h-3 w-3" /> Situation
                </span>
                <p className="text-sm text-slate-400 italic">"{item.situation}"</p>
              </div>
              <div className="p-5 space-y-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Task</span>
                <p className="text-sm text-slate-400">{item.task}</p>
              </div>
              <div className="p-5 space-y-2">
                <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest flex items-center gap-1">
                  <Award className="h-3 w-3" /> Action
                </span>
                <p className="text-sm text-slate-200">{item.action}</p>
              </div>
              <div className="p-5 space-y-2 bg-emerald-500/5 relative">
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                  <Trophy className="h-3 w-3" /> Result
                </span>
                <p className="text-sm text-emerald-500 font-medium">{item.result}</p>
                <button 
                  onClick={() => copyToClipboard(`${item.title}\nResult: ${item.result}`, item.id)}
                  className="absolute bottom-4 right-4 text-emerald-500/50 hover:text-emerald-400 transition-colors"
                  title="Copy Result"
                >
                  {copiedId === item.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
        ))}

        {!loading && filteredCases.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-3xl text-slate-600 italic">
            No matching cases found. Start building your portfolio!
          </div>
        )}
      </div>

      {/* Modal de Edición */}
      {editingCase && (
        <EditStarModal 
          starCase={editingCase} 
          isOpen={!!editingCase} 
          onClose={() => setEditingCase(null)} 
          onUpdate={fetchCases}
        />
      )}
    </div>
  );
}