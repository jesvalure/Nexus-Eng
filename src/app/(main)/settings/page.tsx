"use client";

import { useState, useEffect } from "react";
import { User, Shield, Palette, Bell, Save, LogOut, Cpu, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const tabs = [
    { id: "profile", label: "Professional Profile", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "appearance", label: "Appearance", icon: Palette },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Cpu className="text-blue-500" /> System Settings
        </h1>
        <p className="text-slate-400 mt-2">Manage your engineering identity and platform preferences.</p>
      </header>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Navegación Lateral */}
        <aside className="w-full md:w-64 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" 
                : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
          
          <div className="pt-4 mt-4 border-t border-slate-800">
            <button 
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Contenido Dinámico */}
        <main className="flex-1 bg-slate-900/40 border border-slate-800 rounded-3xl p-8 shadow-xl">
          {activeTab === "profile" && <ProfileSection />}
          {activeTab === "security" && <SecuritySection />}
          {activeTab === "appearance" && <AppearanceSection />}
        </main>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTES DE SECCIÓN ---

function ProfileSection() {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const supabase = createClient();

  // Cargar perfil al montar el componente
  useEffect(() => {
    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        
        if (data) setProfile(data);
      }
    }
    getProfile();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const { data: { user } } = await supabase.auth.getUser();

    const updates = {
      id: user?.id,
      full_name: formData.get("full_name"),
      program: formData.get("program"),
      semester: parseInt(formData.get("semester") as string),
      technical_interests: formData.get("interests"),
      updated_at: new Date(),
    };

    const { error } = await supabase.from("profiles").upsert(updates);

    if (error) alert(error.message);
    else alert("Profile synchronized successfully.");
    
    setLoading(false);
  };

  return (
    <form onSubmit={handleUpdateProfile} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div>
        <h3 className="text-xl font-bold text-white">Engineering Profile</h3>
        <p className="text-sm text-slate-500">Manage your identity at Instituto Tecnológico de Costa Rica.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-mono text-slate-500 uppercase">Full Name</label>
          <input 
            name="full_name"
            defaultValue={profile?.full_name || ""} 
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:ring-2 focus:ring-blue-500/50" 
            placeholder="Name" 
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-mono text-slate-500 uppercase">Degree Program</label>
          <input 
            name="program"
            placeholder="Career"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:ring-2 focus:ring-blue-500/50" 
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-mono text-slate-500 uppercase">Current Semester</label>
          <select 
            name="semester"
            defaultValue={profile?.semester || 8}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            {[1,2,3,4,5,6,7,8,9,10].map(s => (
              <option key={s} value={s}>{s}° Semester</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-mono text-slate-500 uppercase">Technical Interests (e.g., AI, Cloud, Backend)</label>
        <textarea 
          name="interests"
          placeholder="Artificial Intelligence, Software Design, Project Management"
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:ring-2 focus:ring-blue-500/50" 
          rows={3} 
        />
      </div>

      <button 
        disabled={loading}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded-xl font-bold text-white transition-all ml-auto shadow-lg shadow-blue-900/40"
      >
        {loading ? <Loader2 className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4" />}
        Sync Engineering Identity
      </button>
    </form>
  );
}

function SecuritySection() {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white">Security & Access</h3>
      <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl">
        <p className="text-sm text-amber-500">Authentication is managed via Supabase Auth. To change your password, check your registered email.</p>
      </div>
      <button className="w-full md:w-auto bg-slate-800 hover:bg-slate-700 px-6 py-3 rounded-xl font-bold text-white transition-all">
        Request Password Reset
      </button>
    </div>
  );
}

function AppearanceSection() {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white">Visual Preferences</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 border-2 border-blue-600 bg-slate-950 rounded-2xl flex items-center justify-between">
          <span className="text-sm text-white">Nexus Dark (Default)</span>
          <div className="h-3 w-3 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.8)]" />
        </div>
        <div className="p-4 border border-slate-800 bg-slate-900/50 rounded-2xl flex items-center justify-between opacity-50 grayscale cursor-not-allowed">
          <span className="text-sm text-slate-500">Light Mode (Soon)</span>
        </div>
      </div>
    </div>
  );
}