import { ProfileProvider } from "@/context/ProfileContext";
import Sidebar  from "@/components/layout/sidebar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProfileProvider>
      <div className="flex">
        <Sidebar />
        <main className="flex-1 bg-slate-950 min-h-screen">
          {children}
        </main>
      </div>
    </ProfileProvider>
  );
}