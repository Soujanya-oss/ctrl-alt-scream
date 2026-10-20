import React, { useState } from 'react';
import { CurseId, DesktopWindow } from '../../types';
import { sound } from '../../utils/soundEngine';
import { PanicButton } from '../PanicButton';
import {
  Sparkles,
  Maximize2,
  AlertOctagon,
  X,
  RefreshCw,
  Folder,
  Skull,
  Ghost,
} from 'lucide-react';

interface DesktopProps {
  windows: DesktopWindow[];
  onOpenWindow: (id: string) => void;
  activeCurses: Set<CurseId>;
  onPanicReset: () => void;
  candies: number;
}

export const Desktop: React.FC<DesktopProps> = ({
  windows,
  onOpenWindow,
  activeCurses,
  onPanicReset,
  candies,
}) => {
  const [wallpaper, setWallpaper] = useState<'graveyard' | 'neon' | 'pumpkin'>('pumpkin');
  const [showShutdownAlert, setShowShutdownAlert] = useState(false);

  const desktopShortcuts = [
    {
      id: 'curses',
      title: 'Curse Control',
      icon: '🔮',
      subtitle: 'Toggle Curses',
      badge: `${activeCurses.size} Active`,
    },
    {
      id: 'arcade',
      title: 'Halloween Arcade',
      icon: '🎮',
      subtitle: 'Whack & Catch',
      badge: 'Earn Candy',
    },
    {
      id: 'oracle',
      title: 'Grimbyte AI Oracle',
      icon: '👁️',
      subtitle: 'Prank Advisor',
      badge: 'Gemini AI',
    },
    {
      id: 'prankSetup',
      title: 'Stealth Trap',
      icon: '🎯',
      subtitle: 'Decoy Screen',
      badge: 'Arm Prank',
    },
    {
      id: 'files',
      title: 'C:\ Haunted Drive',
      icon: '📁',
      subtitle: 'Forbidden Docs',
      badge: '666 KB',
    },
    {
      id: 'soundboard',
      title: 'Crypt Soundboard',
      icon: '🔊',
      subtitle: 'Synthesizer',
      badge: '10 FX',
    },
  ];

  const isGravity = activeCurses.has('gravity');

  const wallpaperClasses = {
    pumpkin:
      'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-950/40 via-zinc-950 to-zinc-950',
    graveyard:
      'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-950/40 via-zinc-950 to-zinc-950',
    neon: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-950/30 via-zinc-950 to-zinc-950',
  };

  const getThreatLevel = () => {
    const count = activeCurses.size;
    if (count === 0) return { label: 'PEACEFUL & DORMANT', color: 'text-emerald-400 border-emerald-800 bg-emerald-950/40' };
    if (count <= 2) return { label: 'MILD ECTOPLASMIC HAUNT', color: 'text-amber-400 border-amber-800 bg-amber-950/40' };
    if (count <= 5) return { label: 'CRITICAL POLTERGEIST INVASION', color: 'text-orange-400 border-orange-800 bg-orange-950/40' };
    return { label: 'APOCALYPTIC MAXIMUM CHAOS', color: 'text-red-400 border-red-800 bg-red-950/50 animate-pulse' };
  };

  const threat = getThreatLevel();

  return (
    <div
      className={`fixed inset-0 pb-11 overflow-hidden select-none transition-all duration-700 ${
        wallpaperClasses[wallpaper]
      } ${isGravity ? 'rotate-3 translate-y-12' : ''}`}
    >
      {/* Top OS Header Bar */}
      <header className="relative z-10 flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-zinc-950/80 backdrop-blur-md border-b border-orange-500/30">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl animate-bounce">🎃</span>
            <div>
              <h1 className="text-base sm:text-lg font-black tracking-wider text-orange-400 uppercase font-sans">
                The Possession Simulator
              </h1>
              <span className="text-[10px] font-mono text-zinc-400 block -mt-0.5">
                Boo-OS 95 Professional // Halloween Chaos & Prank Engine
              </span>
            </div>
          </div>

          <div
            className={`hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-mono font-bold tracking-wide uppercase ${threat.color}`}
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>Status: {threat.label}</span>
          </div>
        </div>

        {/* Right header controls with Screaming Pumpkin Panic Button */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1 bg-zinc-900 border border-zinc-800 p-1 rounded-lg text-[11px] font-mono">
            <span className="text-zinc-500 px-1">Wallpaper:</span>
            <button
              onClick={() => setWallpaper('pumpkin')}
              className={`px-2 py-0.5 rounded transition-colors ${
                wallpaper === 'pumpkin' ? 'bg-orange-600 text-zinc-950 font-bold' : 'text-zinc-400'
              }`}
            >
              Pumpkin
            </button>
            <button
              onClick={() => setWallpaper('graveyard')}
              className={`px-2 py-0.5 rounded transition-colors ${
                wallpaper === 'graveyard' ? 'bg-purple-600 text-white font-bold' : 'text-zinc-400'
              }`}
            >
              Crypt
            </button>
            <button
              onClick={() => setWallpaper('neon')}
              className={`px-2 py-0.5 rounded transition-colors ${
                wallpaper === 'neon' ? 'bg-emerald-600 text-zinc-950 font-bold' : 'text-zinc-400'
              }`}
            >
              Cyber
            </button>
          </div>

          {/* Primary Screaming Pumpkin Panic Button */}
          <PanicButton
            activeCurseCount={activeCurses.size}
            onPanicReset={onPanicReset}
          />
        </div>
      </header>

      {/* Desktop Canvas with Desktop Icons */}
      <div className="p-4 sm:p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 max-w-5xl">
        {desktopShortcuts.map((shortcut) => (
          <button
            key={shortcut.id}
            onDoubleClick={() => {
              sound.playGlitch();
              onOpenWindow(shortcut.id);
            }}
            onClick={() => {
              sound.playGlitch();
              onOpenWindow(shortcut.id);
            }}
            className={`flex flex-col items-center justify-center p-3.5 rounded-xl border transition-all text-center group cursor-pointer ${
              activeCurses.size > 0 && Math.random() > 0.6 && isGravity
                ? 'rotate-12 translate-y-6'
                : ''
            } bg-zinc-900/60 hover:bg-zinc-800/80 border-zinc-800/80 hover:border-orange-500/60 shadow-lg hover:shadow-[0_0_20px_rgba(249,115,22,0.25)]`}
          >
            <div className="relative">
              <span className="text-4xl block p-2 group-hover:scale-115 transition-transform">
                {shortcut.icon}
              </span>
              <span className="absolute -top-1 -right-2 px-1.5 py-0.2 bg-orange-600 text-zinc-950 font-mono font-bold text-[9px] rounded-full shadow">
                {shortcut.badge}
              </span>
            </div>

            <div className="mt-2">
              <div className="font-bold text-xs text-zinc-100 group-hover:text-orange-400 font-sans tracking-wide">
                {shortcut.title}
              </div>
              <div className="text-[10px] font-mono text-zinc-500 mt-0.5">
                {shortcut.subtitle}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Centered Spooky Retro Watermark / Instructions */}
      <div className="absolute inset-x-0 bottom-24 flex flex-col items-center justify-center text-center pointer-events-none px-4 opacity-75">
        <div className="text-5xl mb-2 opacity-30 select-none animate-ghost-float">
          👻🕸️🎃
        </div>
        <p className="text-xs font-mono text-zinc-500 max-w-md">
          Double-click any desktop icon to launch tools. Toggle curses in the Curse Registry,
          consult Grimbyte 9000 for prank ideas, or press the Screaming Pumpkin to reset everything!
        </p>
      </div>

      {/* Fake Shutdown Modal */}
      {showShutdownAlert && (
        <div className="fixed inset-0 z-[10002] bg-zinc-950/85 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-zinc-900 border-2 border-red-500 rounded-xl max-w-md w-full p-5 shadow-2xl text-zinc-100">
            <div className="flex items-center gap-3 text-red-400 mb-3">
              <AlertOctagon className="w-6 h-6 animate-pulse" />
              <h3 className="font-bold text-base">SHUTDOWN ACCESS DENIED</h3>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed font-mono">
              The poltergeists in sector 0x666 have revoked shutdown permissions.
              They are currently roasting marshmallows over your overclocked GPU.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => {
                  sound.playEvilLaugh();
                  setShowShutdownAlert(false);
                }}
                className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded text-xs text-zinc-300"
              >
                Accept My Fate
              </button>
              <button
                onClick={() => {
                  setShowShutdownAlert(false);
                  onPanicReset();
                }}
                className="px-4 py-1.5 bg-orange-600 hover:bg-orange-500 text-zinc-950 font-bold rounded text-xs"
              >
                🎃 Exorcise & Stay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
