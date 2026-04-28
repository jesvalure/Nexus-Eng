"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { 
  Mail, Lock, Loader2, UserPlus, ArrowLeft, ArrowRight, 
  User, GraduationCap, Briefcase, Building2, Terminal 
} from "lucide-react";
import Link from "next/link";
import RoleSelection from "./role-selection";

type Step = 1 | 2 | 3;

export default function SignUpPage() {
  const [step, setStep] = useState<Step>(1);
  const [role, setRole] = useState<'student' | 'recruiter' | null>(null);
  
  // Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [program, setProgram] = useState("Ingeniería en Computadores"); // Default TEC
  const [semester, setSemester] = useState("1");
  const [company, setCompany] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);
  
  const router = useRouter();
  const supabase = createClient();

  const handleFinalSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // 1. Registro en Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        // Guardamos metadatos iniciales para el trigger de la base de datos
        data: {
          full_name: fullName,
          role: role,
        }
      },
    });

    if (authError) {
      setMessage({ type: 'error', text: authError.message });
      setLoading(false);
      return;
    }

    // 2. Actualizamos el perfil con los datos extendidos que pediste
    if (authData.user) {
      const updates = {
        id: authData.user.id,
        full_name: fullName,
        role: role,
        program: role === 'student' ? program : null,
        semester: role === 'student' ? parseInt(semester) : null,
        company_name: role === 'recruiter' ? company : null,
        updated_at: new Date(),
      };

      const { error: profileError } = await supabase
        .from('profiles')
        .upsert(updates);

      if (profileError) {
        console.error("Error updating profile:", profileError);
      }
    }

    setMessage({ 
      type: 'success', 
      text: "¡Sistema Nominal! Revisa tu correo para confirmar el acceso." 
    });
    setLoading(false);
  };

  const nextStep = () => setStep((s) => (s + 1) as Step);
  const prevStep = () => setStep((s) => (s - 1) as Step);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6 selection:bg-blue-500/30">
      <div className="w-full max-w-2xl">
        
        {/* --- INDICADOR DE PROGRESO --- */}
        <div className="mb-12 flex justify-center gap-2">
          {[1, 2, 3].map((i) => (
            <div 
              key={i}
              className={`h-1 rounded-full transition-all duration-500 ${
                step >= i ? "w-12 bg-blue-500" : "w-8 bg-slate-800"
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 1: ROL */}
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center">
                <h2 className="text-4xl font-black text-white tracking-tighter">IDENTIFÍCATE</h2>
                <p className="text-slate-500 mt-2 font-mono text-xs uppercase tracking-[0.2em]">Select_User_Protocol</p>
              </div>
              
              <RoleSelection 
                selectedRole={role || ''} 
                onSelect={(r) => { setRole(r); nextStep(); }} 
              />
              
              <p className="text-center text-slate-600 text-sm pt-4">
                ¿Ya tienes cuenta? <Link href="/auth/login" className="text-blue-500 hover:underline">Inicia sesión</Link>
              </p>
            </motion.div>
          )}

          {/* STEP 2: CREDENCIALES */}
          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-md mx-auto"
            >
              <button onClick={prevStep} className="text-slate-500 hover:text-white flex items-center gap-2 mb-8 text-sm transition-colors">
                <ArrowLeft size={16} /> Volver
              </button>
              
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white tracking-tight">Acceso al Kernel</h2>
                <p className="text-slate-400 mt-1">Define tus credenciales de seguridad.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-mono text-slate-500 uppercase tracking-widest ml-1">Email_Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600" />
                    <input
                      type="email"
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                      placeholder="ingeniero@itcr.ac.cr"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono text-slate-500 uppercase tracking-widest ml-1">Security_Key</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600" />
                    <input
                      type="password"
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  onClick={nextStep}
                  disabled={!email || password.length < 6}
                  className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-30 text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 mt-4"
                >
                  Continuar <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: PERFIL DETALLADO */}
          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="max-w-md mx-auto"
            >
              <button onClick={prevStep} className="text-slate-500 hover:text-white flex items-center gap-2 mb-8 text-sm transition-colors">
                <ArrowLeft size={16} /> Credenciales
              </button>

              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white tracking-tight">Configuración Final</h2>
                <p className="text-slate-400 mt-1">Nexus-Eng se adapta a tu perfil de {role === 'student' ? 'Estudiante' : 'Reclutador'}.</p>
              </div>

              <form onSubmit={handleFinalSignUp} className="space-y-5">
                {message && (
                  <div className={`p-4 rounded-2xl border ${message.type === 'error' ? "bg-red-500/10 border-red-500/20 text-red-400" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"}`}>
                    {message.text}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-mono text-slate-500 uppercase tracking-widest ml-1">Nombre_Completo</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600" />
                    <input
                      required
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                      placeholder="Ej. Jesus ..."
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                </div>

                {role === 'student' ? (
                  <>
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-slate-500 uppercase tracking-widest ml-1">Carrera_Programa</label>
                      <div className="relative">
                        <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600" />
                        <select 
                          className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white appearance-none outline-none focus:ring-2 focus:ring-blue-500/50"
                          value={program}
                          onChange={(e) => setProgram(e.target.value)}
                        >
                          <option value="Ingeniería en Computadores">Ingeniería en Computadores</option>
                          <option value="Ingeniería en Computación">Ingeniería en Computación</option>
                          <option value="Diseño Industrial">Diseño Industrial</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-slate-500 uppercase tracking-widest ml-1">Semestre_Actual</label>
                      <input
                        type="number"
                        min="1" max="12"
                        className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 px-6 text-white outline-none focus:ring-2 focus:ring-blue-500/50"
                        value={semester}
                        onChange={(e) => setSemester(e.target.value)}
                      />
                    </div>
                  </>
                ) : (
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-slate-500 uppercase tracking-widest ml-1">Empresa_Organización</label>
                    <div className="relative">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600" />
                      <input
                        required
                        className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
                        placeholder="Google, Microsoft, etc."
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full ${role === 'student' ? 'bg-blue-600 hover:bg-blue-500' : 'bg-purple-600 hover:bg-purple-500'} text-white font-black py-5 rounded-[2rem] transition-all flex items-center justify-center gap-2 mt-6 shadow-xl`}
                >
                  {loading ? <Loader2 className="animate-spin" /> : <>INICIALIZAR_PROTOCOLO <UserPlus size={20} /></>}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}