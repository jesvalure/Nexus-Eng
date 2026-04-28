"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";
import StudentDashboard from "@/components/dashboard/StudentDashboard";
import RecruiterDashboard from "@/components/dashboard/RecruiterDashboard";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/auth/login");
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      setProfile(data);
      setLoading(false);
    };

    fetchProfile();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }

  // Enrutamiento Condicional basado en el Rol
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {profile?.role === 'recruiter' ? (
        <RecruiterDashboard profile={profile} />
      ) : (
        <StudentDashboard profile={profile} />
      )}
    </div>
  );
}