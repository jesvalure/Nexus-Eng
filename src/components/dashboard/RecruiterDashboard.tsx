"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Search, Star, Award, Building2, Terminal, Code2, Loader2, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function RecruiterDashboard({ profile }: { profile: any }) {
  const [talents, setTalents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  const supabase = createClient();

  useEffect(() => {
    const fetchTalentPool = async () => {
      // 1. Traer todos los perfiles que sean estudiantes, ordenados por score
      const { data: studentsData, error: studentsError } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "student")
        .order("activity_score", { ascending: false });

      if (studentsError || !studentsData) {
        console.error("Error fetching students:", studentsError);
        setLoading(false);
        return;
      }

      // 2. Traer SOLO los proyectos públicos de todo el sistema
      const { data: publicProjects, error: projectsError } = await supabase
        .from("projects")
        .select("id, name, description, user_id")
        .eq("is_public", true);

      // 3. Mapear los proyectos a sus respectivos creadores
      const enrichedTalent = studentsData.map(student => {
        const studentProjects = publicProjects?.filter(p => p.user_id === student.id) || [];
        return {
          ...student,
          public_projects: studentProjects,
          // Simulamos un stack basado en las descripciones de los proyectos (luego lo haremos con tags reales)
          stack: studentProjects.length > 0 ? ["React", "PostgreSQL", "Next.js"] : ["En formación"]
        };
      });

      setTalents(enrichedTalent);
      setLoading(false);
    };

    fetchTalentPool();
  }, [supabase]);

  // Filtro de búsqueda en tiempo real
  const filteredTalents = talents.filter(t => 
    t.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.program?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-purple-500" /></div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <header className="border-b border-slate-800 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter">
            Talent <span className="text-purple-500">Marketplace</span>
          </h1>
          <p className="text-slate-400 mt-2 font-mono text-sm uppercase tracking-widest flex items-center gap-2">
            <Building2 size={16} className="text-purple-500" /> {profile.company_name || "Organización Verificada"}
          </p>
        </div>
        
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nombre, carrera o tecnología..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all shadow-xl"
          />
        </div>
      </header>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2 text-white">
            <Award className="text-purple-500" /> Top Perfiles Activos
          </h2>
          <span className="text-xs font-mono text-slate-500 uppercase tracking-widest bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
            {filteredTalents.length} Candidatos
          </span>
        </div>

        {filteredTalents.length === 0 ? (
          <div className="p-12 border border-dashed border-slate-800 rounded-[2rem] text-center">
            <Terminal className="mx-auto text-slate-600 mb-4" size={32} />
            <p className="text-slate-400 font-medium">No se encontraron perfiles en el radar.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredTalents.map((talent, index) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                key={talent.id} 
                className="bg-slate-900/40 border border-slate-800 p-8 rounded-[2rem] hover:border-purple-500/50 transition-all group relative overflow-hidden"
              >
                {/* Badge de Top Match para el #1 */}
                {index === 0 && talent.activity_score > 0 && (
                  <div className="absolute top-0 right-0 bg-purple-500/10 text-purple-400 text-[10px] font-black px-4 py-2 rounded-bl-2xl flex items-center gap-1 border-b border-l border-purple-500/20">
                    <Star size={12} className="fill-purple-500" /> TOP MATCH
                  </div>
                )}
                
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-bold text-2xl text-white tracking-tight">{talent.full_name}</h3>
                    <p className="text-sm text-slate-400 mt-1">{talent.program} • Semestre {talent.semester}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Activity_Score</p>
                    <p className="text-2xl font-black text-purple-400">{talent.activity_score || 0}</p>
                  </div>
                </div>

                {/* Proyectos Públicos Verificados */}
                <div className="mb-6 bg-slate-950 p-4 rounded-2xl border border-slate-800/50">
                  <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <ShieldCheck size={14} className="text-emerald-500" /> Open Source / Proyectos Públicos ({talent.public_projects.length})
                  </p>
                  {talent.public_projects.length > 0 ? (
                    <ul className="space-y-2">
                      {talent.public_projects.slice(0, 2).map((p: any) => (
                        <li key={p.id} className="text-sm text-slate-300 flex items-center gap-2">
                          <Code2 size={14} className="text-purple-500/50" /> {p.name}
                        </li>
                      ))}
                      {talent.public_projects.length > 2 && (
                        <li className="text-xs text-slate-500 italic ml-6">+{talent.public_projects.length - 2} proyectos más...</li>
                      )}
                    </ul>
                  ) : (
                    <p className="text-sm text-slate-600 italic">No hay proyectos públicos en el radar aún.</p>
                  )}
                </div>

                <div className="flex justify-between items-center mt-2 pt-6 border-t border-slate-800">
                  <div className="flex flex-wrap gap-2">
                    {talent.stack.map((tech: string) => (
                      <span key={tech} className="bg-purple-500/5 text-purple-300/80 text-[10px] px-3 py-1 rounded-lg border border-purple-500/10 font-mono uppercase">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <button className="text-sm text-white font-bold bg-purple-600 hover:bg-purple-500 px-6 py-3 rounded-xl transition-all shadow-lg shadow-purple-900/20 active:scale-95">
                    Ver Perfil
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}