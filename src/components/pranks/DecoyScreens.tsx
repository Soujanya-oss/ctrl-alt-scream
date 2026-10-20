import React, { useEffect, useState, useRef } from 'react';
import { sound } from '../../utils/soundEngine';
import { RefreshCw, X } from 'lucide-react';

interface DecoyScreenProps {
  type: 'update' | 'spreadsheet' | 'bsod';
  onTriggerHaunt: () => void;
  onExit: () => void;
}

export const DecoyScreen: React.FC<DecoyScreenProps> = ({
  type,
  onTriggerHaunt,
  onExit,
}) => {
  const [percent, setPercent] = useState(47);
  const [armed, setArmed] = useState(false);
  const hasTriggered = useRef(false);

  // 1.2s grace period so prankster's click doesn't self-trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      setArmed(true);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Keyboard escape listener to safely abort decoy
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onExit();
        return;
      }
      if (armed && !hasTriggered.current) {
        hasTriggered.current = true;
        sound.playThunder();
        onTriggerHaunt();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [armed, onExit, onTriggerHaunt]);

  // Auto increment update percent slowly to look authentic
  useEffect(() => {
    if (type !== 'update') return;
    const interval = setInterval(() => {
      setPercent((p) => (p >= 99 ? 47 : p + 1));
    }, 2800);
    return () => clearInterval(interval);
  }, [type]);

  const handleInteraction = () => {
    if (type === 'bsod') {
      sound.playGlitch();
      onExit();
      return;
    }
    if (!armed || hasTriggered.current) return;
    hasTriggered.current = true;
    sound.playThunder();
    onTriggerHaunt();
  };

  // 1. BSOD Screen
  if (type === 'bsod') {
    return (
      <div
        onClick={handleInteraction}
        className="fixed inset-0 z-[10001] bg-[#0000aa] text-white font-mono p-6 sm:p-14 select-none cursor-pointer flex flex-col justify-between"
      >
        <div className="max-w-3xl flex flex-col gap-4">
          <div className="bg-white text-[#0000aa] px-3 py-1 font-bold inline-block text-sm">
            *** BLUE SCREAM OF DEATH ***
          </div>

          <p className="text-sm sm:text-base leading-relaxed">
            A fatal Halloween exception has occurred at 0x666:0xPUMPKIN_CORE_OVERFLOW.
            The mortal session was terminated because your computer consumed 5,000 gigabytes of
            ectoplasm.
          </p>

          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            * Press any key or CLICK ANYWHERE to banish the specter back to the Netherworld.<br />
            * If this is the first time you've seen this error screen, hand over 3 KitKats.<br />
            * If this screen appears again, consult your local witch doctor or press PANIC.
          </p>

          <div className="text-xs text-yellow-300 bg-blue-900/60 p-3 rounded border border-blue-400/30">
            Technical information:<br />
            *** STOP: 0x00000666 (0x00000000, 0xDEADBEEF, 0xTRICKORTREAT, 0xPUMPKIN_SPICE)<br />
            *** Address 0x80400000 base at 0x80400000, DateStamp 10/31/2026 - poltergeist.sys
          </div>
        </div>

        <div className="text-xs text-blue-200 animate-pulse flex items-center justify-between">
          <span>Click anywhere to dismiss BSOD prank... (or press Esc)</span>
          <span className="text-xl">🎃</span>
        </div>
      </div>
    );
  }

  // 2. Fake Windows Update Screen
  if (type === 'update') {
    return (
      <div
        onClick={handleInteraction}
        onMouseMove={handleInteraction}
        className="fixed inset-0 z-[10001] bg-[#004275] text-white font-sans flex flex-col items-center justify-center p-6 select-none cursor-wait"
      >
        <div className="flex flex-col items-center text-center max-w-md">
          <RefreshCw className="w-12 h-12 text-white animate-spin mb-6" />
          <h2 className="text-2xl font-light mb-2">
            Working on updates {percent}%
          </h2>
          <p className="text-sm text-blue-200 mb-6">
            Don't turn off your PC. This will take a while.
          </p>
          <div className="w-64 h-1.5 bg-blue-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-300 transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        {/* Secret exit button in corner for prankster */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onExit();
          }}
          className="absolute top-3 right-3 text-blue-400 hover:text-white p-2 rounded text-xs opacity-40 hover:opacity-100 transition-opacity"
          title="Exit Decoy Screen (Esc)"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="absolute bottom-4 text-[10px] text-blue-300/80 font-mono">
          {!armed
            ? 'Arming trap in 1s (walk away now)...'
            : 'Trap armed: touching mouse or keys will awaken the spirits!'}
        </div>
      </div>
    );
  }

  // 3. Fake Corporate Finance & Tax Spreadsheet
  return (
    <div
      onClick={handleInteraction}
      onMouseMove={handleInteraction}
      className="fixed inset-0 z-[10001] bg-white text-zinc-900 font-sans flex flex-col select-none cursor-pointer"
    >
      {/* Fake Excel Header */}
      <div className="bg-[#107c41] text-white px-4 py-2 flex items-center justify-between text-xs font-semibold">
        <div className="flex items-center gap-2">
          <span>📊</span>
          <span>Microsoft Excel - Annual_Corporate_Tax_Audit_2026.xlsx</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] opacity-80">Saved to OneDrive</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onExit();
            }}
            className="text-white hover:bg-[#0c5c30] p-1 rounded transition-colors"
            title="Exit Decoy (Esc)"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="bg-[#f3f2f1] border-b border-zinc-300 px-4 py-1.5 flex gap-4 text-xs text-zinc-700">
        <span className="font-semibold text-[#107c41]">Home</span>
        <span>Insert</span>
        <span>Formulas</span>
        <span>Data</span>
        <span>Review</span>
        <span>View</span>
      </div>

      {/* Spreadsheet grid */}
      <div className="flex-1 overflow-auto bg-white p-4 font-mono text-xs">
        <table className="w-full border-collapse border border-zinc-300">
          <thead>
            <tr className="bg-zinc-100 text-zinc-600">
              <th className="border border-zinc-300 px-2 py-1 w-10"></th>
              <th className="border border-zinc-300 px-3 py-1 text-left">A: Account Name</th>
              <th className="border border-zinc-300 px-3 py-1 text-right">B: Q1 Budget</th>
              <th className="border border-zinc-300 px-3 py-1 text-right">C: Q2 Actual</th>
              <th className="border border-zinc-300 px-3 py-1 text-right">D: Variance</th>
            </tr>
          </thead>
          <tbody>
            {[
              { a: 'Cloud Infrastructure & Hosting', b: '$45,000.00', c: '$42,120.00', d: '-$2,880.00' },
              { a: 'Halloween Candy Subsidy Reserve', b: '$12,500.00', c: '$24,900.00', d: '+$12,400.00 ⚠️' },
              { a: 'Emergency Poltergeist Exorcism Fee', b: '$5,000.00', c: '$13,370.00', d: '+$8,370.00 👻' },
              { a: 'Pumpkin Spice Latte Depreciation', b: '$3,200.00', c: '$4,100.00', d: '+$900.00' },
              { a: 'GDG Hackathon Prize Allocation', b: '$18,000.00', c: '$18,000.00', d: '$0.00' },
            ].map((row, i) => (
              <tr key={i} className="hover:bg-zinc-50">
                <td className="border border-zinc-300 px-2 py-1 bg-zinc-100 text-zinc-500 text-center">
                  {i + 1}
                </td>
                <td className="border border-zinc-300 px-3 py-1 font-medium">{row.a}</td>
                <td className="border border-zinc-300 px-3 py-1 text-right">{row.b}</td>
                <td className="border border-zinc-300 px-3 py-1 text-right">{row.c}</td>
                <td className="border border-zinc-300 px-3 py-1 text-right font-bold text-emerald-700">
                  {row.d}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-6 text-zinc-400 text-[11px] italic">
          {!armed
            ? 'Arming decoy trap (step away from keyboard)...'
            : '(Touching the mouse or typing any key will awaken the spirit realm...)'}
        </div>
      </div>
    </div>
  );
};
