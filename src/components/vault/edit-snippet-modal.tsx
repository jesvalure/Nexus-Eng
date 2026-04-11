"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Save, X } from "lucide-react";

interface EditSnippetModalProps {
    snippet: any;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: () => void;
}

export default function EditSnippetModal({ snippet, isOpen, onClose, onUpdate }: EditSnippetModalProps){
    const [loading, setLoading] = useState(false);
    const supabase = createClient();

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        
        const { error } = await supabase
            .from("vault")
            .update({
                title: formData.get("title"),
                description: formData.get("description"),
                code: formData.get("code"),
                language: formData.get("language"),
                category: formData.get("category"),
            })
            .eq("id", snippet.id);
        
        if (error) {
            alert(error.message);
        } else {
            onUpdate();
            onClose();
        }
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">Edit Logic Snippet</h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                        <X className="h-5 w-5"/>
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-mono text-slate-500 uppercase ml-1">Title</label>
                            <input name="title" defaultValue={snippet.title} className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-sm text-white outline-none focus:ring-1 focus:ring-blue-500" required />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-mono text-slate-500 uppercase ml-1">Language</label>
                            <input name="language" defaultValue={snippet.language} className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-sm text-white outline-none focus:ring-1 focus:ring-blue-500" required />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-mono text-slate-500 uppercase ml-1">Category</label>
                            <select name="category" defaultValue={snippet.category} className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-sm text-slate-300 outline-none focus:ring-1 focus:ring-blue-500">
                                <option value="General">General</option>
                                <option value="Backend">Backend</option>
                                <option value="Frontend">Frontend</option>
                                <option value="DevOps">DevOps</option>
                                <option value="Embedded">Embedded</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-mono text-slate-500 uppercase ml-1">Description</label>
                        <textarea name="description" defaultValue={snippet.description} className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-sm text-slate-300 outline-none focus:ring-1 focus:ring-blue-500" rows={2}/>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-mono text-slate-500 uppercase ml-1">Source Code</label>
                        <textarea name="code" defaultValue={snippet.code} className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-sm text-slate-300 outline-none focus:ring-1 focus:ring-blue-500" rows={6} required />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 rounded-xl transition-all">
                            Cancel
                        </button>
                        <button disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2">
                            {loading ? <Loader2 className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4" />}
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
