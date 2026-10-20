import React, { useEffect, useState, useRef } from 'react';
import { CurseId, GhostItem, SlimeDrop, GlitchPopupData } from '../../types';
import { sound } from '../../utils/soundEngine';
import { X, AlertTriangle, Ghost, Terminal } from 'lucide-react';

interface CurseOverlayProps {
  activeCurses: Set<CurseId>;
  onClosePopup: (id: string) => void;
  popups: GlitchPopupData[];
  onAddPopup: (popup: GlitchPopupData) => void;
  unlockedItems?: Set<string>;
}

const GHOST_EMOJIS = ['👻', '🎃', '🦇', '💀', '🍬', '🕸️'];
const GHOST_SAYINGS = [
  'BOO! Give me candy!',
  'I am inside your RAM!',
  'Looking for WiFi...',
  'Boo-hoo! Nice mouse!',
  'Where are the Snickers?',
  'Trick or Treat!',
  'Booo!',
  '404: Soul not found',
  'Did you hear that organ chord?',
  'Feed the CPU chocolate!',
];

export const CurseOverlay: React.FC<CurseOverlayProps> = ({
  activeCurses,
  popups,
  onClosePopup,
  onAddPopup,
  unlockedItems,
}) => {
  const [ghosts, setGhosts] = useState<GhostItem[]>([]);
  const [slimeDrops, setSlimeDrops] = useState<SlimeDrop[]>([]);
  const [typedMessage, setTypedMessage] = useState<string>('');
  const [showTypewriter, setShowTypewriter] = useState<boolean>(false);

  const dropIdCounter = useRef<number>(0);
  const typingTimerRef = useRef<any>(null);
  const isNeonUnlocked = Boolean(unlockedItems?.has('neon_ghosts'));

  // 1. Spooky Cursor Trail & Audio Whispers on Mouse Movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (activeCurses.has('whispers')) {
        sound.playWhisper();
      }

      if (activeCurses.has('spookyCursor')) {
        const id = ++dropIdCounter.current;
        const emojis = ['🎃', '🟢', '🍬', '🦇', '✨', '🕷️'];
        const emoji = emojis[Math.floor(Math.random() * emojis.length)];
        const colors = ['#f97316', '#22c55e', '#a855f7', '#eab308', '#ec4899'];
        const color = colors[Math.floor(Math.random() * colors.length)];

        setSlimeDrops((prev) => [
          ...prev.slice(-20),
          {
            id,
            x: e.clientX,
            y: e.clientY,
            color,
            size: 14 + Math.random() * 12,
            emoji,
          },
        ]);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [activeCurses]);

  // Clean up slime drops
  useEffect(() => {
    if (slimeDrops.length === 0) return;
    const timer = setTimeout(() => {
      setSlimeDrops((prev) => prev.slice(1));
    }, 65);
    return () => clearTimeout(timer);
  }, [slimeDrops]);

  // 2. Ghost Jumpscares loop
  useEffect(() => {
    if (!activeCurses.has('ghosts')) {
      setGhosts([]);
      return;
    }

    sound.playGhostMoan();

    const initialGhosts: GhostItem[] = Array.from({ length: 4 }).map((_, i) => ({
      id: `ghost-${Date.now()}-${i}`,
      x: Math.random() * Math.max(100, window.innerWidth - 120),
      y: 60 + Math.random() * Math.max(100, window.innerHeight - 220),
      speed: 1.5 + Math.random() * 2.5,
      direction: Math.random() > 0.5 ? 1 : -1,
      emoji: GHOST_EMOJIS[Math.floor(Math.random() * GHOST_EMOJIS.length)],
      saying: GHOST_SAYINGS[Math.floor(Math.random() * GHOST_SAYINGS.length)],
      scale: 0.8 + Math.random() * 0.7,
    }));
    setGhosts(initialGhosts);

    const interval = setInterval(() => {
      setGhosts((current) =>
        current.map((g) => {
          let nextX = g.x + g.speed * g.direction;
          let nextDir = g.direction;

          if (nextX > window.innerWidth - 80) {
            nextX = window.innerWidth - 80;
            nextDir = -1;
          } else if (nextX < 15) {
            nextX = 15;
            nextDir = 1;
          }

          let nextY = g.y + (Math.random() * 4 - 2);
          nextY = Math.max(50, Math.min(window.innerHeight - 150, nextY));

          return { ...g, x: nextX, y: nextY, direction: nextDir };
        })
      );
    }, 30);

    return () => clearInterval(interval);
  }, [activeCurses]);

  // 3. Phantom Typing Effect
  useEffect(() => {
    if (!activeCurses.has('phantomTyping')) {
      setShowTypewriter(false);
      setTypedMessage('');
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
      return;
    }

    setShowTypewriter(true);
    const messages = [
      'GHOST_OS: I AM INSIDE THE MOTHERBOARD... SEND CANDY NOW...',
      'SYSTEM NOTICE: YOUR MOUSE HAS BEEN ASSIGNED TO A SPECTER.',
      'WARNING: EXCESSIVE SILLINESS DETECTED ON PORT 666.',
      'DOWNLOADING 500 DANCING SKELETON SCREENSAVERS...',
      'DO NOT LOOK UNDER YOUR CHAIR (JUST KIDDING, THERE IS CANDY).',
      'OCTOBER 31st PROTOCOL: ALL KEYS NOW PRODUCE PUMPKIN JUICE.',
      'DID YOU LOCK THE BACK CRYPT DOOR? TOO LATE.',
    ];
    let msgIndex = 0;
    let charIndex = 0;
    let currentMsg = messages[0];

    typingTimerRef.current = setInterval(() => {
      if (charIndex < currentMsg.length) {
        setTypedMessage(currentMsg.slice(0, charIndex + 1));
        charIndex++;
      } else {
        setTimeout(() => {
          charIndex = 0;
          msgIndex = (msgIndex + 1) % messages.length;
          currentMsg = messages[msgIndex];
        }, 2500);
      }
    }, 75);

    return () => {
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    };
  }, [activeCurses]);

  // 4. Glitch Popups Spawner with mobile-safe coordinates
  useEffect(() => {
    if (!activeCurses.has('glitchPopups')) return;

    const popupTemplates = [
      {
        title: 'FATAL PUMPKIN EXCEPTION',
        message: 'Your system ran out of candy corn memory. Please insert chocolate in USB Drive A:',
        icon: '🎃',
      },
      {
        title: 'POLTERGEIST SERVICE ALERT',
        message: 'Ghost 0x80004005 is reorganizing your desktop icons by spookiness level.',
        icon: '👻',
      },
      {
        title: 'BAT OVERHEATING DETECTED',
        message: 'Too many nocturnal flying mammals in the cooling vent. Please fan with garlic.',
        icon: '🦇',
      },
      {
        title: 'TRICK_OR_TREAT.DLL NOT FOUND',
        message: 'Click OK to surrender your Halloween stash or Cancel to turn into a black cat.',
        icon: '🍬',
      },
      {
        title: 'SPECTRAL CHAIN VIBRATION',
        message: 'High ghost frequency detected. Chains rattling at 440 Hz.',
        icon: '⛓️',
      },
    ];

    const timer = setInterval(() => {
      if (popups.length < 5) {
        const item = popupTemplates[Math.floor(Math.random() * popupTemplates.length)];
        const screenW = window.innerWidth;
        const screenH = window.innerHeight;

        const maxLeft = Math.max(20, screenW - 340);
        const maxTop = Math.max(60, screenH - 240);

        const newPopup: GlitchPopupData = {
          id: `popup-${Date.now()}-${Math.random()}`,
          title: item.title,
          message: item.message,
          icon: item.icon,
          x: Math.max(10, Math.floor(Math.random() * maxLeft)),
          y: Math.max(60, Math.floor(Math.random() * maxTop)),
        };
        onAddPopup(newPopup);
        sound.playGlitch();
      }
    }, 4500);

    return () => clearInterval(timer);
  }, [activeCurses, popups.length, onAddPopup]);

  return (
    <>
      {/* 1. Ectoplasm CRT Scanlines and Dripping Filter */}
      {activeCurses.has('ectoplasm') && (
        <>
          <div className="crt-overlay pointer-events-none fixed inset-0 z-[9990]" />
          <div className="pointer-events-none fixed top-0 left-0 right-0 h-8 bg-gradient-to-b from-emerald-500/30 to-transparent z-[9991] flex justify-around">
            {Array.from({ length: 16 }).map((_, i) => (
              <div
                key={i}
                className="w-4 bg-emerald-500/50 rounded-b-full animate-melt"
                style={{
                  height: `${20 + (i % 5) * 12}px`,
                  animationDelay: `${(i % 4) * 0.4}s`,
                }}
              />
            ))}
          </div>
        </>
      )}

      {/* 2. Spooky Cursor Droplets */}
      {slimeDrops.map((drop) => (
        <div
          key={drop.id}
          className="pointer-events-none fixed z-[9995] transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2 select-none"
          style={{
            left: `${drop.x}px`,
            top: `${drop.y}px`,
            fontSize: `${drop.size}px`,
            filter: `drop-shadow(0 0 6px ${drop.color})`,
          }}
        >
          {drop.emoji}
        </div>
      ))}

      {/* 3. Floating Cute Ghosts (with Rainbow glow if unlocked) */}
      {ghosts.map((ghost) => (
        <div
          key={ghost.id}
          className="pointer-events-none fixed z-[9992] transition-transform select-none flex flex-col items-center animate-ghost-float"
          style={{
            left: `${ghost.x}px`,
            top: `${ghost.y}px`,
            transform: `scale(${ghost.scale}) scaleX(${ghost.direction})`,
          }}
        >
          <div
            className={`text-4xl transition-transform ${
              isNeonUnlocked
                ? 'drop-shadow-[0_0_15px_rgba(236,72,153,0.9)] animate-pulse hue-rotate-90'
                : 'drop-shadow-[0_0_12px_rgba(255,255,255,0.7)]'
            }`}
          >
            {ghost.emoji}
          </div>
          <div
            className="mt-1 px-2.5 py-1 bg-zinc-950/90 border border-orange-500/60 rounded text-[11px] font-mono-retro text-orange-300 shadow-lg whitespace-nowrap"
            style={{ transform: `scaleX(${ghost.direction})` }}
          >
            {ghost.saying}
          </div>
        </div>
      ))}

      {/* 4. Phantom Typewriter Terminal bar at bottom */}
      {showTypewriter && (
        <div className="fixed bottom-14 left-3 right-3 sm:left-1/4 sm:right-1/4 z-[9994] pointer-events-none">
          <div className="bg-zinc-950/95 border-2 border-emerald-500 rounded-lg p-3 shadow-[0_0_25px_rgba(16,185,129,0.35)] backdrop-blur-md">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-semibold mb-1">
              <Terminal className="w-3.5 h-3.5 animate-pulse" />
              <span>GHOST_POLTERGEIST_SHELL // PID: 0x666</span>
            </div>
            <div className="text-emerald-300 font-mono text-xs sm:text-sm tracking-wide">
              {typedMessage}
              <span className="inline-block w-2 h-4 bg-emerald-400 ml-1 animate-pulse" />
            </div>
          </div>
        </div>
      )}

      {/* 5. Glitch Retro Warning Popups (Responsive Max-Width) */}
      {popups.map((popup) => (
        <div
          key={popup.id}
          className="fixed z-[9996] w-[88vw] max-w-[340px] sm:max-w-sm bg-zinc-900 border-2 border-orange-500/90 shadow-[0_10px_30px_rgba(0,0,0,0.85),0_0_20px_rgba(249,115,22,0.3)] rounded"
          style={{ left: `${popup.x}px`, top: `${popup.y}px` }}
        >
          <div className="flex items-center justify-between bg-gradient-to-r from-orange-600 to-amber-700 px-3 py-1.5 text-zinc-950 font-bold text-xs select-none">
            <div className="flex items-center gap-1.5 truncate">
              <span>{popup.icon}</span>
              <span className="tracking-wide uppercase truncate">{popup.title}</span>
            </div>
            <button
              onClick={() => {
                sound.playGlitch();
                onClosePopup(popup.id);
              }}
              className="hover:bg-orange-800 text-zinc-950 px-1.5 py-0.5 rounded text-xs font-black transition-colors shrink-0"
              title="Dismiss warning"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="p-3.5 bg-zinc-950/95 text-zinc-200">
            <div className="flex items-start gap-2.5">
              <div className="text-2xl p-1 bg-orange-950/50 border border-orange-800/60 rounded shrink-0">
                {popup.icon}
              </div>
              <div className="flex-1">
                <p className="text-xs leading-relaxed font-mono-retro text-zinc-300">
                  {popup.message}
                </p>
              </div>
            </div>
            <div className="mt-3.5 flex justify-end gap-2">
              <button
                onClick={() => {
                  sound.playEvilLaugh();
                  onClosePopup(popup.id);
                }}
                className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded text-xs font-mono text-zinc-300 transition-colors"
              >
                Trick
              </button>
              <button
                onClick={() => {
                  sound.playCandyChime();
                  onClosePopup(popup.id);
                }}
                className="px-2.5 py-1 bg-orange-600 hover:bg-orange-500 text-zinc-950 font-bold rounded text-xs transition-colors flex items-center gap-1 shadow-sm"
              >
                🍬 Give Treat
              </button>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};
