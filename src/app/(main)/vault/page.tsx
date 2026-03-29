import { createClient } from "@/lib/supabase/server";
import AddSnippet from "@/components/vault/add-snippet";
import { Code2, Terminal, Hash } from "lucide-react";
import CodeBlock from "@/components/vault/code-block"; 

export default async function VaultPage() {
  const supabase = await createClient();
  
  // Obtenemos los snippets directamente desde el servidor
  const { data: snippets } = await supabase
    .from("vault")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Code2 className="text-blue-500 h-6 w-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Logic Vault
          </h1>
        </div>
        <p className="text-slate-400">
          Your personal repository for technical logic, snippets, and configurations.
        </p>
      </header>

      {/* Formulario para agregar nuevos snippets */}
      <AddSnippet />

      <div className="grid grid-cols-1 gap-6">
        {snippets?.map((snippet) => (
          <div 
            key={snippet.id} 
            className="group bg-slate-900/40 border border-slate-800 rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-300 shadow-sm hover:shadow-blue-500/5"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-1">
                <h3 className="font-bold text-xl text-slate-100 group-hover:text-blue-400 transition-colors">
                  {snippet.title}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-[10px] font-mono bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded text-blue-400 uppercase tracking-wider">
                    <Hash className="h-3 w-3" />
                    {snippet.language || "text"}
                  </span>
                  <span className="text-[10px] text-slate-600 font-mono">
                    {new Date(snippet.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <Terminal className="text-slate-700 h-5 w-5 group-hover:text-blue-500/50 transition-colors" />
            </div>

            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              {snippet.description}
            </p>
            
            {/* Componente de resaltado de sintaxis */}
            <CodeBlock 
              code={snippet.code} 
              language={snippet.language || "javascript"} 
            />
          </div>
        ))}

        {/* Estado vacío */}
        {snippets?.length === 0 && (
          <div className="text-center py-24 border-2 border-dashed border-slate-800 rounded-3xl bg-slate-900/20">
            <div className="bg-slate-800 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Code2 className="text-slate-500 h-6 w-6" />
            </div>
            <h3 className="text-slate-300 font-medium">No snippets found</h3>
            <p className="text-slate-500 text-sm mt-1">Start by adding your first piece of logic above.</p>
          </div>
        )}
      </div>
    </div>
  );
}