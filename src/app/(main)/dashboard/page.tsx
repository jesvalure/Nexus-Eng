import { createClient } from "@/lib/supabase/server";
import DashboardClient from "@/components/projects/dashboard-client";

export default async function DashboardPage() {
  const supabase = await createClient();
  
  // Traemos los proyectos desde el servidor para carga instantánea
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="p-8">
      {/* Pasamos los datos al componente cliente. 
        Él se encargará de mostrar la lista y manejar el modal.
      */}
      <DashboardClient initialProjects={projects || []} />
    </div>
  );
}