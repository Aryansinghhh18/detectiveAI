import React, { useState, useEffect, useRef, useCallback } from "react";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  ListTree, 
  Cpu, 
  ChevronRight,
  Info
} from "lucide-react";
import { computeBFSTrace, computeDFSTrace } from "../utils/aiEngine";
import { playScanStep, playClick } from "../utils/audio";

export default function BfsDfsVisualizer({
  evidenceNodes,
  onTraversalUpdate, // callback sending { activeNode, visitedOrder, activeEdge, edgesTraversed }
  onAutoExamineNode, // optional: auto-examine nodes as they get traversed
}) {
  const [algorithm, setAlgorithm] = useState("BFS"); // "BFS" | "DFS"
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000); // ms per step
  const [showAcademicInfo, setShowAcademicInfo] = useState(false);

  // Compute trace memoized or directly
  const trace = React.useMemo(() => {
    return algorithm === "BFS"
      ? computeBFSTrace(evidenceNodes, "C1")
      : computeDFSTrace(evidenceNodes, "C1");
  }, [algorithm, evidenceNodes]);

  // Timer ref
  const timerRef = useRef(null);

  // Synchronize step with graph update
  const syncStepWithGraph = useCallback((stepIdx, currentTrace) => {
    const frame = currentTrace[stepIdx];
    if (!frame) return;

    onTraversalUpdate({
      activeNode: frame.currentNode,
      visitedOrder: frame.visitedOrder || [],
      activeEdge: frame.activeEdge || null,
      edgesTraversed: frame.edgesTraversed || [],
    });

    if (frame.currentNode) {
      playScanStep();
      if (onAutoExamineNode) {
        onAutoExamineNode(frame.currentNode);
      }
    }
  }, [onTraversalUpdate, onAutoExamineNode]);

  // Reset when algorithm changes
  const handleSelectAlgorithm = (newAlg) => {
    playClick();
    setAlgorithm(newAlg);
    setCurrentStepIndex(0);
    setIsPlaying(false);
    clearTimeout(timerRef.current);
    onTraversalUpdate({
      activeNode: null,
      visitedOrder: [],
      activeEdge: null,
      edgesTraversed: [],
    });
  };

  // Step Forward
  const handleStepForward = () => {
    playClick();
    if (currentStepIndex < trace.length - 1) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      syncStepWithGraph(nextIdx, trace);
    } else {
      setIsPlaying(false);
    }
  };

  // Reset
  const handleReset = () => {
    playClick();
    setIsPlaying(false);
    clearTimeout(timerRef.current);
    setCurrentStepIndex(0);
    onTraversalUpdate({
      activeNode: null,
      visitedOrder: [],
      activeEdge: null,
      edgesTraversed: [],
    });
  };

  // Auto-play loop
  useEffect(() => {
    if (isPlaying) {
      if (currentStepIndex < trace.length - 1) {
        timerRef.current = setTimeout(() => {
          const nextIdx = currentStepIndex + 1;
          setCurrentStepIndex(nextIdx);
          syncStepWithGraph(nextIdx, trace);
        }, speed);
      } else {
        const t = setTimeout(() => setIsPlaying(false), 0);
        return () => clearTimeout(t);
      }
    }
    return () => clearTimeout(timerRef.current);
  }, [isPlaying, currentStepIndex, trace, speed, syncStepWithGraph]);

  const currentFrame = trace[currentStepIndex] || {};

  return (
    <div className="w-full glass-panel rounded-2xl border border-white/[0.08] p-4 sm:p-5 text-left bg-slate-900/60 shadow-xl">
      {/* Visualizer Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <ListTree className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm sm:text-base text-white flex items-center gap-2">
              <span>Graph Search Visualizer</span>
              <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                AI SEARCH
              </span>
            </h3>
            <p className="text-[11px] text-slate-400 font-mono-code">
              {algorithm === "BFS"
                ? "BFS: Level-by-level search (Queue / FIFO)"
                : "DFS: Depth-first search (Stack / LIFO)"}
            </p>
          </div>
        </div>

        {/* Algorithm Mode Selector */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/40 border border-white/[0.08]">
          <button
            onClick={() => handleSelectAlgorithm("BFS")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono-code font-bold transition-all ${
              algorithm === "BFS"
                ? "bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            RUN BFS
          </button>
          <button
            onClick={() => handleSelectAlgorithm("DFS")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono-code font-bold transition-all ${
              algorithm === "DFS"
                ? "bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.4)]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            RUN DFS
          </button>
          <button
            onClick={() => {
              playClick();
              setShowAcademicInfo(!showAcademicInfo);
            }}
            title="Algorithm Viva Theory"
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors ml-1"
          >
            <Info className="w-4 h-4 text-cyan-400" />
          </button>
        </div>
      </div>

      {/* Control Actions & Speed */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 bg-white/[0.02] p-2.5 rounded-xl border border-white/[0.04]">
        <div className="flex items-center gap-2">
          {/* Play / Pause */}
          <button
            onClick={() => {
              playClick();
              if (currentStepIndex >= trace.length - 1) {
                setCurrentStepIndex(0);
              }
              setIsPlaying(!isPlaying);
            }}
            className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-mono-code text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" /> PAUSE
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />{" "}
                {currentStepIndex >= trace.length - 1 ? "REPLAY" : "AUTO PLAY"}
              </>
            )}
          </button>

          {/* Step forward */}
          <button
            onClick={handleStepForward}
            disabled={isPlaying || currentStepIndex >= trace.length - 1}
            className="px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] disabled:opacity-40 text-slate-200 font-mono-code text-xs font-medium flex items-center gap-1 transition-colors"
          >
            <SkipForward className="w-3.5 h-3.5" /> STEP NEXT
          </button>

          {/* Reset */}
          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] transition-colors"
            title="Reset Visualizer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Speed and step status */}
        <div className="flex items-center gap-3 text-xs font-mono-code text-slate-400">
          <div className="flex items-center gap-1.5">
            <span>Speed:</span>
            <select
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="bg-black/60 border border-white/10 rounded px-2 py-1 text-slate-200 text-xs focus:outline-none"
            >
              <option value={1500}>0.75x Slow</option>
              <option value={1000}>1x Normal</option>
              <option value={500}>2x Fast</option>
            </select>
          </div>
          <div>
            STEP: <span className="text-white font-bold">{currentStepIndex}</span> /{" "}
            {Math.max(0, trace.length - 1)}
          </div>
        </div>
      </div>

      {/* Active Data Structure Queue / Stack Monitor */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        {/* Queue or Stack Container */}
        <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06]">
          <span className="text-[10px] font-mono-code text-slate-400 uppercase tracking-widest block mb-1.5">
            {algorithm === "BFS" ? "FIFO Queue State" : "LIFO Stack State"}
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto min-h-[30px] py-0.5">
            {(algorithm === "BFS" ? currentFrame.queue : currentFrame.stack)?.length > 0 ? (
              (algorithm === "BFS" ? currentFrame.queue : currentFrame.stack).map(
                (nodeId, idx) => (
                  <span
                    key={`${nodeId}-${idx}`}
                    className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono-code text-xs font-bold shrink-0 animate-fade-in"
                  >
                    {nodeId}
                  </span>
                )
              )
            ) : (
              <span className="text-xs text-slate-600 font-mono-code italic">
                (Empty {algorithm === "BFS" ? "Queue" : "Stack"})
              </span>
            )}
          </div>
        </div>

        {/* Current Visiting Node */}
        <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06]">
          <span className="text-[10px] font-mono-code text-slate-400 uppercase tracking-widest block mb-1.5">
            Current Node
          </span>
          <div className="flex items-center gap-2">
            {currentFrame.currentNode ? (
              <span className="px-2.5 py-0.5 rounded bg-red-950/80 border border-red-500/50 text-red-300 font-mono-code text-xs font-bold animate-pulse">
                {currentFrame.currentNode}
              </span>
            ) : (
              <span className="text-xs text-slate-600 font-mono-code italic">None</span>
            )}
            {currentFrame.activeEdge && (
              <span className="text-xs font-mono-code text-amber-400">
                Lead: {currentFrame.activeEdge.from} ➔ {currentFrame.activeEdge.to}
              </span>
            )}
          </div>
        </div>

        {/* Visited Sequence */}
        <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06]">
          <span className="text-[10px] font-mono-code text-slate-400 uppercase tracking-widest block mb-1.5">
            Visited Sequence ({currentFrame.visitedOrder?.length || 0})
          </span>
          <div className="flex items-center gap-1 overflow-x-auto min-h-[30px] text-xs font-mono-code text-emerald-400 font-semibold">
            {currentFrame.visitedOrder?.length > 0 ? (
              currentFrame.visitedOrder.map((id, i) => (
                <React.Fragment key={id}>
                  <span>{id}</span>
                  {i < currentFrame.visitedOrder.length - 1 && (
                    <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
                  )}
                </React.Fragment>
              ))
            ) : (
              <span className="text-slate-600 italic font-normal">None</span>
            )}
          </div>
        </div>
      </div>

      {/* Traversal Step Explanation Callout */}
      <div className="p-3 rounded-xl bg-slate-950 border border-cyan-500/20 text-xs font-mono-code text-slate-300 flex items-start gap-2.5">
        <Cpu className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          {currentFrame.explanation || "Select Run BFS or Run DFS to commence animated evidence graph traversal."}
        </p>
      </div>

      {/* Academic Viva Sheet (Collapsible) */}
      {showAcademicInfo && (
        <div className="mt-4 p-4 rounded-xl bg-black/70 border border-cyan-500/30 text-xs space-y-2 text-slate-300 animate-fade-in">
          <div className="font-display font-bold text-cyan-400 text-sm flex items-center justify-between">
            <span>Academic Viva Reference: Graph Search Algorithms</span>
            <span className="text-[10px] font-mono-code text-slate-400">AI DETECTIVE THEORY</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-2.5 rounded bg-white/[0.03] border border-white/[0.05]">
              <strong className="text-cyan-300 block mb-1">Breadth-First Search (BFS)</strong>
              <ul className="list-disc pl-4 space-y-1 text-slate-400 text-[11px]">
                <li>Data Structure: <strong>FIFO Queue</strong></li>
                <li>Strategy: Visits all nodes at distance $d$ before moving to $d+1$.</li>
                <li>Optimal: Guaranteed to find shortest path in unweighted graphs.</li>
                <li>Complexity: Time $O(V + E)$, Space $O(V)$</li>
              </ul>
            </div>
            <div className="p-2.5 rounded bg-white/[0.03] border border-white/[0.05]">
              <strong className="text-amber-300 block mb-1">Depth-First Search (DFS)</strong>
              <ul className="list-disc pl-4 space-y-1 text-slate-400 text-[11px]">
                <li>Data Structure: <strong>LIFO Stack</strong></li>
                <li>Strategy: Traverses deep along one clue chain until dead end.</li>
                <li>Application: Deep chain-of-custody tracking & cycle detection.</li>
                <li>Complexity: Time $O(V + E)$, Space $O(h)$ where $h$ is max depth.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
