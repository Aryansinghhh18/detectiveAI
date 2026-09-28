import React from "react";
import { 
  X, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  Layers, 
  ArrowRight, 
  FileCheck, 
  ShieldAlert 
} from "lucide-react";
import { playClick, playExamine } from "../utils/audio";

export default function EvidenceDetailModal({
  evidence,
  allEvidence,
  isInvestigated,
  onClose,
  onExamine,
  onSelectEvidenceById,
}) {
  if (!evidence) return null;

  // Find which other nodes connect TO this node
  const connectedFrom = allEvidence.filter((e) =>
    e.connectedTo.includes(evidence.id)
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-all duration-300">
      {/* Click outside to close */}
      <div className="flex-1" onClick={onClose} />

      {/* Slide-in Panel from Right */}
      <div className="relative w-full max-w-lg h-full glass-panel-glow border-l border-white/10 bg-[#0d1322] shadow-2xl p-6 sm:p-8 flex flex-col justify-between overflow-y-auto animate-slide-left">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-6">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              <h3 className="font-mono-code font-bold text-lg text-white tracking-wider">
                EVIDENCE {evidence.id}
              </h3>
            </div>
            <button
              onClick={() => {
                playClick();
                onClose();
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors focus:outline-none"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Classification & Title */}
          <div className="mb-6">
            <span className="text-[11px] font-mono-code px-2.5 py-1 rounded bg-red-500/15 border border-red-500/30 text-red-400 uppercase tracking-widest font-semibold inline-block mb-2">
              {evidence.category}
            </span>
            <h2 className="font-display font-bold text-xl sm:text-2xl text-white mb-2">
              {evidence.label}
            </h2>
            <p className="text-xs font-mono-code text-slate-400">
              {evidence.shortDesc}
            </p>
          </div>

          {/* Metadata Grid (Timestamp & Location) */}
          <div className="grid grid-cols-2 gap-3 mb-6 p-3.5 rounded-xl bg-black/40 border border-white/[0.06] text-xs font-mono-code">
            <div className="flex items-center gap-2 text-slate-300">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-500 block">TIMESTAMP</span>
                <span>{evidence.timestamp}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <MapPin className="w-4 h-4 text-red-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-500 block">LOCATION</span>
                <span className="truncate">{evidence.location}</span>
              </div>
            </div>
          </div>

          {/* Full Forensic Description */}
          <div className="mb-6">
            <h4 className="text-xs font-mono-code text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5 text-cyan-400" />
              Forensic Report Findings
            </h4>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-sm text-slate-200 leading-relaxed font-sans">
              {evidence.fullDesc}
            </div>
          </div>

          {/* Clue Significance */}
          <div className="mb-6">
            <h4 className="text-xs font-mono-code text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              Investigative Significance
            </h4>
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-200 leading-relaxed font-mono-code">
              {evidence.significance}
            </div>
          </div>

          {/* Connected Evidence Graph Links */}
          <div className="mb-6">
            <h4 className="text-xs font-mono-code text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              Connected Evidence Trail
            </h4>
            
            <div className="space-y-2">
              {/* Coming from */}
              {connectedFrom.length > 0 && (
                <div className="text-xs font-mono-code text-slate-400 flex items-center gap-2 flex-wrap">
                  <span className="text-slate-500">Lead into {evidence.id}:</span>
                  {connectedFrom.map((src) => (
                    <button
                      key={src.id}
                      onClick={() => {
                        playClick();
                        onSelectEvidenceById(src.id);
                      }}
                      className="px-2 py-0.5 rounded bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-cyan-300 font-bold transition-colors"
                    >
                      {src.id} ➔ {evidence.id}
                    </button>
                  ))}
                </div>
              )}

              {/* Leading to */}
              {evidence.connectedTo.length > 0 ? (
                <div className="text-xs font-mono-code text-slate-400 flex items-center gap-2 flex-wrap">
                  <span className="text-slate-500">Leads next to:</span>
                  {evidence.connectedTo.map((targetId) => (
                    <button
                      key={targetId}
                      onClick={() => {
                        playClick();
                        onSelectEvidenceById(targetId);
                      }}
                      className="px-2 py-0.5 rounded bg-red-950/60 hover:bg-red-900/60 border border-red-500/30 text-red-300 font-bold transition-colors flex items-center gap-1"
                    >
                      <span>{evidence.id} ➔ {targetId}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-xs font-mono-code text-emerald-400/80 italic">
                  ✓ Terminal node: Reached conclusion of this forensic branch.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Status & Action */}
        <div className="pt-6 border-t border-white/[0.08]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono-code text-slate-500 block uppercase">
                STATUS
              </span>
              {isInvestigated ? (
                <span className="text-xs font-mono-code text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  INVESTIGATED
                </span>
              ) : (
                <span className="text-xs font-mono-code text-amber-400 font-bold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  PENDING REVIEW
                </span>
              )}
            </div>

            {!isInvestigated ? (
              <button
                onClick={() => {
                  playExamine();
                  onExamine(evidence);
                }}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono-code text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all"
              >
                EXAMINE & LOG CLUE
              </button>
            ) : (
              <button
                onClick={() => {
                  playClick();
                  onClose();
                }}
                className="px-5 py-2.5 rounded-xl bg-white/[0.07] hover:bg-white/[0.12] text-slate-200 font-mono-code text-xs font-medium transition-colors"
              >
                CLOSE PANEL
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
