import React, { useState } from 'react';
import { DesktopWindow } from '../../types';
import { sound } from '../../utils/soundEngine';
import { PanicButton } from '../PanicButton';
import {
  Volume2,
  VolumeX,
  Power,
  ShieldAlert,
  Zap,
  Info,
  Sparkles,
} from 'lucide-react';

interface TaskbarProps {
  windows: DesktopWindow[];
  activeWindowId: string | null;
  onOpenWindow: (id: string) => void;
  onToggleWindow: (id: string) => void;
  onPanicReset: () => void;
  activeCurseCount: number;
  candies: number;
  onFakeShutdown: () => void;
  onToggleMute: () => void;
  isMuted: boolean;
}

export const Taskbar: React.FC<TaskbarProps> = ({
  windows,
  activeWindowId,
  onOpenWindow,
  onToggleWindow,
  onPanicReset,
  activeCurseCount,
  candies,
  onFakeShutdown,
  onToggleMute,
  isMuted,
}) => {
  const [startMenuOpen, setStartMenuOpen] = useState(false);

  return (
    <>
      {/* 90s Vintage Taskbar */}
      <div className="fixed bottom-0 left-0 right-0 h-11 bg-zinc-900 border-t-2 border-orange-500/70 z-[9997] flex items-center justify-between px-2 sm:px-3 select-none">
        {/* Left: Start Button + Active Windows */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-[65vw]">
          {/* Start Button */}
          <button
            onClick={() => {
              sound.playGlitch();
              setStartMenuOpen(!startMenuOpen);
            }}
            className={`px-3 py-1.5 rounded font-black text-xs flex items-center gap-1.5 border-2 transition-all shrink-0 ${
              startMenuOpen
                ? 'bg-orange-600 border-amber-300 text-zinc-950 shadow-[0_0_12px_rgba(249,115,22,0.6)]'
                : 'bg-zinc-800 hover:bg-zinc-700 border-orange-500/60 text-orange-400'
            }`}
          >
            <span className="text-base">🎃</span>
            <span className="tracking-wider">START</span>
          </button>

          {/* Active Window Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto">
            {windows
              .filter((w) => w.isOpen)
              .map((w) => {
                const isActive = activeWindowId === w.id && !w.isMinimized;
                return (
                  <button
                    key={w.id}
                    onClick={() => {
                      sound.playGlitch();
                      onToggleWindow(w.id);
                    }}
                    className={`px-2.5 py-1 rounded text-xs font-mono font-medium flex items-center gap-1.5 border shrink-0 transition-colors ${
                      isActive
                        ? 'bg-zinc-950 border-orange-500 text-orange-300 shadow-sm'
                        : 'bg-zinc-800/80 hover:bg-zinc-800 border-zinc-700 text-zinc-400'
                    }`}
                  >
                    <span>{w.icon}</span>
                    <span className="truncate max-w-[100px] sm:max-w-[130px]">{w.title}</span>
                  </button>
                );
              })}
          </div>
        </div>

        {/* Right: Candy count + Audio + Panic Button + Clock */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Live Candy Wallet */}
          <div
            onClick={() => onOpenWindow('arcade')}
            className="hidden sm:flex items-center gap-1 bg-zinc-950 border border-orange-500/40 px-2.5 py-1 rounded cursor-pointer hover:border-orange-400 text-xs font-mono font-bold text-orange-400"
            title="Soul Candy Points: Click to spend in Arcade Shop"
          >
            <span>🍬</span>
            <span>{candies}</span>
          </div>

          {/* Sound Mute Toggle */}
          <button
            onClick={onToggleMute}
            className="p-1.5 bg-zinc-800 hover:bg-zinc-700 rounded border border-zinc-700 text-zinc-300 hover:text-white transition-colors"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-red-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-orange-400" />
            )}
          </button>

          {/* Taskbar Panic Button */}
          <PanicButton
            compact={true}
            activeCurseCount={activeCurseCount}
            onPanicReset={onPanicReset}
          />

          {/* Witching Hour Clock */}
          <div className="hidden md:flex flex-col text-right font-mono text-[10px] text-zinc-400 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
            <span className="text-orange-400 font-bold">11:59 PM</span>
            <span className="text-[9px] text-zinc-500">Witching Hour</span>
          </div>
        </div>
      </div>

      {/* Start Menu Popup */}
      {startMenuOpen && (
        <>
          <div
            onClick={() => setStartMenuOpen(false)}
            className="fixed inset-0 z-[9996]"
          />
          <div className="fixed bottom-12 left-2 z-[9998] w-72 sm:w-80 bg-zinc-950 border-2 border-orange-500 rounded-t-xl rounded-br-xl shadow-[0_0_30px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col">
            {/* Start Menu Header */}
            <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-zinc-900 p-3 text-zinc-950">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎃</span>
                <div>
                  <h4 className="font-extrabold text-sm tracking-wide uppercase">
                    Boo-OS 95 Haunted Edition
                  </h4>
                  <div className="text-[10px] font-mono text-zinc-900 font-semibold">
                    Possession Simulator v2.0
                  </div>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2 flex flex-col gap-1 text-xs">
              <button
                onClick={() => {
                  onOpenWindow('curses');
                  setStartMenuOpen(false);
                }}
                className="p-2 rounded hover:bg-zinc-850 flex items-center gap-2.5 text-zinc-200 text-left transition-colors"
              >
                <span className="text-lg">🔮</span>
                <div>
                  <div className="font-bold text-orange-400">Curse Control Center</div>
                  <div className="text-[10px] text-zinc-500">Toggle paranormal phenomena</div>
                </div>
              </button>

              <button
                onClick={() => {
                  onOpenWindow('arcade');
                  setStartMenuOpen(false);
                }}
                className="p-2 rounded hover:bg-zinc-850 flex items-center gap-2.5 text-zinc-200 text-left transition-colors"
              >
                <span className="text-lg">🎮</span>
                <div>
                  <div className="font-bold text-orange-400">Halloween Arcade & Candy Shop</div>
                  <div className="text-[10px] text-zinc-500">Whack-a-ghost & earn treats</div>
                </div>
              </button>

              <button
                onClick={() => {
                  onOpenWindow('oracle');
                  setStartMenuOpen(false);
                }}
                className="p-2 rounded hover:bg-zinc-850 flex items-center gap-2.5 text-zinc-200 text-left transition-colors"
              >
                <span className="text-lg">👁️</span>
                <div>
                  <div className="font-bold text-purple-400">Grimbyte AI Spirit Oracle</div>
                  <div className="text-[10px] text-zinc-500">Gemini-powered prank optimizer</div>
                </div>
              </button>

              <button
                onClick={() => {
                  onOpenWindow('prankSetup');
                  setStartMenuOpen(false);
                }}
                className="p-2 rounded hover:bg-zinc-850 flex items-center gap-2.5 text-zinc-200 text-left transition-colors"
              >
                <span className="text-lg">🎯</span>
                <div>
                  <div className="font-bold text-amber-400">Stealth Prank Deployment</div>
                  <div className="text-[10px] text-zinc-500">Decoy screens & countdown timers</div>
                </div>
              </button>

              <button
                onClick={() => {
                  onOpenWindow('files');
                  setStartMenuOpen(false);
                }}
                className="p-2 rounded hover:bg-zinc-850 flex items-center gap-2.5 text-zinc-200 text-left transition-colors"
              >
                <span className="text-lg">📁</span>
                <div>
                  <div className="font-bold text-zinc-200">Cursed C:\ File Explorer</div>
                  <div className="text-[10px] text-zinc-500">Browse forbidden documents</div>
                </div>
              </button>

              <button
                onClick={() => {
                  onOpenWindow('soundboard');
                  setStartMenuOpen(false);
                }}
                className="p-2 rounded hover:bg-zinc-850 flex items-center gap-2.5 text-zinc-200 text-left transition-colors"
              >
                <span className="text-lg">🔊</span>
                <div>
                  <div className="font-bold text-zinc-200">Crypt Soundboard</div>
                  <div className="text-[10px] text-zinc-500">Procedural Halloween audio FX</div>
                </div>
              </button>
            </div>

            {/* Bottom Menu: Shut Down Fake Action */}
            <div className="p-2 bg-zinc-900 border-t border-zinc-800 flex items-center justify-between text-xs">
              <button
                onClick={() => {
                  setStartMenuOpen(false);
                  onFakeShutdown();
                }}
                className="p-2 rounded hover:bg-red-950/60 text-red-400 font-bold flex items-center gap-2 transition-colors w-full"
              >
                <Power className="w-4 h-4" />
                <span>Shut Down PC... (Dare You?)</span>
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};
