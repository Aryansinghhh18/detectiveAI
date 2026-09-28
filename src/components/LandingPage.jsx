import { 
  ArrowRight, 
  Database, 
  Layers, 
  GitBranch, 
  Cpu, 
  ShieldAlert, 
  Compass
} from "lucide-react";
import { AI_CONCEPTS } from "../data/cases";
import { playExamine } from "../utils/audio";

export default function LandingPage({ onStart }) {
  const getConceptIcon = (iconName) => {
    switch (iconName) {
      case "database": return <Database className="w-5 h-5 text-cyan-400" />;
      case "layers": return <Layers className="w-5 h-5 text-amber-400" />;
      case "git-branch": return <GitBranch className="w-5 h-5 text-emerald-400" />;
      case "cpu": return <Cpu className="w-5 h-5 text-red-400" />;
      case "shield": return <ShieldAlert className="w-5 h-5 text-rose-400" />;
      case "compass": return <Compass className="w-5 h-5 text-purple-400" />;
      default: return <Cpu className="w-5 h-5 text-cyan-400" />;
    }
  };

  const workflowSteps = [
    { title: "CASE DATA", desc: "Raw incidents, suspect profiles, timelines, and clues" },
    { title: "KNOWLEDGE REPRESENTATION", desc: "Structured state facts, access permissions, and alibis" },
    { title: "EVIDENCE GRAPH", desc: "Directed causality links forming an investigation search tree" },
    { title: "BFS / DFS SEARCH", desc: "Algorithmic traversal (Queue vs Stack) revealing lead chains" },
    { title: "FORWARD CHAINING", desc: "Data-driven production rule evaluation" },
    { title: "RULE-BASED REASONING", desc: "Inference rules deducing opportunity, alibi, and motive" },
    { title: "AI ANALYSIS", desc: "Synthesizing cross-examined clues into current deductions" },
    { title: "USER ACCUSATION", desc: "Evaluating suspect hypothesis against evidence without false certainty" }
  ];

  return (
    <div className="relative min-h-[calc(100vh-65px)] flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left">
      {/* Background Subtle Ambience */}
      <div className="absolute inset-0 bg-investigation-grid opacity-30 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Hero Container */}
      <div className="relative z-10 max-w-4xl mx-auto text-center pt-6 pb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/50 border border-red-500/30 text-red-400 text-xs font-mono-code mb-8 tracking-widest uppercase font-semibold shadow-[0_0_20px_rgba(239,68,68,0.15)] animate-pulse-subtle">
          <span className="w-2 h-2 rounded-full bg-red-400" />
          <span>COLLEGE AI MINI-PROJECT // KNOWLEDGE & SEARCH SYSTEM</span>
        </div>

        {/* Title */}
        <div className="mb-3 flex items-center justify-center">
          <span className="text-5xl md:text-6xl filter drop-shadow">🕵️</span>
        </div>

        <h1 className="font-display font-extrabold text-4xl sm:text-6xl text-white tracking-tight mb-4">
          AI DETECTIVE
        </h1>

        {/* Subtitle from user spec */}
        <h2 className="text-base sm:text-xl font-mono-code text-red-400 font-semibold mb-6 tracking-wide">
          An Interactive AI-Based Crime Investigation System
        </h2>

        {/* Short description from user spec */}
        <p className="max-w-2xl mx-auto text-slate-300 text-base sm:text-lg font-normal leading-relaxed mb-10 text-balance">
          &ldquo;Investigate cases, examine evidence, interrogate suspects, and use AI search and rule-based reasoning to solve the mystery.&rdquo;
        </p>

        {/* START INVESTIGATION CTA */}
        <div className="flex items-center justify-center">
          <button
            onClick={() => {
              playExamine();
              onStart();
            }}
            className="px-9 py-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-mono-code text-sm font-bold tracking-wider uppercase flex items-center gap-3 shadow-[0_0_25px_rgba(239,68,68,0.4)] hover:shadow-[0_0_35px_rgba(239,68,68,0.6)] hover:-translate-y-0.5 active:translate-y-0.5 transition-all focus:outline-none"
          >
            <span>START INVESTIGATION</span>
            <ArrowRight className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* 3. AI CONCEPTS USED SECTION (Exact spec from requirements) */}
      <div className="relative z-10 w-full mt-8 mb-16">
        <div className="border-b border-white/[0.08] pb-3 mb-6 text-center sm:text-left flex items-center justify-between">
          <div>
            <span className="text-xs font-mono-code text-red-400 uppercase tracking-widest font-semibold block mb-1">
              THEORETICAL FOUNDATION
            </span>
            <h3 className="font-display font-bold text-xl sm:text-2xl text-white">
              AI CONCEPTS USED
            </h3>
          </div>
          <span className="text-xs font-mono-code text-slate-500 hidden sm:inline-block">
            6 CORE CURRICULUM MODULES
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {AI_CONCEPTS.map((concept, idx) => (
            <div
              key={idx}
              className="glass-panel p-5 rounded-2xl border border-white/[0.07] hover:border-red-500/30 transition-all duration-300 group hover:-translate-y-1 bg-slate-900/40"
            >
              <div className="w-10 h-10 rounded-xl bg-black/50 border border-white/10 flex items-center justify-center mb-3.5 group-hover:scale-105 transition-transform">
                {getConceptIcon(concept.icon)}
              </div>
              <h4 className="font-display font-bold text-sm sm:text-base text-white mb-1.5 group-hover:text-red-400 transition-colors">
                {concept.title}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                {concept.shortDesc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 17. HOW THE AI WORKS (Visual Pipeline from user requirements) */}
      <div className="relative z-10 w-full mb-8 p-6 sm:p-8 rounded-2xl glass-panel border border-white/[0.08] bg-[#0c111c]/90 shadow-xl">
        <div className="text-center sm:text-left mb-6 border-b border-white/[0.06] pb-4">
          <span className="text-xs font-mono-code text-cyan-400 uppercase tracking-widest font-semibold block mb-1">
            EXAMINER & VIVA ARCHITECTURE
          </span>
          <h3 className="font-display font-bold text-xl sm:text-2xl text-white">
            HOW THE AI WORKS
          </h3>
          <p className="text-xs font-mono-code text-slate-400 mt-1">
            Visual pipeline demonstrating state-space search and knowledge inference
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {workflowSteps.map((step, idx) => (
            <div key={idx} className="relative flex flex-col justify-between p-3.5 rounded-xl bg-black/40 border border-white/[0.05]">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-white/[0.05] text-slate-400">
                    STEP 0{idx + 1}
                  </span>
                  {idx < workflowSteps.length - 1 && (
                    <span className="text-slate-600 font-mono-code text-xs hidden lg:inline">➔</span>
                  )}
                </div>
                <h5 className="font-mono-code font-bold text-xs text-white mb-1">
                  {step.title}
                </h5>
                <p className="text-[11px] text-slate-400 leading-normal font-sans">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-mono-code gap-2">
        <span>AI DETECTIVE // BROWSER-BASED CONVERSION OF PYTHON SYSTEM</span>
        <span>ZERO EXTERNAL APIS • PURE SEARCH & FORWARD CHAINING</span>
      </div>
    </div>
  );
}
