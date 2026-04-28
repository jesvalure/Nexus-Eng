"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { X, Code2, Loader2, Shield, ShieldOff, TerminalSquare, Hash } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userId: string;
}

export default function CreateSnippetModal({ isOpen, onClose, onSuccess, userId }: Props) {
  const [loading, setLoading] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const [tags, setTags] = useState("");
  
  const supabase = createClient();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const language = formData.get("language") as string;
    const code_content = formData.get("code_content") as string;
    
    // Procesar tags (separados por coma a un array)
    const tagsArray = tags.split(",").map(t => t.trim()).filter(t => t !== "");

    const { error } = await supabase.from("logic_vault").insert({
      user_id: userId,
      title,
      language,
      code_content,
      tags: tagsArray,
      is_public: isPublic
    });

    if (!error) {
      onSuccess();
      onClose();
    } else {
      alert("Error en el Vault: " + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-[2rem] p-8 shadow-2xl"
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 text-blue-500 rounded-xl"><Code2 size={24} /></div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Nuevo Snippet</h2>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors"><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono text-slate-500 uppercase tracking-widest ml-1">Título</label>
              <input required name="title" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none mt-1" placeholder="Ej: Fetch Supabase Auth" />
            </div>
            <div>
              <label className="text-xs font-mono text-slate-500 uppercase tracking-widest ml-1">Lenguaje</label>
              <div className="relative mt-1">
                <TerminalSquare className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                <select name="language" className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white appearance-none outline-none focus:border-blue-500">
                  <option value="typescript">TypeScript</option>
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="sql">SQL</option>
                  <option value="java">Java (TEC Classic)</option>
                  <option value="bash">Bash / Terminal</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-mono text-slate-500 uppercase tracking-widest ml-1 flex justify-between">
              <span>Código</span>
            </label>
            <textarea required name="code_content" rows={6} className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-4 py-3 text-green-400 font-mono text-sm focus:border-blue-500 outline-none mt-1 resize-none shadow-inner" placeholder="// Pega tu código aquí..." />
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="w-full md:w-2/3">
              <label className="text-xs font-mono text-slate-500 uppercase tracking-widest ml-1">Etiquetas (separadas por coma)</label>
              <div className="relative mt-1">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                <input value={tags} onChange={(e) => setTags(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white focus:border-blue-500 outline-none text-sm" placeholder="auth, api, hooks..." />
              </div>
            </div>

            <button type="button" onClick={() => setIsPublic(!isPublic)} className={`mt-5 px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all w-full md:w-auto justify-center ${isPublic ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-slate-950 text-slate-400 border border-slate-800'}`}>
              {isPublic ? <><Shield size={16} /> Público</> : <><ShieldOff size={16} /> Privado</>}
            </button>
          </div>
          
          <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-xl transition-all flex items-center justify-center gap-2 mt-2">
            {loading ? <Loader2 className="animate-spin" /> : "GUARDAR EN LA BÓVEDA"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}