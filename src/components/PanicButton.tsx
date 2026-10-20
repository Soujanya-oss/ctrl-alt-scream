import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/soundEngine';
import { Sparkles, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface PanicButtonProps {
  onPanicReset: () => void;
  activeCurseCount: number;
  compact?: boolean;
}

export const PanicButton: React.FC<PanicButtonProps> = ({
  onPanicReset,
  activeCurseCount,
  compact = false,
}) => {
  const [isScreaming, setIsScreaming] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const handleTriggerPanic = () => {
    setIsScreaming(true);
    sound.playPumpkinScream();

    // Trigger multi-point colorful holy exorcism confetti burst
    try {
      const end = Date.now() + 1000;
      const colors = ['#f97316', '#22c55e', '#a855f7', '#fbbf24', '#ffffff'];

      (function frame() {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0.2, y: 0.6 },
          colors,
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 0.8, y: 0.6 },
          colors,
        });
        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    } catch {
      // fallback if canvas not available
    }

    onPanicReset();
    setShowCelebration(true);

    setTimeout(() => {
      setIsScreaming(false);
    }, 600);

    setTimeout(() => {
      setShowCelebration(false);
    }, 3800);
  };

  if (compact) {
    return (
      <button
        onClick={handleTriggerPanic}
        title="Panic Button: Instant Exorcism (Reset All Curses)"
        className={`px-3 py-1.5 rounded flex items-center gap-1.5 font-bold text-xs transition-all ${
          activeCurseCount > 0
            ? 'bg-gradient-to-r from-red-600 via-orange-600 to-amber-500 text-white animate-pulse shadow-[0_0_15px_rgba(249,115,22,0.8)]'
            : 'bg-zinc-800 hover:bg-orange-700 text-orange-300'
        }`}
      >
        <span className={`text-sm ${isScreaming ? 'scale-125 rotate-12 inline-block' : ''}`}>
          🎃
        </span>
        <span className="hidden sm:inline">PANIC RESET</span>
      </button>
    );
  }

  return (
    <>
      <div className="relative group">
        <button
          onClick={handleTriggerPanic}
          className={`relative flex items-center gap-3 px-4 py-2.5 rounded-xl border-2 transition-all transform active:scale-95 select-none ${
            activeCurseCount > 0
              ? 'bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 border-amber-300 text-zinc-950 font-black shadow-[0_0_30px_rgba(249,115,22,0.6)] animate-pumpkin-pulse hover:scale-105'
              : 'bg-zinc-900 hover:bg-zinc-800 border-orange-500/50 text-orange-400 font-bold hover:border-orange-400'
          }`}
          title="Instant Exorcism: Purge all active curses and restore computer stability!"
        >
          <div
            className={`text-2xl transition-transform duration-300 ${
              isScreaming ? 'scale-150 rotate-45' : 'group-hover:scale-110'
            }`}
          >
            🎃
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs uppercase tracking-wider font-extrabold flex items-center gap-1">
              {activeCurseCount > 0 ? (
                <>
                  <ShieldAlert className="w-3.5 h-3.5 animate-bounce text-zinc-950" />
                  SCREAMING PUMPKIN PANIC
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                  EMERGENCY EXORCISM
                </>
              )}
            </span>
            <span
              className={`text-[10px] font-mono ${
                activeCurseCount > 0 ? 'text-zinc-950 font-semibold' : 'text-zinc-400'
              }`}
            >
              {activeCurseCount > 0
                ? `${activeCurseCount} ACTIVE CURSE${activeCurseCount > 1 ? 'S' : ''} (CLICK TO BANISH)`
                : '100% PEACEFUL (CLICK TO TEST)'}
            </span>
          </div>
        </button>
      </div>

      {/* Victorious Exorcism Toast Overlay */}
      {showCelebration && (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-[10000] animate-bounce">
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 text-white font-bold px-6 py-3 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.7)] border-2 border-emerald-300 flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-white" />
            <div>
              <div className="text-sm tracking-wide uppercase font-extrabold">
                ✨ HOLY EXORCISM SUCCESSFUL!
              </div>
              <div className="text-xs text-emerald-100 font-mono">
                All poltergeists banished. Computer returned to mortal realm!
              </div>
            </div>
            <span className="text-2xl">🎃✨</span>
          </div>
        </div>
      )}
    </>
  );
};
