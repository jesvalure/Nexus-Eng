"use client";

import React, { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { X, Projector, Loader2, Rocket } from "lucide-react";
import { useRouter } from "next/navigation";
import { useProfile } from "@/context/ProfileContext";
import { motion } from "framer-motion";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function CreateProjectModal({ isOpen, onClose, onSuccess }: Props) {
    const [loading, setloading] = useState(false);
    const { profile } = useProfile();
    const supabase = createClient();

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setloading(true);

        const formData = new FormData(e.currentTarget);
        const name = formData.get("name") as string;
        const description = formData.get("description") as string;

        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            const { error } = await supabase.from("projects").insert({
                name, 
                description,
                user_id: user.id,
            });

            if (!error){
                onSuccess();
                onClose();
            } else {
                alert("Error al inicializar: " + error.message);
            }
        }
        setloading(false);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1}}
                className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl shadow-blue-500/10"
            >
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500">
                            <Rocket size={20} />
                        </div>
                        <h2 className="text-xl font-bold text-white tracking-tight">
                            Nuevo Proyecto
                        </h2>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em] mb-2 block ml-1">
                            Nombre del Proyecto
                        </label>
                        <input 
                            name="name"
                            required
                            autoFocus
                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-700"
                            placeholder="Ej: Proyecto Alpha"
                        />
                    </div>

                    <div>
                        <label className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em] mb-2 block ml-1">
                            Objetivos Tecnicos
                        </label>
                        <textarea
                            name="description"
                            rows={3}
                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-700 resize-none h-24"
                            placeholder="Desglose breve del alcance..."
                        />
                    </div>

                    <button
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-3 disabled:opacity-50 group"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin"size={20} />
                        ) : (
                            <>
                                Crear Proyecto
                                <Rocket size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}