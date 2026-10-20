/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CurseId, DesktopWindow, GlitchPopupData } from './types';
import { sound } from './utils/soundEngine';
import { CurseOverlay } from './components/effects/CurseOverlay';
import { Desktop } from './components/desktop/Desktop';
import { Taskbar } from './components/desktop/Taskbar';
import { DesktopWindowFrame } from './components/desktop/DesktopWindowFrame';
import { CurseControlWindow, CURSE_LIST } from './components/windows/CurseControlWindow';
import { ArcadeWindow } from './components/windows/ArcadeWindow';
import { SpiritOracleWindow } from './components/windows/SpiritOracleWindow';
import { PrankSetupWindow } from './components/windows/PrankSetupWindow';
import { FileManagerWindow } from './components/windows/FileManagerWindow';
import { SoundboardWindow } from './components/windows/SoundboardWindow';
import { DecoyScreen } from './components/pranks/DecoyScreens';

const INITIAL_WINDOWS: DesktopWindow[] = [
  {
    id: 'curses',
    title: 'Curse Control Center',
    icon: '🔮',
    isOpen: true,
    isMinimized: false,
    zIndex: 10,
    defaultPosition: { x: 30, y: 70, w: 800, h: 560 },
  },
  {
    id: 'arcade',
    title: 'Halloween Arcade & Candy Shop',
    icon: '🎮',
    isOpen: false,
    isMinimized: false,
    zIndex: 9,
    defaultPosition: { x: 60, y: 80, w: 760, h: 540 },
  },
  {
    id: 'oracle',
    title: 'Grimbyte 9000: AI Spirit Advisor',
    icon: '👁️',
    isOpen: false,
    isMinimized: false,
    zIndex: 8,
    defaultPosition: { x: 90, y: 90, w: 760, h: 520 },
  },
  {
    id: 'prankSetup',
    title: 'Stealth Prank Deployment',
    icon: '🎯',
    isOpen: false,
    isMinimized: false,
    zIndex: 7,
    defaultPosition: { x: 120, y: 100, w: 740, h: 520 },
  },
  {
    id: 'files',
    title: 'C:\ Haunted Drive File Explorer',
    icon: '📁',
    isOpen: false,
    isMinimized: false,
    zIndex: 6,
    defaultPosition: { x: 150, y: 110, w: 700, h: 480 },
  },
  {
    id: 'soundboard',
    title: 'Crypt Soundboard Synthesizer',
    icon: '🔊',
    isOpen: false,
    isMinimized: false,
    zIndex: 5,
    defaultPosition: { x: 180, y: 120, w: 720, h: 500 },
  },
];

export default function App() {
  const [activeCurses, setActiveCurses] = useState<Set<CurseId>>(
    new Set<CurseId>(['spookyCursor'])
  );
  const [popups, setPopups] = useState<GlitchPopupData[]>([]);
  const [windows, setWindows] = useState<DesktopWindow[]>(INITIAL_WINDOWS);
  const [activeWindowId, setActiveWindowId] = useState<string | null>('curses');
  const [candies, setCandies] = useState<number>(45);
  const [unlockedItems, setUnlockedItems] = useState<Set<string>>(new Set<string>());
  const [isMuted, setIsMuted] = useState<boolean>(sound.getMuted());
  const [decoyType, setDecoyType] = useState<'update' | 'spreadsheet' | 'bsod' | null>(null);
  const [stealthTimer, setStealthTimer] = useState<number | null>(null);
  const [fakeShutdownOpen, setFakeShutdownOpen] = useState(false);

  const topZIndex = useRef<number>(20);

  // Auto unlock Web Audio API on first user interaction
  useEffect(() => {
    const unlock = () => {
      sound.initCtx();
    };
    window.addEventListener('click', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });
    window.addEventListener('touchstart', unlock, { once: true });
    return () => {
      window.removeEventListener('click', unlock);
      window.removeEventListener('keydown', unlock);
      window.removeEventListener('touchstart', unlock);
    };
  }, []);

  // Parse shareable URL query parameters for instant pranks
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('prank') === '1') {
        const curseParam = urlParams.get('curses');
        if (curseParam) {
          const list = curseParam.split(',') as CurseId[];
          setActiveCurses(new Set(list));
        } else {
          setActiveCurses(new Set(['gravity', 'ghosts', 'spookyCursor', 'glitchPopups']));
        }

        const disguiseParam = urlParams.get('disguise');
        if (disguiseParam === 'update' || disguiseParam === 'spreadsheet') {
          setDecoyType(disguiseParam);
        }

        const delay = Number(urlParams.get('delay')) || 5;
        setStealthTimer(delay);
      }
    } catch {
      // ignore param parsing errors
    }
  }, []);

  // Handle countdown for stealth timer
  useEffect(() => {
    if (stealthTimer === null) return;
    if (stealthTimer <= 0) {
      setStealthTimer(null);
      // Trigger prank!
      sound.playThunder();
      return;
    }

    const timer = setInterval(() => {
      setStealthTimer((t) => (t !== null && t > 0 ? t - 1 : null));
    }, 1000);

    return () => clearInterval(timer);
  }, [stealthTimer]);

  // Curse Handlers
  const toggleCurse = useCallback((id: CurseId) => {
    setActiveCurses((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const activateAllCurses = useCallback(() => {
    const all = new Set<CurseId>(CURSE_LIST.map((c) => c.id));
    setActiveCurses(all);
  }, []);

  const handlePanicReset = useCallback(() => {
    setActiveCurses(new Set());
    setPopups([]);
    setDecoyType(null);
    setStealthTimer(null);
  }, []);

  // Window Management
  const bringToFront = useCallback((id: string) => {
    topZIndex.current += 1;
    setActiveWindowId(id);
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, zIndex: topZIndex.current, isMinimized: false } : w))
    );
  }, []);

  const openWindow = useCallback(
    (id: string) => {
      topZIndex.current += 1;
      setActiveWindowId(id);
      setWindows((prev) =>
        prev.map((w) =>
          w.id === id ? { ...w, isOpen: true, isMinimized: false, zIndex: topZIndex.current } : w
        )
      );
    },
    []
  );

  const closeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, isOpen: false } : w)));
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w)));
  }, []);

  const toggleWindowFromTaskbar = useCallback(
    (id: string) => {
      setWindows((prev) => {
        const target = prev.find((w) => w.id === id);
        if (!target) return prev;
        if (target.isMinimized) {
          topZIndex.current += 1;
          setActiveWindowId(id);
          return prev.map((w) =>
            w.id === id ? { ...w, isMinimized: false, zIndex: topZIndex.current } : w
          );
        } else if (activeWindowId === id) {
          return prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w));
        } else {
          topZIndex.current += 1;
          setActiveWindowId(id);
          return prev.map((w) =>
            w.id === id ? { ...w, zIndex: topZIndex.current } : w
          );
        }
      });
    },
    [activeWindowId]
  );

  // Candy Bank & Unlocks
  const handleAddCandies = useCallback((amount: number) => {
    setCandies((c) => c + amount);
  }, []);

  const handleUnlockItem = useCallback((itemId: string, cost: number) => {
    setCandies((c) => Math.max(0, c - cost));
    setUnlockedItems((prev) => new Set([...prev, itemId]));
  }, []);

  // Popup Management
  const handleClosePopup = useCallback((id: string) => {
    setPopups((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const handleAddPopup = useCallback((popup: GlitchPopupData) => {
    setPopups((prev) => [...prev, popup]);
  }, []);

  // Prank Arming
  const handleArmPrank = useCallback(
    (config: {
      delaySeconds: number;
      disguise: 'spreadsheet' | 'update' | 'none';
      triggerOnClick: boolean;
    }) => {
      if (config.disguise !== 'none') {
        setDecoyType(config.disguise);
      }
      setStealthTimer(config.delaySeconds);
      // Make sure at least gravity and ghosts are set
      setActiveCurses((prev) => {
        const next = new Set(prev);
        next.add('gravity');
        next.add('ghosts');
        next.add('glitchPopups');
        return next;
      });
    },
    []
  );

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-zinc-950 font-sans-clean">
      {/* 1. Desktop Wallpaper & Icons */}
      <Desktop
        windows={windows}
        onOpenWindow={openWindow}
        activeCurses={activeCurses}
        onPanicReset={handlePanicReset}
        candies={candies}
      />

      {/* 2. Draggable Desktop Windows */}
      {windows.map((w) => {
        if (!w.isOpen) return null;

        return (
          <DesktopWindowFrame
            key={w.id}
            id={w.id}
            title={w.title}
            icon={w.icon}
            isOpen={w.isOpen}
            isMinimized={w.isMinimized}
            zIndex={w.zIndex}
            initialPos={w.defaultPosition}
            isGravityActive={activeCurses.has('gravity')}
            isPoltergeistActive={activeCurses.has('poltergeist')}
            onFocus={() => bringToFront(w.id)}
            onClose={() => closeWindow(w.id)}
            onMinimize={() => minimizeWindow(w.id)}
          >
            {w.id === 'curses' && (
              <CurseControlWindow
                activeCurses={activeCurses}
                onToggleCurse={toggleCurse}
                onActivateAll={activateAllCurses}
                onClearAll={handlePanicReset}
              />
            )}
            {w.id === 'arcade' && (
              <ArcadeWindow
                candies={candies}
                onAddCandies={handleAddCandies}
                unlockedItems={unlockedItems}
                onUnlockItem={handleUnlockItem}
                onTriggerBSOD={() => setDecoyType('bsod')}
              />
            )}
            {w.id === 'oracle' && (
              <SpiritOracleWindow activeCurses={activeCurses} />
            )}
            {w.id === 'prankSetup' && (
              <PrankSetupWindow
                activeCurses={activeCurses}
                onArmPrank={handleArmPrank}
              />
            )}
            {w.id === 'files' && <FileManagerWindow />}
            {w.id === 'soundboard' && <SoundboardWindow />}
          </DesktopWindowFrame>
        );
      })}

      {/* 3. Interactive Paranormal Overlays (Ghosts, Slime Cursor, Ectoplasm, Glitch Popups) */}
      <CurseOverlay
        activeCurses={activeCurses}
        popups={popups}
        onClosePopup={handleClosePopup}
        onAddPopup={handleAddPopup}
        unlockedItems={unlockedItems}
      />

      {/* 4. Decoy Screens (Fake Windows Update, Spreadsheet, BSOD) */}
      {decoyType && (
        <DecoyScreen
          type={decoyType}
          onTriggerHaunt={() => {
            setDecoyType(null);
            activateAllCurses();
            sound.playPumpkinScream();
          }}
          onExit={() => setDecoyType(null)}
        />
      )}

      {/* 5. Stealth Countdown Banner if Armed */}
      {stealthTimer !== null && (
        <div className="fixed top-14 left-1/2 transform -translate-x-1/2 z-[10002] bg-red-950/90 border-2 border-red-500 text-red-200 px-4 py-2 rounded-xl shadow-2xl flex items-center gap-2 font-mono text-xs">
          <span className="animate-spin text-base">⏳</span>
          <span>STEALTH PRANK ARMED // DETONATION IN: </span>
          <span className="font-bold text-orange-400 text-sm">{stealthTimer}s</span>
          <button
            onClick={() => setStealthTimer(null)}
            className="ml-2 px-2 py-0.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-[10px]"
          >
            Cancel
          </button>
        </div>
      )}

      {/* 6. Fake Shutdown Alert Modal */}
      {fakeShutdownOpen && (
        <div className="fixed inset-0 z-[10003] bg-zinc-950/85 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-zinc-900 border-2 border-orange-500 rounded-xl max-w-md w-full p-5 shadow-2xl text-zinc-100">
            <div className="flex items-center gap-3 text-orange-400 mb-2">
              <span className="text-3xl">🎃</span>
              <h3 className="font-bold text-base">SHUTDOWN OVERRULED BY GHOSTS</h3>
            </div>
            <p className="text-xs text-zinc-300 font-mono leading-relaxed mt-2">
              Error 0x666: The digital spirits refuse to go to sleep before eating all the Halloween
              candy. Press Panic to banish them, or keep playing!
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => {
                  sound.playEvilLaugh();
                  setFakeShutdownOpen(false);
                }}
                className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded text-xs text-zinc-300 font-mono"
              >
                Accept Fate
              </button>
              <button
                onClick={() => {
                  setFakeShutdownOpen(false);
                  handlePanicReset();
                }}
                className="px-4 py-1.5 bg-orange-600 hover:bg-orange-500 text-zinc-950 font-bold rounded text-xs"
              >
                🎃 Panic Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Bottom Retro Taskbar */}
      <Taskbar
        windows={windows}
        activeWindowId={activeWindowId}
        onOpenWindow={openWindow}
        onToggleWindow={toggleWindowFromTaskbar}
        onPanicReset={handlePanicReset}
        activeCurseCount={activeCurses.size}
        candies={candies}
        onFakeShutdown={() => {
          sound.playEvilLaugh();
          setFakeShutdownOpen(true);
        }}
        onToggleMute={() => {
          const next = sound.toggleMute();
          setIsMuted(next);
        }}
        isMuted={isMuted}
      />
    </div>
  );
}
