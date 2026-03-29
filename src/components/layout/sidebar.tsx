"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; // 1. Importar useRouter
import { 
  LayoutDashboard, 
  Brain, 
  Briefcase, 
  Settings, 
  LogOut,
  ChevronRight
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Logic Vault", href: "/vault", icon: Brain },
  { name: "Career Hub", href: "/career", icon: Briefcase },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter(); // 2. Inicializar el router
  const supabase = createClient();

  const handleLogout = async () => {
    // Usamos el cliente ya inicializado arriba
    await supabase.auth.signOut();
    
    // Forzamos la redirección y el refresco para limpiar estados de sesión
    router.push("/");
    router.refresh(); 
  };

  return (
    <aside className="w-64 h-screen bg-slate-900/50 border-r border-slate-800 flex flex-col sticky top-0">
      <div className="p-6">
        <Link href="/dashboard" className="group">
          <h2 className="text-xl font-bold text-white tracking-tighter flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-sm group-hover:bg-blue-500 transition-colors">N</div>
            NEXUS-ENG
          </h2>
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
        {/* Link de Settings: Asegúrate de que esta página exista luego */}
        <Link href="/settings" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-slate-200 transition-colors rounded-xl hover:bg-slate-800">
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