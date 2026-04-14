"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Brain, 
  Briefcase, 
  Settings, 
  LogOut,
  ChevronRight,
  ListTree // Importamos el icono para el WBS
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "WBS Engine", href: "/wbs", icon: ListTree }, // Agregado aquí
  { name: "Logic Vault", href: "/vault", icon: Brain },
  { name: "Career Hub", href: "/career", icon: Briefcase },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh(); 
  };

  return (
    <aside className="w-64 h-screen bg-slate-900/50 border-r border-slate-800 flex flex-col sticky top-0">
      <div className="p-6">
        <Link href="/dashboard" className="group">
          <div className="flex items-center gap-3">
            <img 
              src="/NEXUS.png" 
              alt="Logo de Nexus-Eng" 
              className="w-10 h-10 rounded-lg group-hover:bg-blue-500 transition-colors"
            />
            <h2 className="text-xl font-bold text-white tracking-tighter transition-colors group-hover:text-blue-500">
              NEXUS<span className="text-blue-500 group-hover:text-white">ENG</span>
            </h2>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${
                isActive 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" 
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.name}</span>
              </div>
              {isActive && <ChevronRight className="h-4 w-4" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800 space-y-2">
        <Link 
          href="/settings" 
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
            pathname === "/settings" 
              ? "bg-blue-600 text-white" 
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          }`}
        >
          <Settings className="h-5 w-5" />
          <span className="text-sm font-medium">Settings</span>
        </Link>
        
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all group"
        >
          <LogOut className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Log Out</span>
        </button>
      </div>
    </aside>
  );
}