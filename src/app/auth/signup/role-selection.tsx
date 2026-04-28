"use client";

import { motion } from "framer-motion";
import { GraduationCap, Briefcase, ChevronRight, ShieldCheck } from "lucide-react";

interface RoleCardProps {
  title: string;
  description: string;
  icon: any;
  selected: boolean;
  onClick: () => void;
  color: string;
}

const RoleCard = ({ title, description, icon: Icon, selected, onClick, color }: RoleCardProps) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`relative p-6 rounded-[2rem] border-2 cursor-pointer transition-all duration-300 ${
      selected 
        ? `bg-slate-900 border-${color}-500 shadow-[0_0_30px_rgba(59,130,246,0.1)]` 
        : "bg-slate-900/40 border-slate-800 hover:border-slate-700"
    }`}
  >
    <div className={`p-4 rounded-2xl w-fit mb-4 ${selected ? `bg-${color}-500/10 text-${color}-500` : "bg-slate-950 text-slate-500"}`}>
      <Icon size={28} />
    </div>
    <h3 className={`text-xl font-bold mb-2 ${selected ? "text-white" : "text-slate-400"}`}>{title}</h3>
    <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
    
    {selected && (
      <motion.div 
        initial={{ opacity: 0, x: -10 }} 
        animate={{ opacity: 1, x: 0 }}
        className={`mt-4 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-${color}-500`}
      >
        Seleccionado <ShieldCheck size={14} />
      </motion.div>
    )}
  </motion.div>
);

export default function RoleSelection({ onSelect, selectedRole }: { onSelect: (role: 'student' | 'recruiter') => void, selectedRole: string }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
      <RoleCard
        title="Estudiante / Dev"
        description="Gestiona tus proyectos, construye tu Vault y destaca ante reclutadores con tus casos STAR."
        icon={GraduationCap}
        selected={selectedRole === 'student'}
        onClick={() => onSelect('student')}
        color="blue"
      />
      <RoleCard
        title="Reclutador / Talent"
        description="Accede a los Logic Vaults de los mejores talentos y filtra por proyectos reales verificados."
        icon={Briefcase}
        selected={selectedRole === 'recruiter'}
        onClick={() => onSelect('recruiter')}
        color="purple"
      />
    </div>
  );
}