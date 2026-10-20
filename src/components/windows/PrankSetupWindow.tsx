import React, { useState } from 'react';
import { CurseId } from '../../types';
import { sound } from '../../utils/soundEngine';
import {
  Timer,
  Link,
  Maximize2,
  Copy,
  Check,
  Eye,
  ShieldAlert,
  Play,
  FileSpreadsheet,
  Cpu,
} from 'lucide-react';

interface PrankSetupWindowProps {
  activeCurses: Set<CurseId>;
  onArmPrank: (config: {
    delaySeconds: number;
    disguise: 'spreadsheet' | 'update' | 'none';
    triggerOnClick: boolean;
  }) => void;
}

export const PrankSetupWindow: React.FC<PrankSetupWindowProps> = ({
  activeCurses,
  onArmPrank,
}) => {
  const [delaySeconds, setDelaySeconds] = useState(10);
  const [disguise, setDisguise] = useState<'spreadsheet' | 'update' | 'none'>('update');
  const [triggerOnClick, setTriggerOnClick] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyPrankLink = () => {
    const curseArray = Array.from(activeCurses);
    const params = new URLSearchParams({
      prank: '1',
      delay: delaySeconds.toString(),
      disguise,
      curses: curseArray.join(','),
    });
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    sound.playCandyChime();
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const toggleFullscreen = () => {
    sound.playGlitch();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div className="p-4 sm:p-5 flex flex-col gap-4 text-zinc-100 max-w-4xl mx-auto">
      {/* Banner */}
      <div className="p-4 bg-gradient-to-r from-red-950/60 via-zinc-900 to-amber-950/40 border border-orange-500/30 rounded-xl">
        <div className="flex items-center gap-2">
          <span className="text-xl">🎯</span>
          <h3 className="font-bold text-sm text-orange-400">
            Stealth Prank Deployment Station
          </h3>
        </div>
        <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
          Arm a delayed trap for your friend or colleague. Switch to a disguised decoy screen,
          walk away, and watch the chaos unfold when they touch the keyboard or mouse!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Step 1: Disguise Screen */}
        <div className="bg-zinc-900/90 p-4 rounded-xl border border-zinc-800 flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-xs text-orange-400 uppercase tracking-wide flex items-center gap-1.5 mb-2">
              <Eye className="w-3.5 h-3.5" /> 1. Choose Decoy Disguise
            </h4>
            <p className="text-[11px] text-zinc-400 mb-3">
              What should appear on screen while waiting for the victim to arrive?
            </p>

            <div className="flex flex-col gap-2">
              <label
                onClick={() => setDisguise('update')}
                className={`p-3 rounded-lg border cursor-pointer flex items-center justify-between transition-all ${
                  disguise === 'update'
                    ? 'bg-orange-950/40 border-orange-500 text-orange-200'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Cpu className="w-4 h-4 text-blue-400" />
                  <div>
                    <div className="text-xs font-bold">Fake Windows Update (47%)</div>
                    <div className="text-[10px] text-zinc-500 font-mono">
                      "Installing updates... Please do not power off"
                    </div>
                  </div>
                </div>
                <div
                  className={`w-3.5 h-3.5 rounded-full border ${
                    disguise === 'update' ? 'bg-orange-500 border-orange-400' : 'border-zinc-600'
                  }`}
                />
              </label>

              <label
                onClick={() => setDisguise('spreadsheet')}
                className={`p-3 rounded-lg border cursor-pointer flex items-center justify-between transition-all ${
                  disguise === 'spreadsheet'
                    ? 'bg-orange-950/40 border-orange-500 text-orange-200'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  <div>
                    <div className="text-xs font-bold">Annual Tax & Finance Spreadsheet</div>
                    <div className="text-[10px] text-zinc-500 font-mono">
                      Boring corporate Excel grid with financial numbers
                    </div>
                  </div>
                </div>
                <div
                  className={`w-3.5 h-3.5 rounded-full border ${
                    disguise === 'spreadsheet'
                      ? 'bg-orange-500 border-orange-400'
                      : 'border-zinc-600'
                  }`}
                />
              </label>

              <label
                onClick={() => setDisguise('none')}
                className={`p-3 rounded-lg border cursor-pointer flex items-center justify-between transition-all ${
                  disguise === 'none'
                    ? 'bg-orange-950/40 border-orange-500 text-orange-200'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-sm">🖥️</span>
                  <div>
                    <div className="text-xs font-bold">No Disguise (Normal Boo-OS)</div>
                    <div className="text-[10px] text-zinc-500 font-mono">
                      Keep the current desktop visible
                    </div>
                  </div>
                </div>
                <div
                  className={`w-3.5 h-3.5 rounded-full border ${
                    disguise === 'none' ? 'bg-orange-500 border-orange-400' : 'border-zinc-600'
                  }`}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Step 2: Trigger & Timer */}
        <div className="bg-zinc-900/90 p-4 rounded-xl border border-zinc-800 flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-xs text-orange-400 uppercase tracking-wide flex items-center gap-1.5 mb-2">
              <Timer className="w-3.5 h-3.5" /> 2. Trigger Sensitivity
            </h4>
            <p className="text-[11px] text-zinc-400 mb-3">
              Configure how and when the haunting activates.
            </p>

            <div className="flex flex-col gap-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-zinc-300">Countdown Delay:</span>
                  <span className="font-mono text-orange-400 font-bold">
                    {delaySeconds} seconds
                  </span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="60"
                  step="1"
                  value={delaySeconds}
                  onChange={(e) => setDelaySeconds(Number(e.target.value))}
                  className="w-full accent-orange-500"
                />
                <div className="flex justify-between text-[10px] font-mono text-zinc-500 mt-1">
                  <span>3s (Instant)</span>
                  <span>30s</span>
                  <span>60s (Long)</span>
                </div>
              </div>

              <div
                onClick={() => setTriggerOnClick(!triggerOnClick)}
                className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center justify-between cursor-pointer select-none"
              >
                <div>
                  <div className="text-xs font-bold text-zinc-200">
                    Hair-Trigger Activation
                  </div>
                  <div className="text-[10px] text-zinc-500">
                    Triggers immediately if mouse is wiggled or key is pressed
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={triggerOnClick}
                  readOnly
                  className="w-4 h-4 accent-orange-500"
                />
              </div>

              <button
                onClick={toggleFullscreen}
                className="py-2 px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs font-mono flex items-center justify-center gap-2 transition-colors"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Toggle Fullscreen Display</span>
              </button>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-800">
            <button
              onClick={() => {
                sound.playEvilLaugh();
                onArmPrank({ delaySeconds, disguise, triggerOnClick });
              }}
              className="w-full py-2.5 bg-gradient-to-r from-red-600 via-orange-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-zinc-950 font-black text-xs rounded-xl shadow-[0_0_20px_rgba(249,115,22,0.4)] flex items-center justify-center gap-2 transform active:scale-95 transition-all"
            >
              <Play className="w-4 h-4 fill-zinc-950" />
              <span>ARM STEALTH TRAP NOW</span>
            </button>
          </div>
        </div>
      </div>

      {/* Shareable Link Box */}
      <div className="p-3.5 bg-zinc-950 border border-zinc-800 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Link className="w-4 h-4 text-orange-400 shrink-0" />
          <div>
            <div className="text-xs font-bold text-zinc-200">
              Shareable Prank Link
            </div>
            <div className="text-[11px] text-zinc-400">
              Send this link to a coworker or friend — it will auto-launch with your configured curses!
            </div>
          </div>
        </div>

        <button
          onClick={handleCopyPrankLink}
          className="w-full sm:w-auto px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-orange-400 border border-orange-500/40 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors"
        >
          {copiedLink ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">COPIED LINK!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>COPY PRANK URL</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
