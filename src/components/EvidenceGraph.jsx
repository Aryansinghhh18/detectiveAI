import React from "react";
import { 
  Lock, 
  CheckCircle2, 
  Eye, 
  ChevronRight 
} from "lucide-react";
import { playClick, playExamine } from "../utils/audio";

// Node grid coordinates (percentage based for responsive scaling)
const NODE_POSITIONS = {
  C1: { x: 50, y: 14 },
  C2: { x: 26, y: 44 },
  C3: { x: 74, y: 44 },
  C4: { x: 26, y: 78 },
  C5: { x: 74, y: 78 },
  C6: { x: 50, y: 94 },
};

export default function EvidenceGraph({
  evidenceNodes,
  investigatedIds,
  selectedEvidenceId,
  onSelectEvidence,
  onExamineEvidence,
  traversalState, // { activeNode, visitedOrder, activeEdge }
}) {
  // Check if a node is currently active in BFS/DFS traversal
  const isTraversalActive = (nodeId) => traversalState?.activeNode === nodeId;

  // Check if an edge is active
  const isEdgeActive = (from, to) => {
    if (!traversalState?.activeEdge) return false;
    return traversalState.activeEdge.from === from && traversalState.activeEdge.to === to;
  };

  const isEdgeTraversed = (from, to) => {
    if (!traversalState?.edgesTraversed) return false;
    return traversalState.edgesTraversed.some((e) => e.from === from && e.to === to);
  };

  return (
    <div className="relative w-full h-[620px] rounded-2xl glass-panel border border-white/[0.08] overflow-hidden bg-[#090d16] p-4 flex flex-col justify-between">
      {/* Background Grid & Vignette */}
      <div className="absolute inset-0 bg-investigation-grid opacity-30 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-red-600/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Evidence Board Header Info */}
      <div className="relative z-10 flex items-center justify-between border-b border-white/[0.06] pb-3 text-xs font-mono-code text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span className="text-slate-200 font-bold uppercase tracking-wider">
            EVIDENCE DEPENDENCY GRAPH
          </span>
          <span className="text-slate-500">|</span>
          <span className="hidden sm:inline text-slate-400">
            Click node to examine forensic data
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            Investigated
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />
            Unexamined
          </span>
        </div>
      </div>

      {/* SVG Connecting Edges Layer */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <defs>
          {/* Arrowhead marker */}
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#ef4444" opacity="0.8" />
          </marker>

          <marker
            id="arrow-active"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="8"
            markerHeight="8"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 9 5 L 0 9 z" fill="#06b6d4" />
          </marker>
        </defs>

        {evidenceNodes.map((node) => {
          const fromPos = NODE_POSITIONS[node.id];
          if (!fromPos) return null;

          return node.connectedTo.map((targetId) => {
            const toPos = NODE_POSITIONS[targetId];
            if (!toPos) return null;

            const active = isEdgeActive(node.id, targetId);
            const traversed = isEdgeTraversed(node.id, targetId);

            // Compute control points for subtle curved bezier lines
            const dx = toPos.x - fromPos.x;
            const dy = toPos.y - fromPos.y;
            const cx = fromPos.x + dx * 0.5;
            const cy = fromPos.y + dy * 0.5;

            return (
              <g key={`${node.id}->${targetId}`}>
                {/* Glow layer when edge is active */}
                {(active || traversed) && (
                  <path
                    d={`M ${fromPos.x}% ${fromPos.y}% Q ${cx}% ${cy}% ${toPos.x}% ${toPos.y}%`}
                    fill="none"
                    stroke={active ? "#06b6d4" : "#f59e0b"}
                    strokeWidth={active ? "4" : "2"}
                    strokeOpacity={active ? "0.8" : "0.5"}
                    className="filter drop-shadow-[0_0_8px_#06b6d4]"
                  />
                )}

                {/* Main line */}
                <path
                  d={`M ${fromPos.x}% ${fromPos.y}% Q ${cx}% ${cy}% ${toPos.x}% ${toPos.y}%`}
                  fill="none"
                  stroke={
                    active
                      ? "#22d3ee"
                      : traversed
                      ? "#f59e0b"
                      : investigatedIds.has(node.id) && investigatedIds.has(targetId)
                      ? "#3b82f6"
                      : "rgba(255, 255, 255, 0.12)"
                  }
                  strokeWidth={active ? "3" : "1.75"}
                  strokeDasharray={active ? "6,3" : "none"}
                  className={active ? "animate-pulse" : ""}
                />
              </g>
            );
          });
        })}
      </svg>

      {/* Nodes Container */}
      <div className="relative z-10 w-full h-full">
        {evidenceNodes.map((ev) => {
          const pos = NODE_POSITIONS[ev.id] || { x: 50, y: 50 };
          const isInvestigated = investigatedIds.has(ev.id);
          const isSelected = selectedEvidenceId === ev.id;
          const isTraversing = isTraversalActive(ev.id);

          return (
            <div
              key={ev.id}
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: "translate(-50%, -50%)",
              }}
              className="absolute transition-all duration-300"
            >
              {/* Node Card */}
              <div
                onClick={() => {
                  playClick();
                  onSelectEvidence(ev);
                }}
                className={`w-[170px] sm:w-[195px] p-3 sm:p-3.5 rounded-xl border text-left cursor-pointer transition-all duration-300 select-none ${
                  isTraversing
                    ? "bg-cyan-950/90 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.6)] scale-105"
                    : isSelected
                    ? "bg-red-950/90 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)] scale-105"
                    : isInvestigated
                    ? "bg-slate-900/90 border-emerald-500/40 hover:border-emerald-400 hover:shadow-[0_0_15px_rgba(16,185,129,0.25)]"
                    : "bg-slate-950/90 border-white/[0.09] hover:border-white/30 opacity-90 hover:opacity-100"
                }`}
              >
                {/* Header: ID + Status Badge */}
                <div className="flex items-center justify-between gap-1 mb-2">
                  <div className="flex items-center gap-1.5 font-mono-code font-bold text-xs sm:text-sm">
                    {isInvestigated ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    )}
                    <span
                      className={
                        isTraversing
                          ? "text-cyan-300 font-bold"
                          : isInvestigated
                          ? "text-emerald-400"
                          : "text-slate-300"
                      }
                    >
                      {ev.id}
                    </span>
                  </div>

                  <span
                    className={`text-[9px] font-mono-code px-1.5 py-0.5 rounded tracking-wider uppercase font-semibold ${
                      isTraversing
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 animate-pulse"
                        : isInvestigated
                        ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/25"
                        : "bg-white/[0.05] text-slate-400 border border-white/[0.08]"
                    }`}
                  >
                    {isTraversing
                      ? "VISITING"
                      : isInvestigated
                      ? "INVESTIGATED"
                      : "NEW"}
                  </span>
                </div>

                {/* Evidence Title & Category */}
                <h4 className="font-display font-semibold text-xs sm:text-sm text-white line-clamp-1 leading-tight mb-1">
                  {ev.label}
                </h4>
                <p className="text-[10px] text-slate-400 line-clamp-1 font-mono-code">
                  {ev.category}
                </p>

                {/* Action Trigger in card */}
                <div className="mt-2.5 pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono-code">
                  {isInvestigated ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      <span>Details</span>
                    </span>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        playExamine();
                        onExamineEvidence(ev);
                      }}
                      className="px-2 py-0.5 rounded bg-red-600 hover:bg-red-500 text-white font-medium text-[10px] tracking-wider uppercase transition-colors shadow-sm"
                    >
                      EXAMINE
                    </button>
                  )}
                  <ChevronRight className="w-3 h-3 text-slate-500" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Graph Footer Legend */}
      <div className="relative z-10 pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono-code text-slate-400">
        <div className="flex items-center gap-3">
          <span>INVESTIGATED: <strong className="text-emerald-400">{investigatedIds.size}</strong>/{evidenceNodes.length}</span>
        </div>
        <div className="text-[10px] text-slate-500 hidden sm:block">
          Direct search links: C1 ➔ (C2, C3) ➔ (C4, C5) ➔ C6
        </div>
      </div>
    </div>
  );
}
