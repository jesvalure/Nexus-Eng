import { createClient } from "@/lib/supabase/server";
import AddStarCase from "@/components/career/add-star-case";
import { Briefcase, Target, Award, Trophy } from "lucide-react";

export default async function CareerPage() {
  const supabase = await createClient();
  const { data: cases } = await supabase
    .from("career_star_cases")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Briefcase className="text-blue-500" /> Career Hub
        </h1>
        <p className="text-slate-400 mt-2">Prepare for interviews using the STAR method (Situation, Task, Action, Result).</p>
      </header>

      <AddStarCase />

      <div className="space-y-6">
        {cases?.map((item) => (
          <div key={item.id} className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-800 bg-slate-900/80">
              <h3 className="text-xl font-bold text-blue-400">{item.title}</h3>
              <p className="text-xs text-slate-500 mt-1 font-mono">
                RECORDED ON: {new Date(item.created_at).toLocaleDateString()}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-800">
              <div className="p-4 space-y-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                  <Target className="h-3 w-3" /> Situation
                </span>
                <p className="text-sm text-slate-300 italic">"{item.situation}"</p>
              </div>
              <div className="p-4 space-y-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Task</span>
                <p className="text-sm text-slate-300">{item.task}</p>
              </div>
              <div className="p-4 space-y-2">
                <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest flex items-center gap-1">
                  <Award className="h-3 w-3" /> Action
                </span>
                <p className="text-sm text-slate-100">{item.action}</p>
              </div>
              <div className="p-4 space-y-2 bg-blue-500/5">
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                  <Trophy className="h-3 w-3" /> Result
                </span>
                <p className="text-sm text-emerald-500/90 font-medium">{item.result}</p>
              </div>
            </div>
          </div>
        ))}

        {cases?.length === 0 && (
          <div className="text-center py-20 bg-slate-900/20 border-2 border-dashed border-slate-800 rounded-3xl">
            <p className="text-slate-500 italic">Your career repository is empty. Document your first win!</p>
          </div>
        )}
      </div>
    </div>
  );
}