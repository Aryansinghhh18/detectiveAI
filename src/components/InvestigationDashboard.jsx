import React, { useState } from "react";
import { 
  Lock, 
  CheckCircle2, 
  RotateCcw, 
  ArrowRight, 
  ArrowLeft, 
  ListTree, 
  GitBranch, 
  FileText, 
  Bot 
} from "lucide-react";
import InterrogationModal from "./InterrogationModal";
import { computeBFSTrace, computeDFSTrace, runForwardChaining, getAiAnalysisReasoning, evaluateFinalAccusation } from "../utils/aiEngine";
import { playClick, playExamine, playScanStep, playVictory } from "../utils/audio";

export default function InvestigationDashboard({
  caseData,
  investigatedClues,
  interrogatedSuspects,
  answeredQuestionsMap,
  onExamineClue,
  onRecordInterrogation,
  onRestartCase,
  onChangeCase,
}) {
  // Modal states
  const [selectedSuspectForInterrogate, setSelectedSuspectForInterrogate] = useState(null);

  // Search states
  const [bfsRunning, setBfsRunning] = useState(false);
  const [bfsOrder, setBfsOrder] = useState([]);
  const [bfsStepIndex, setBfsStepIndex] = useState(0);

  const [dfsRunning, setDfsRunning] = useState(false);
  const [dfsOrder, setDfsOrder] = useState([]);
  const [dfsStepIndex, setDfsStepIndex] = useState(0);

  // Forward chaining results
  const [aiConclusions, setAiConclusions] = useState(null);

  // Final accusation state
  const [selectedAccusedSuspect, setSelectedAccusedSuspect] = useState(null);
  const [accusationResult, setAccusationResult] = useState(null);

  // Metrics
  const clueKeys = Object.keys(caseData.clues);
  const totalClues = clueKeys.length;
  const investigatedCount = investigatedClues.length;

  const suspectKeys = Object.keys(caseData.suspects);
  const totalSuspects = suspectKeys.length;
  const interrogatedCount = interrogatedSuspects.length;

  const progressPercent = Math.min(
    100,
    Math.round((investigatedCount / totalClues) * 60 + (interrogatedCount / totalSuspects) * 40)
  );

  // Run BFS
  const handleRunBFS = () => {
    playClick();
    const result = computeBFSTrace(caseData.clues, "C1");
    setBfsOrder(result.order);
    setBfsStepIndex(0);
    setBfsRunning(true);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step <= result.order.length) {
        setBfsStepIndex(step);
        playScanStep();
      } else {
        clearInterval(interval);
      }
    }, 600);
  };

  // Run DFS
  const handleRunDFS = () => {
    playClick();
    const result = computeDFSTrace(caseData.clues, "C1");
    setDfsOrder(result.order);
    setDfsStepIndex(0);
    setDfsRunning(true);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step <= result.order.length) {
        setDfsStepIndex(step);
        playScanStep();
      } else {
        clearInterval(interval);
      }
    }, 600);
  };

  // Run AI Reasoning (Forward Chaining)
  const handleAnalyzeCase = () => {
    playClick();
    const conclusions = runForwardChaining(caseData);
    setAiConclusions(conclusions);
    playVictory();
  };

  // Submit Accusation
  const handleSubmitAccusation = () => {
    if (!selectedAccusedSuspect) return;
    playClick();
    const suspectData = caseData.suspects[selectedAccusedSuspect];
    const result = evaluateFinalAccusation(selectedAccusedSuspect, suspectData);
    setAccusationResult(result);
  };

  // Current AI Analysis thoughts
  const aiReasoningStatements = getAiAnalysisReasoning(caseData.id, investigatedClues);

  // Restart Handler
  const handleRestart = () => {
    playClick();
    setBfsRunning(false);
    setBfsOrder([]);
    setDfsRunning(false);
    setDfsOrder([]);
    setAiConclusions(null);
    setSelectedAccusedSuspect(null);
    setAccusationResult(null);
    onRestartCase();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-left space-y-8">
      
      {/* Top Breadcrumb & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              playClick();
              onChangeCase();
            }}
            className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white transition-colors"
            title="Change Case"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono-code text-xs font-bold text-red-400 uppercase tracking-wider">
                {caseData.caseNumber}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
              <span className="text-[11px] font-mono-code text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                ACTIVE INVESTIGATION
              </span>
            </div>
            <h1 className="font-display font-extrabold text-xl sm:text-2xl text-white">
              {caseData.title}
            </h1>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleRestart}
            className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 font-mono-code text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>RESTART INVESTIGATION</span>
          </button>

          <button
            onClick={() => {
              playClick();
              onChangeCase();
            }}
            className="px-4 py-2 rounded-xl bg-red-950/60 hover:bg-red-900/60 border border-red-500/30 text-red-300 font-mono-code text-xs font-semibold transition-colors"
          >
            CHANGE CASE
          </button>
        </div>
      </div>

      {/* Main 2-Column Dashboard Layout: Left Case Info & Progress | Center/Right Investigation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ================= LEFT SIDE: CASE INFORMATION & PROGRESS (4 Cols) ================= */}
        <div className="lg:col-span-4 space-y-6">
          {/* Case File Dossier */}
          <div className="glass-panel rounded-2xl border border-white/[0.08] p-5 bg-[#0c111c] shadow-lg">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
              <span className="text-xs font-mono-code text-red-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-red-400" />
                CASE INFORMATION
              </span>
              <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-white/[0.05] text-slate-400 border border-white/[0.08]">
                DOSSIER
              </span>
            </div>

            <h3 className="font-display font-bold text-lg text-white mb-2">
              {caseData.title}
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed font-sans mb-4">
              {caseData.shortDescription}
            </p>

            <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.05] text-xs font-mono-code text-slate-400 whitespace-pre-line leading-relaxed mb-5">
              {caseData.story}
            </div>

            {/* 14. Investigation Progress Tracker */}
            <div className="pt-4 border-t border-white/[0.06] space-y-3 font-mono-code text-xs">
              <span className="text-slate-400 font-bold uppercase tracking-wider block text-[11px]">
                INVESTIGATION PROGRESS
              </span>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Evidence Investigated:</span>
                <span className="text-cyan-400 font-bold text-sm">
                  {investigatedCount} / {totalClues}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Suspects Interrogated:</span>
                <span className="text-amber-400 font-bold text-sm">
                  {interrogatedCount} / {totalSuspects}
                </span>
              </div>

              {/* Graphical Progress Bar */}
              <div className="pt-1">
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="text-slate-500">COMPLETION</span>
                  <span className="text-emerald-400 font-bold">{progressPercent}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-black/60 overflow-hidden border border-white/[0.08]">
                  <div
                    style={{ width: `${progressPercent}%` }}
                    className="h-full rounded-full bg-gradient-to-r from-red-600 via-amber-500 to-emerald-400 transition-all duration-500 shadow-[0_0_12px_rgba(239,68,68,0.5)]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Quick viva guide banner */}
          <div className="glass-panel rounded-2xl border border-cyan-500/20 p-4 bg-cyan-950/20 text-xs font-mono-code text-cyan-200">
            <span className="text-cyan-400 font-bold block mb-1">
              AI EXAMINER DEMO NOTE
            </span>
            <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
              All clue relationships and suspect interrogations directly execute the knowledge base and rule engine from the Python project.
            </p>
          </div>
        </div>

        {/* ================= CENTER & RIGHT: INVESTIGATION AREA (8 Cols) ================= */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* ================= 5. EVIDENCE BOARD ================= */}
          <div className="glass-panel rounded-2xl border border-white/[0.08] p-6 bg-[#0c111c] shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.06] pb-4 mb-5">
              <div>
                <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
                  <span>EVIDENCE BOARD</span>
                  <span className="text-[11px] font-mono-code px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    KNOWLEDGE GRAPH
                  </span>
                </h2>
                <p className="text-xs text-slate-400 font-mono-code mt-0.5">
                  Click a clue card to investigate evidence and reveal connection links
                </p>
              </div>
              <span className="text-xs font-mono-code text-slate-400">
                CLUES: <strong className="text-cyan-400">{investigatedCount}</strong> / {totalClues}
              </span>
            </div>

            {/* Clue Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {clueKeys.map((clueId) => {
                const clue = caseData.clues[clueId];
                const isInvestigated = investigatedClues.includes(clueId);

                return (
                  <div
                    key={clueId}
                    onClick={() => {
                      playExamine();
                      onExamineClue(clueId);
                    }}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all duration-300 select-none ${
                      isInvestigated
                        ? "bg-slate-900/90 border-emerald-500/40 hover:border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                        : "bg-slate-950/90 border-white/[0.08] hover:border-red-500/50 hover:bg-slate-900"
                    }`}
                  >
                    {/* Header: ID + State Badge */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5 font-mono-code font-bold text-sm">
                        {isInvestigated ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Lock className="w-4 h-4 text-slate-500" />
                        )}
                        <span className={isInvestigated ? "text-emerald-400" : "text-slate-300"}>
                          {clueId}
                        </span>
                      </div>

                      <span
                        className={`text-[9px] font-mono-code px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                          isInvestigated
                            ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/25"
                            : "bg-red-500/10 text-red-400 border border-red-500/20 animate-pulse"
                        }`}
                      >
                        {isInvestigated ? "INVESTIGATED" : "LOCKED / NEW"}
                      </span>
                    </div>

                    {/* Clue Text */}
                    <p className="text-xs sm:text-sm font-sans text-slate-200 leading-relaxed min-h-[38px]">
                      {isInvestigated ? (
                        clue.text
                      ) : (
                        <span className="italic text-slate-500">
                          Click to examine this evidence clue...
                        </span>
                      )}
                    </p>

                    {/* 6. Evidence Connections: Links from Python */}
                    <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono-code">
                      {isInvestigated ? (
                        clue.links.length > 0 ? (
                          <div className="flex items-center gap-1.5 text-cyan-400">
                            <span className="text-slate-500 text-[11px]">Leads to:</span>
                            {clue.links.map((target) => (
                              <span
                                key={target}
                                className="px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 text-[10px] font-bold"
                              >
                                {clueId} ➔ {target}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-500 text-[11px] italic">
                            No directly connected evidence found.
                          </span>
                        )
                      ) : (
                        <span className="text-red-400 text-[11px] font-bold">
                          [ EXAMINE EVIDENCE ]
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Evidence Connections Graph Diagram */}
            <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06]">
              <span className="text-[10px] font-mono-code text-slate-400 uppercase tracking-widest block mb-2 font-bold">
                VISUAL EVIDENCE CONNECTION MAP
              </span>
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono-code">
                {clueKeys.map((cid) => {
                  const links = caseData.clues[cid].links;
                  if (links.length === 0) return null;
                  return (
                    <div
                      key={cid}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.05]"
                    >
                      <span className="text-white font-bold">{cid}</span>
                      <span className="text-red-400">➔</span>
                      <span className="text-cyan-300 font-bold">{links.join(", ")}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ================= 9 & 10. BFS & DFS SEARCH SECTIONS ================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* 9. BFS Evidence Search */}
            <div className="glass-panel rounded-2xl border border-cyan-500/30 p-5 bg-[#0a101b] shadow-lg">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
                <div className="flex items-center gap-2 text-cyan-400 font-display font-bold text-base">
                  <ListTree className="w-5 h-5" />
                  <span>BFS EVIDENCE SEARCH</span>
                </div>
                <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  FIFO QUEUE
                </span>
              </div>

              <p className="text-xs text-slate-400 font-mono-code mb-4 leading-relaxed">
                Level-by-level state exploration starting from root clue C1 using a FIFO queue.
              </p>

              <button
                onClick={handleRunBFS}
                className="w-full py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-black font-mono-code text-xs font-bold tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] mb-4"
              >
                RUN BFS SEARCH
              </button>

              {bfsRunning && (
                <div className="p-3.5 rounded-xl bg-black/60 border border-cyan-500/30 space-y-2 text-xs font-mono-code text-cyan-200 animate-fade-in">
                  <span className="text-cyan-400 font-bold block text-[11px] animate-pulse">
                    AI is exploring evidence level-by-level...
                  </span>

                  <div className="space-y-1.5 pt-1">
                    {bfsOrder.slice(0, bfsStepIndex).map((clueId, idx) => (
                      <div key={clueId} className="flex items-center gap-2 text-slate-200">
                        <span className="text-cyan-400 font-bold">{idx + 1}.</span>
                        <strong className="text-cyan-300 font-bold">{clueId}</strong>
                        <span className="text-slate-400">➔</span>
                        <span className="text-xs truncate">{caseData.clues[clueId].text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 10. DFS Evidence Search */}
            <div className="glass-panel rounded-2xl border border-amber-500/30 p-5 bg-[#0a101b] shadow-lg">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
                <div className="flex items-center gap-2 text-amber-400 font-display font-bold text-base">
                  <GitBranch className="w-5 h-5" />
                  <span>DFS EVIDENCE SEARCH</span>
                </div>
                <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  LIFO STACK
                </span>
              </div>

              <p className="text-xs text-slate-400 font-mono-code mb-4 leading-relaxed">
                Deep branch-by-branch path pursuit starting from root clue C1 using a LIFO stack.
              </p>

              <button
                onClick={handleRunDFS}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-black font-mono-code text-xs font-bold tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] mb-4"
              >
                RUN DFS SEARCH
              </button>

              {dfsRunning && (
                <div className="p-3.5 rounded-xl bg-black/60 border border-amber-500/30 space-y-2 text-xs font-mono-code text-amber-200 animate-fade-in">
                  <span className="text-amber-400 font-bold block text-[11px] animate-pulse">
                    AI is following evidence paths deeply...
                  </span>

                  <div className="space-y-1.5 pt-1">
                    {dfsOrder.slice(0, dfsStepIndex).map((clueId, idx) => (
                      <div key={clueId} className="flex items-center gap-2 text-slate-200">
                        <span className="text-amber-400 font-bold">{idx + 1}.</span>
                        <strong className="text-amber-300 font-bold">{clueId}</strong>
                        <span className="text-slate-400">➔</span>
                        <span className="text-xs truncate">{caseData.clues[clueId].text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ================= 11. AI REASONING ENGINE (FORWARD CHAINING) ================= */}
          <div className="glass-panel rounded-2xl border border-red-500/30 p-6 bg-[#0c111c] shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4 mb-5">
              <div>
                <h3 className="font-display font-bold text-xl text-white flex items-center gap-2">
                  <span>🤖 AI REASONING ENGINE</span>
                  <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">
                    FORWARD CHAINING
                  </span>
                </h3>
                <p className="text-xs text-slate-400 font-mono-code mt-0.5">
                  Applies production rules (Rule 1: Alibi, Rule 2: Access, Rule 3: Motive, Rule 4: Location)
                </p>
              </div>

              <button
                onClick={handleAnalyzeCase}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono-code text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(239,68,68,0.35)] transition-all"
              >
                ANALYZE CASE
              </button>
            </div>

            {aiConclusions ? (
              <div className="space-y-3 animate-fade-in">
                <span className="text-xs font-mono-code text-slate-400 uppercase tracking-wider block font-semibold">
                  AI-derived facts:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {aiConclusions.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-black/50 border border-white/[0.06] text-xs font-mono-code flex items-start gap-2"
                    >
                      <span className="text-red-400 font-bold shrink-0">→</span>
                      <span className="text-slate-200">{item.text}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-400 font-mono-code italic pt-2">
                  The AI combines these facts with the investigated evidence.
                </p>
              </div>
            ) : (
              <div className="p-6 rounded-xl border border-dashed border-white/10 text-center text-xs font-mono-code text-slate-500">
                Click &ldquo;ANALYZE CASE&rdquo; to execute forward-chaining rules across all suspects.
              </div>
            )}
          </div>

          {/* ================= 12. CURRENT AI ANALYSIS ================= */}
          <div className="glass-panel rounded-2xl border border-white/[0.08] p-6 bg-[#0c111c] shadow-lg">
            <h3 className="font-display font-bold text-xl text-white mb-4 border-b border-white/[0.06] pb-3">
              CURRENT AI ANALYSIS
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5 text-xs font-mono-code">
              {/* Investigated Evidence List */}
              <div className="p-4 rounded-xl bg-black/40 border border-white/[0.05]">
                <span className="text-slate-400 uppercase tracking-wider block mb-2 font-bold">
                  Investigated Evidence:
                </span>
                {investigatedClues.length > 0 ? (
                  <div className="space-y-1.5">
                    {investigatedClues.map((cid) => (
                      <div key={cid} className="flex items-start gap-1.5 text-emerald-400">
                        <span>✓</span>
                        <strong className="text-emerald-300">{cid}</strong>
                        <span className="text-slate-300">➔ {caseData.clues[cid]?.text}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-slate-500 italic">No evidence has been investigated yet.</span>
                )}
              </div>

              {/* Interrogated Suspects List */}
              <div className="p-4 rounded-xl bg-black/40 border border-white/[0.05]">
                <span className="text-slate-400 uppercase tracking-wider block mb-2 font-bold">
                  Interrogated Suspects:
                </span>
                {interrogatedSuspects.length > 0 ? (
                  <div className="space-y-1.5">
                    {interrogatedSuspects.map((name) => (
                      <div key={name} className="flex items-center gap-1.5 text-amber-400">
                        <span>✓</span>
                        <strong className="text-slate-200">{name}</strong>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-slate-500 italic">No suspects interrogated yet.</span>
                )}
              </div>
            </div>

            {/* AI Reasoning Statements */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/20 text-xs font-mono-code space-y-2 mb-4">
              <span className="text-cyan-400 uppercase tracking-wider block font-bold">
                AI Reasoning:
              </span>
              <div className="space-y-1.5 text-slate-200">
                {aiReasoningStatements.map((stmt, idx) => (
                  <p key={idx} className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold shrink-0">→</span>
                    <span>{stmt}</span>
                  </p>
                ))}
              </div>
            </div>

            {/* AI Status */}
            <div className="text-xs font-mono-code text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>AI status: <strong>Investigation is still in progress.</strong></span>
            </div>
          </div>

          {/* ================= 7. SUSPECTS SECTION ================= */}
          <div className="glass-panel rounded-2xl border border-white/[0.08] p-6 bg-[#0c111c] shadow-lg">
            <div className="border-b border-white/[0.06] pb-3 mb-5">
              <h3 className="font-display font-bold text-xl text-white">
                SUSPECTS
              </h3>
              <p className="text-xs text-slate-400 font-mono-code mt-0.5">
                Examine alibis and interrogate each suspect to unlock sensitive information
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {suspectKeys.map((name) => {
                const data = caseData.suspects[name];
                const isInterrogated = interrogatedSuspects.includes(name);

                // Access and motive are revealed through interrogation or clues
                const showAccess = isInterrogated || investigatedClues.includes("C6");
                const showMotive = isInterrogated || investigatedClues.includes("C4");

                return (
                  <div
                    key={name}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      isInterrogated
                        ? "bg-slate-900/90 border-amber-500/40 shadow-sm"
                        : "bg-slate-950/90 border-white/[0.07]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-lg bg-black/50 border border-white/10 flex items-center justify-center text-lg">
                          👤
                        </div>
                        <div>
                          <h4 className="font-display font-bold text-base text-white">
                            {name}
                          </h4>
                          <span className="text-[11px] font-mono-code text-slate-400">
                            Location: <strong className="text-slate-200">{data.location}</strong>
                          </span>
                        </div>
                      </div>

                      <span
                        className={`text-[9px] font-mono-code px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                          isInterrogated
                            ? "bg-amber-500/15 text-amber-300 border border-amber-500/25"
                            : "bg-white/[0.05] text-slate-400 border border-white/[0.08]"
                        }`}
                      >
                        {isInterrogated ? "INTERROGATED" : "NOT QUESTIONED"}
                      </span>
                    </div>

                    {/* Alibi */}
                    <div className="p-2.5 rounded-lg bg-black/30 border border-white/[0.04] text-xs font-mono-code text-slate-300 mb-3">
                      <span className="text-slate-500 block text-[10px] uppercase">Alibi</span>
                      <span>{data.alibi}</span>
                    </div>

                    {/* Access & Motive: Hidden until interrogated */}
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono-code mb-4">
                      <div className="p-2 rounded bg-white/[0.02] border border-white/[0.04]">
                        <span className="text-slate-500 block text-[10px] uppercase">Access</span>
                        <span className={showAccess ? (data.access ? "text-red-400 font-bold" : "text-emerald-400") : "text-slate-500 italic"}>
                          {showAccess ? (data.access ? "YES (HAS ACCESS)" : "NO ACCESS") : "🔒 [HIDDEN]"}
                        </span>
                      </div>
                      <div className="p-2 rounded bg-white/[0.02] border border-white/[0.04]">
                        <span className="text-slate-500 block text-[10px] uppercase">Motive</span>
                        <span className={showMotive ? (data.motive ? "text-amber-400 font-bold" : "text-slate-400") : "text-slate-500 italic"}>
                          {showMotive ? (data.motive ? "POSSIBLE MOTIVE" : "NONE") : "🔒 [HIDDEN]"}
                        </span>
                      </div>
                    </div>

                    {/* Interrogate button */}
                    <button
                      onClick={() => {
                        playClick();
                        setSelectedSuspectForInterrogate({ name, data });
                      }}
                      className="w-full py-2 px-3 rounded-lg bg-amber-600 hover:bg-amber-500 text-black font-mono-code text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                    >
                      <span>INTERROGATE</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ================= 13. FINAL ACCUSATION SECTION ================= */}
          <div className="glass-panel rounded-2xl border border-red-500/40 p-6 bg-[#0c111c] shadow-xl">
            <div className="border-b border-white/[0.06] pb-3 mb-5">
              <span className="text-xs font-mono-code text-red-400 uppercase tracking-widest font-semibold block mb-1">
                EVALUATE INVESTIGATION HYPOTHESIS
              </span>
              <h3 className="font-display font-bold text-2xl text-white">
                FINAL ACCUSATION
              </h3>
              <p className="text-xs text-slate-300 font-mono-code mt-1">
                Who do you believe is responsible? Select a suspect to submit your accusation.
              </p>
            </div>

            {/* Suspect Radio Selector Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {suspectKeys.map((name) => {
                const isSelected = selectedAccusedSuspect === name;

                return (
                  <button
                    key={name}
                    onClick={() => {
                      playClick();
                      setSelectedAccusedSuspect(name);
                      setAccusationResult(null);
                    }}
                    className={`p-3 rounded-xl border text-center font-mono-code text-xs font-bold transition-all ${
                      isSelected
                        ? "bg-red-600 text-white border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                        : "bg-black/40 border-white/[0.08] text-slate-300 hover:border-slate-500"
                    }`}
                  >
                    <span className="text-lg block mb-1">👤</span>
                    <span>{name}</span>
                  </button>
                );
              })}
            </div>

            {/* Submit Accusation Button */}
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={handleSubmitAccusation}
                disabled={!selectedAccusedSuspect}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:opacity-40 text-white font-mono-code text-xs sm:text-sm font-bold tracking-wider uppercase shadow-[0_0_20px_rgba(239,68,68,0.35)] transition-all"
              >
                SUBMIT ACCUSATION
              </button>
              {selectedAccusedSuspect && (
                <span className="text-xs font-mono-code text-slate-400">
                  Selected hypothesis: <strong className="text-white">{selectedAccusedSuspect}</strong>
                </span>
              )}
            </div>

            {/* Accusation Review Panel from Python logic */}
            {accusationResult && (
              <div
                className={`p-5 rounded-xl border space-y-3 animate-fade-in ${
                  accusationResult.type === "CONNECTED"
                    ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-200"
                    : accusationResult.type === "ALIBI"
                    ? "bg-amber-950/40 border-amber-500/40 text-amber-200"
                    : "bg-slate-900 border-white/10 text-slate-300"
                }`}
              >
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-2 text-xs font-mono-code">
                  <span className="font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Bot className="w-4 h-4" />
                    AI REVIEW
                  </span>
                  <span className="px-2 py-0.5 rounded bg-black/40 font-bold">
                    {accusationResult.badge}
                  </span>
                </div>

                <p className="text-sm font-sans font-semibold text-white leading-relaxed">
                  {accusationResult.headline}
                </p>

                <p className="text-xs font-mono-code italic text-slate-300">
                  {accusationResult.caveat}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Interrogation Modal */}
      {selectedSuspectForInterrogate && (
        <InterrogationModal
          suspectName={selectedSuspectForInterrogate.name}
          suspectData={selectedSuspectForInterrogate.data}
          onClose={() => setSelectedSuspectForInterrogate(null)}
          onRecordInterrogation={onRecordInterrogation}
          answeredQuestionsSet={answeredQuestionsMap[selectedSuspectForInterrogate.name]}
        />
      )}
    </div>
  );
}
