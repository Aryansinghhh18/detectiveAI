import React, { useState } from "react";
import { 
  Volume2, 
  VolumeX, 
  HelpCircle, 
  ChevronRight,
  Terminal
} from "lucide-react";
import { playClick, setMuted, getMuted } from "../utils/audio";

export default function Navbar({
  currentView,
  onNavigate,
  activeCase,
  onOpenHowItWorks,
}) {
  const [muted, setLocalMuted] = useState(getMuted());

  const toggleSound = () => {
    const next = !muted;
    setLocalMuted(next);
    setMuted(next);
    if (!next) playClick();
  };

  const handleNav = (view) => {
    playClick();
    onNavigate(view);
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/[0.08] px-4 md:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Brand / Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleNav("home")}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-lg bg-red-950/60 border border-red-500/30 flex items-center justify-center text-lg shadow-[0_0_15px_rgba(239,68,68,0.2)] group-hover:border-red-500/60 transition-colors">
              🕵️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold tracking-wider text-base md:text-lg text-slate-100 group-hover:text-red-400 transition-colors">
                  AI DETECTIVE
                </span>
                <span className="text-[10px] font-mono-code px-1.5 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-red-400 uppercase tracking-widest hidden sm:inline-block">
                  v2.4
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono-code tracking-tight hidden sm:block">
                INTERACTIVE INVESTIGATION SYSTEM
              </p>
            </div>
          </button>

          {/* Active Case Breadcrumb Pill */}
          {activeCase && currentView === "investigation" && (
            <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-white/10 text-xs font-mono-code text-slate-400">
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-red-400 font-semibold">{activeCase.caseNumber}</span>
              <span className="text-slate-300 truncate max-w-[200px]">{activeCase.title}</span>
            </div>
          )}
        </div>

        {/* Center / Right: Nav items */}
        <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => handleNav("home")}
              className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all ${
                currentView === "home"
                  ? "bg-white/[0.08] text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
              }`}
            >
              HOME
            </button>

            <button
              onClick={() => handleNav("cases")}
              className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all ${
                currentView === "cases"
                  ? "bg-white/[0.08] text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
              }`}
            >
              CASES
            </button>

            {activeCase && (
              <button
                onClick={() => handleNav("investigation")}
                className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all flex items-center gap-1.5 ${
                  currentView === "investigation"
                    ? "bg-red-500/15 border border-red-500/30 text-red-300"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
                }`}
              >
                <Terminal className="w-3.5 h-3.5 text-red-400" />
                <span className="hidden sm:inline">DASHBOARD</span>
                <span className="sm:hidden">BOARD</span>
              </button>
            )}

            <button
              onClick={() => {
                playClick();
                onOpenHowItWorks();
              }}
              className="px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium text-slate-400 hover:text-amber-300 hover:bg-amber-500/10 transition-all flex items-center gap-1.5"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">HOW IT WORKS</span>
              <span className="sm:hidden">GUIDE</span>
            </button>
          </nav>

          {/* Status Indicator & Audio Toggle */}
          <div className="flex items-center gap-2 pl-2 sm:pl-4 border-l border-white/10">
            {/* System Online Status */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/20 text-[11px] font-mono-code text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="hidden xl:inline">SYSTEM ONLINE</span>
              <span className="xl:hidden">ONLINE</span>
            </div>

            {/* Audio Toggle */}
            <button
              onClick={toggleSound}
              title={muted ? "Unmute Sound Effects" : "Mute Sound Effects"}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] transition-colors focus:outline-none"
            >
              {muted ? (
                <VolumeX className="w-4 h-4 text-slate-500" />
              ) : (
                <Volume2 className="w-4 h-4 text-slate-300" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
