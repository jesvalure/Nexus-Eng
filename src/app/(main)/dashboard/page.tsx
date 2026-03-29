import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();

  // Verificamos la sesión en el servidor por seguridad extra
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <header className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, <span className="text-blue-500 font-mono">{user.email?.split('@')[0]}</span>
        </h1>
        <p className="text-slate-400 mt-2">System Status: <span className="text-emerald-500 underline decoration-emerald-500/30">Online</span></p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card: WBS */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl hover:border-blue-500/50 transition-colors">
          <h3 className="text-lg font-semibold mb-2">WBS Engine</h3>
          <p className="text-sm text-slate-400">Manage your project breakdowns.</p>
        </div>

        {/* Card: Logic Vault */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl hover:border-blue-500/50 transition-colors">
          <h3 className="text-lg font-semibold mb-2">Logic Vault</h3>
          <p className="text-sm text-slate-400">Access your technical snippets.</p>
        </div>

        {/* Card: Career Hub */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl hover:border-blue-500/50 transition-colors">
          <h3 className="text-lg font-semibold mb-2">Career Hub</h3>
          <p className="text-sm text-slate-400">Track STAR interview cases.</p>
        </div>
      </div>
    </div>
  );
}