import React from "react";
import { 
  ArrowRight, 
  Layers, 
  Users, 
  FolderOpen
} from "lucide-react";
import { playExamine } from "../utils/audio";

export default function CaseSelection({ cases, onSelectCase, activeCaseId }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left">
      {/* Header Banner */}
      <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-code text-red-400 uppercase tracking-widest mb-1.5 font-semibold">
            <FolderOpen className="w-4 h-4 text-red-400" />
            <span>AI INVESTIGATION DATABASE</span>
          </div>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
            AVAILABLE CASES
          </h2>
        </div>
        <div className="text-xs font-mono-code text-slate-400 bg-white/[0.03] px-3.5 py-2 rounded-lg border border-white/[0.06]">
          SELECT CASE DOSSIER TO BEGIN INVESTIGATION
        </div>
      </div>

      {/* Grid of 3 Case Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {cases.map((c) => {
          const isSelected = activeCaseId === c.id;

          const getCaseIcon = (id) => {
            if (id === 1) return "🖥️";
            if (id === 2) return "💎";
            return "🚪";
          };

          const cluesCount = Object.keys(c.clues).length;
          const suspectsCount = Object.keys(c.suspects).length;

          return (
            <div
              key={c.id}
              className={`group relative rounded-2xl glass-panel p-6 sm:p-7 border transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5 hover:shadow-[0_10px_30px_-10px_rgba(239,68,68,0.25)] ${
                isSelected
                  ? "border-red-500/50 bg-gradient-to-b from-red-950/20 via-slate-900/60 to-slate-950/80 shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                  : "border-white/[0.08] hover:border-red-500/40 bg-slate-900/50"
              }`}
            >
              <div>
                {/* Case number & status */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="font-mono-code text-xs font-bold tracking-widest text-red-400 uppercase">
                    {c.caseNumber}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono-code font-bold bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 tracking-wider uppercase">
                    OPEN
                  </span>
                </div>

                {/* Case Title with Emoji */}
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-2xl pt-0.5 filter drop-shadow">
                    {getCaseIcon(c.id)}
                  </span>
                  <div>
                    <h3 className="font-display font-bold text-lg sm:text-xl text-white group-hover:text-red-400 transition-colors leading-snug">
                      {c.title}
                    </h3>
                  </div>
                </div>

                {/* Short Description from Python project */}
                <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                  {c.shortDescription}
                </p>

                {/* Story narrative excerpt */}
                <div className="mt-4 p-3 rounded-xl bg-black/40 border border-white/[0.05] text-xs font-mono-code text-slate-400 leading-relaxed whitespace-pre-line line-clamp-3">
                  {c.story}
                </div>
              </div>

              {/* Bottom Metrics & START CASE Button */}
              <div className="mt-6 pt-5 border-t border-white/[0.08]">
                <div className="grid grid-cols-2 gap-3 mb-5 text-xs font-mono-code">
                  <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.04]">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-cyan-400" />
                      Clues
                    </span>
                    <span className="font-bold text-white text-sm">{cluesCount}</span>
                  </div>
                  <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.04]">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-amber-400" />
                      Suspects
                    </span>
                    <span className="font-bold text-white text-sm">{suspectsCount}</span>
                  </div>
                </div>

                {/* START CASE button */}
                <button
                  onClick={() => {
                    playExamine();
                    onSelectCase(c);
                  }}
                  className={`w-full py-3 px-4 rounded-xl font-mono-code text-xs sm:text-sm font-bold tracking-wider uppercase flex items-center justify-center gap-2 transition-all duration-200 focus:outline-none ${
                    isSelected
                      ? "bg-red-600 hover:bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]"
                      : "bg-white/[0.07] hover:bg-red-600 hover:text-white text-slate-200 group-hover:border-red-500/30"
                  }`}
                >
                  <span>START CASE</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
