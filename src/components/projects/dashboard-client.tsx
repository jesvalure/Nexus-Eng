"use client";

import { useState } from "react";
import { FolderPlus, ListTree, ArrowRight } from "lucide-react";
import Link from "next/link";
import NewProjectModal from "./new-project-modal";

export default function DashboardClient({ initialProjects }: { initialProjects: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Project Control</h1>
          <p className="text-slate-400">Manage your WBS and project lifecycles.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-xl text-sm font-bold transition-all"
        >
          <FolderPlus className="h-4 w-4" /> New Project
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {initialProjects.map((project) => (
          <Link key={project.id} href={`/dashboard/projects/${project.id}`} className="group p-6 bg-slate-900/40 border border-slate-800 rounded-2xl hover:border-blue-500/50 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-500/10 rounded-xl group-hover:bg-blue-500/20 transition-colors">
                <ListTree className="h-6 w-6 text-blue-500" />
              </div>
              <ArrowRight className="h-5 w-5 text-slate-700 group-hover:text-blue-500 transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-slate-100 mb-2">{project.name}</h3>
            <p className="text-sm text-slate-400 line-clamp-2">{project.description}</p>
          </Link>
        ))}
      </div>

      <NewProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}