import React from "react";
import { 
  X, 
  Network, 
  ListTree, 
  Cpu, 
  Clock, 
  BookOpen
} from "lucide-react";
import { playClick } from "../utils/audio";

export default function HowItWorksModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in text-left">
      <div className="relative w-full max-w-3xl glass-panel-glow border border-amber-500/30 bg-[#0d1322] rounded-2xl p-6 sm:p-8 shadow-2xl max-h-[92vh] flex flex-col justify-between overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-950/60 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-lg">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-widest font-semibold">
                ACADEMIC VIVA & PRESENTATION GUIDE
              </span>
              <h2 className="font-display font-bold text-xl sm:text-2xl text-white">
                How AI Detective Works
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="space-y-6 text-slate-300 font-sans text-xs sm:text-sm">
          
          {/* Concept 1: Graph Representation */}
          <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-display font-semibold text-sm">
              <Network className="w-4 h-4" />
              <span>1. Graph-Based Clue Representation (Knowledge Graph)</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs font-mono-code">
              The crime scene is modeled as a <strong>Directed Acyclic Graph (DAG)</strong>:
              <br />• <strong>Vertices $V$:</strong> Clues & Forensic findings ($C_1, C_2, \dots, C_6$).
              <br />• <strong>Directed Edges $E$:</strong> Investigative dependencies (e.g., examining $C_1$ unlocks leads to $C_2$ and $C_3$).
            </p>
          </div>

          {/* Concept 2: BFS vs DFS Algorithms */}
          <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-display font-semibold text-sm">
              <ListTree className="w-4 h-4" />
              <span>2. Graph Search Algorithms (BFS vs DFS for Viva)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs font-mono-code">
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                <strong className="text-cyan-300 block mb-1">Breadth-First Search (BFS)</strong>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Uses a <strong>FIFO Queue</strong>. Explores all clues at depth $d$ before proceeding to depth $d+1$. Guarantees discovering the shortest logical chain of custody.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                <strong className="text-amber-300 block mb-1">Depth-First Search (DFS)</strong>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Uses a <strong>LIFO Stack</strong>. Pursues one branch of evidence to its deepest conclusion before backtracking. Ideal for tracing isolated suspect trails.
                </p>
              </div>
            </div>
          </div>

          {/* Concept 3: Forward Chaining Rule Engine */}
          <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] space-y-2">
            <div className="flex items-center gap-2 text-red-400 font-display font-semibold text-sm">
              <Cpu className="w-4 h-4" />
              <span>3. Rule-Based AI Engine & Forward Chaining</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs font-mono-code">
              Operates as an <strong>Expert System</strong> using forward chaining (data-driven reasoning). It evaluates production rules of the form <code>IF &lt;conditions&gt; THEN &lt;deduction&gt;</code> against verified facts stored in the knowledge base.
            </p>
            <div className="p-2.5 rounded bg-black/60 border border-red-500/20 text-[11px] font-mono-code text-red-300">
              <code>Example: IF (Suspect_Present_At_Time AND Holds_Keycard_Access) THEN Opportunity = HIGH</code>
            </div>
          </div>

          {/* Concept 4: Contradiction Detection */}
          <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-display font-semibold text-sm">
              <Clock className="w-4 h-4" />
              <span>4. Alibi Verification & Contradiction Detection</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs font-mono-code">
              When suspects provide statements during interrogation, their claims are mathematically cross-referenced with timestamped forensic telemetry (CCTV logs, RFID swipes, and MAC address triangulation). Any disjoint interval immediately raises a perjury flag.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono-code">
          <span className="text-slate-500">
            AI Investigation System // College Presentation Reference
          </span>
          <button
            onClick={() => {
              playClick();
              onClose();
            }}
            className="px-6 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-white font-medium transition-colors"
          >
            GOT IT
          </button>
        </div>
      </div>
    </div>
  );
}
