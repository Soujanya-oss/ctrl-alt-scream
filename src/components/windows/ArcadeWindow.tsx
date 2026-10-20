import React, { useState, useEffect, useRef } from 'react';
import { sound } from '../../utils/soundEngine';
import confetti from 'canvas-confetti';
import { Trophy, ShoppingBag, Gamepad2, Play, RotateCcw, Sparkles, Check } from 'lucide-react';

interface ArcadeWindowProps {
  candies: number;
  onAddCandies: (amount: number) => void;
  unlockedItems: Set<string>;
  onUnlockItem: (itemId: string, cost: number) => void;
  onTriggerBSOD?: () => void;
}

export const ArcadeWindow: React.FC<ArcadeWindowProps> = ({
  candies,
  onAddCandies,
  unlockedItems,
  onUnlockItem,
  onTriggerBSOD,
}) => {
  const [activeTab, setActiveTab] = useState<'whack' | 'cauldron' | 'shop'>('whack');

  // ==================== GAME 1: WHACK-A-GHOST ====================
  const [whackActive, setWhackActive] = useState(false);
  const [whackScore, setWhackScore] = useState(0);
  const [whackTimeLeft, setWhackTimeLeft] = useState(30);
  const [ghostHoles, setGhostHoles] = useState<number[]>([]); // which holes have ghosts
  const [combo, setCombo] = useState(1);

  useEffect(() => {
    if (!whackActive) return;

    const timer = setInterval(() => {
      setWhackTimeLeft((prev) => {
        if (prev <= 1) {
          setWhackActive(false);
          // Award candies at end
          const earned = Math.max(10, Math.floor(whackScore / 5));
          onAddCandies(earned);
          sound.playCandyChime();
          try {
            confetti({ particleCount: 30, spread: 60, origin: { y: 0.7 } });
          } catch {}
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [whackActive, whackScore, onAddCandies]);

  // Ghost pop-up spawner
  useEffect(() => {
    if (!whackActive) {
      setGhostHoles([]);
      return;
    }

    const interval = setInterval(() => {
      // Pick 1 to 2 random holes out of 9
      const numGhosts = Math.random() > 0.6 ? 2 : 1;
      const newHoles: number[] = [];
      while (newHoles.length < numGhosts) {
        const rand = Math.floor(Math.random() * 9);
        if (!newHoles.includes(rand)) newHoles.push(rand);
      }
      setGhostHoles(newHoles);
    }, 850);

    return () => clearInterval(interval);
  }, [whackActive]);

  const handleWhack = (index: number) => {
    if (!whackActive || !ghostHoles.includes(index)) return;

    if (combo >= 4) {
      sound.playWitchCackle();
    } else {
      sound.playArcadeZap();
    }
    const pointsGained = 50 * combo;
    setWhackScore((s) => s + pointsGained);
    setCombo((c) => Math.min(c + 1, 5));
    // Remove clicked ghost
    setGhostHoles((holes) => holes.filter((h) => h !== index));
  };

  const startWhackGame = () => {
    setWhackScore(0);
    setWhackTimeLeft(30);
    setCombo(1);
    setWhackActive(true);
    sound.playEvilLaugh();
  };

  // ==================== GAME 2: CAULDRON CANDY CATCH ====================
  const [cauldronActive, setCauldronActive] = useState(false);
  const [cauldronScore, setCauldronScore] = useState(0);
  const [cauldronPos, setCauldronPos] = useState(50); // percentage 0-100
  const [cauldronItems, setCauldronItems] = useState<
    Array<{ id: number; x: number; y: number; type: 'candy' | 'chocolate' | 'spider' }>
  >([]);
  const [cauldronLives, setCauldronLives] = useState(3);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const nextItemId = useRef(0);

  // Keyboard controls for Cauldron Catch
  useEffect(() => {
    if (!cauldronActive) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        setCauldronPos((p) => Math.max(8, p - 8));
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        setCauldronPos((p) => Math.min(92, p + 8));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cauldronActive]);

  const startCauldronGame = () => {
    setCauldronScore(0);
    setCauldronLives(3);
    setCauldronItems([]);
    setCauldronActive(true);
    sound.playGhostMoan();
  };

  // Falling items ticker
  useEffect(() => {
    if (!cauldronActive) return;

    const gameLoop = setInterval(() => {
      // Randomly spawn new falling item
      if (Math.random() < 0.22) {
        const randType = Math.random();
        const type = randType > 0.45 ? 'candy' : randType > 0.2 ? 'chocolate' : 'spider';
        setCauldronItems((items) => [
          ...items,
          {
            id: ++nextItemId.current,
            x: 10 + Math.random() * 80, // percentage
            y: 0,
            type,
          },
        ]);
      }

      // Move items down & detect collision
      setCauldronItems((items) => {
        const next: typeof items = [];
        for (const item of items) {
          const nextY = item.y + 4.5;
          // Check collision with cauldron at bottom (y ~ 85%)
          if (nextY >= 82 && nextY <= 94) {
            const distance = Math.abs(item.x - cauldronPos);
            if (distance < 14) {
              // Caught item!
              if (item.type === 'spider') {
                sound.playSlimeSquish();
                setCauldronLives((l) => {
                  if (l <= 1) {
                    setCauldronActive(false);
                    onAddCandies(Math.max(5, Math.floor(cauldronScore / 4)));
                    return 0;
                  }
                  return l - 1;
                });
              } else {
                sound.playCandyChime();
                const bonus = item.type === 'chocolate' ? 30 : 15;
                setCauldronScore((s) => s + bonus);
              }
              continue; // don't add to next (consumed)
            }
          }

          if (nextY < 100) {
            next.push({ ...item, y: nextY });
          }
        }
        return next;
      });
    }, 50);

    return () => clearInterval(gameLoop);
  }, [cauldronActive, cauldronPos, cauldronScore, onAddCandies]);

  // Handle cauldron movement by mouse
  const handleMouseMoveArea = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cauldronActive || !gameAreaRef.current) return;
    const rect = gameAreaRef.current.getBoundingClientRect();
    const relativeX = ((e.clientX - rect.left) / rect.width) * 100;
    setCauldronPos(Math.max(8, Math.min(92, relativeX)));
  };

  // ==================== CANDY EXCHANGE SHOP ====================
  const SHOP_CATALOG = [
    {
      id: 'bsod_prank',
      name: 'Blue Scream of Death (BSOD)',
      cost: 40,
      icon: '💻',
      description: 'Unlock a full-screen retro Windows BSOD prank loaded with Halloween jokes.',
      action: 'bsod',
    },
    {
      id: 'neon_ghosts',
      name: 'Prismatic Rainbow Ghosts',
      cost: 60,
      icon: '🌈',
      description: 'Make all floating ghosts shimmer with vibrant spectral rave colors.',
    },
    {
      id: 'soundboard_deluxe',
      name: 'Crypt Keeper Voice Pack',
      cost: 80,
      icon: '🎙️',
      description: 'Unlocks exclusive retro organ chords and thunderous echoes in Soundboard.',
    },
    {
      id: 'exorcist_badge',
      name: 'Grand Exorcist Trophy',
      cost: 120,
      icon: '🏆',
      description: 'A glowing permanent gold emblem displayed on your taskbar and desktop.',
    },
    {
      id: 'virtual_snickers',
      name: 'King-Size Virtual Chocolate Bar',
      cost: 200,
      icon: '🍫',
      description: 'The ultimate Halloween bragging right. Completely calorie-free.',
    },
  ];

  return (
    <div className="p-4 sm:p-5 flex flex-col gap-4 text-zinc-100 max-w-4xl mx-auto">
      {/* Top candy wallet & Navigation tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 bg-zinc-900 border border-zinc-800 rounded-xl">
        <div className="flex items-center gap-1 p-1 bg-zinc-950 rounded-lg border border-zinc-800 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('whack')}
            className={`px-3 py-1.5 rounded text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'whack'
                ? 'bg-orange-600 text-zinc-950 shadow'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            Whack-A-Ghost
          </button>
          <button
            onClick={() => setActiveTab('cauldron')}
            className={`px-3 py-1.5 rounded text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'cauldron'
                ? 'bg-orange-600 text-zinc-950 shadow'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span>🍲</span>
            Cauldron Catch
          </button>
          <button
            onClick={() => setActiveTab('shop')}
            className={`px-3 py-1.5 rounded text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'shop'
                ? 'bg-orange-600 text-zinc-950 shadow'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Candy Altar (Shop)
          </button>
        </div>

        {/* Live Candy Currency Counter */}
        <div className="flex items-center gap-2 bg-orange-950/60 border border-orange-500/50 px-4 py-1.5 rounded-lg shadow-inner">
          <span className="text-xl animate-bounce">🍬</span>
          <div>
            <div className="text-[10px] font-mono uppercase text-orange-300 font-bold">
              Soul Candy Bank
            </div>
            <div className="text-base font-black text-orange-400 font-mono tracking-wider">
              {candies} Candies
            </div>
          </div>
        </div>
      </div>

      {/* ================= TAB 1: WHACK A GHOST ================= */}
      {activeTab === 'whack' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between bg-zinc-900/90 p-3 rounded-lg border border-zinc-800 text-xs">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-zinc-400">Score: </span>
                <span className="font-bold text-orange-400 font-mono text-sm">
                  {whackScore} pts
                </span>
              </div>
              <div>
                <span className="text-zinc-400">Time Left: </span>
                <span className="font-bold text-amber-400 font-mono text-sm">
                  {whackTimeLeft}s
                </span>
              </div>
              <div>
                <span className="text-zinc-400">Combo: </span>
                <span className="font-bold text-emerald-400 font-mono text-sm">
                  {combo}x
                </span>
              </div>
            </div>

            {!whackActive ? (
              <button
                onClick={startWhackGame}
                className="px-4 py-1.5 bg-orange-600 hover:bg-orange-500 text-zinc-950 font-extrabold rounded-lg flex items-center gap-1.5 shadow-[0_0_15px_rgba(249,115,22,0.4)] transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-zinc-950" />
                START GAME
              </button>
            ) : (
              <button
                onClick={() => setWhackActive(false)}
                className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-xs"
              >
                End Early
              </button>
            )}
          </div>

          {/* 3x3 Graveyard Grid */}
          <div className="grid grid-cols-3 gap-3 bg-zinc-950 p-4 rounded-xl border border-zinc-800 relative select-none">
            {Array.from({ length: 9 }).map((_, index) => {
              const hasGhost = ghostHoles.includes(index);
              return (
                <div
                  key={index}
                  onClick={() => handleWhack(index)}
                  className={`h-24 sm:h-28 rounded-xl border-2 flex flex-col items-center justify-center relative cursor-pointer overflow-hidden transition-all ${
                    hasGhost
                      ? 'bg-purple-950/40 border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.3)] transform -translate-y-1'
                      : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="text-xs text-zinc-600 font-mono absolute top-2 left-2">
                    🪦 #{index + 1}
                  </div>

                  {hasGhost ? (
                    <div className="flex flex-col items-center animate-bounce">
                      <span className="text-4xl drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
                        👻
                      </span>
                      <span className="text-[10px] font-mono font-bold text-orange-400 uppercase mt-0.5">
                        EXORCISE ME!
                      </span>
                    </div>
                  ) : (
                    <div className="text-2xl opacity-20 filter grayscale">
                      🎃
                    </div>
                  )}
                </div>
              );
            })}

            {!whackActive && (
              <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-xs flex flex-col items-center justify-center p-4 rounded-xl">
                <span className="text-4xl mb-2">👻⚰️</span>
                <h3 className="font-bold text-orange-400 text-base">
                  Graveyard Ghost Exorcist
                </h3>
                <p className="text-xs text-zinc-400 text-center max-w-sm mt-1 mb-4">
                  Whack popping ghosts before they vanish. Earn Soul Candies to buy cursed prank
                  items in the Candy Altar!
                </p>
                <button
                  onClick={startWhackGame}
                  className="px-6 py-2.5 bg-orange-600 hover:bg-orange-500 text-zinc-950 font-black rounded-xl text-sm shadow-[0_0_20px_rgba(249,115,22,0.5)] flex items-center gap-2 transform hover:scale-105 transition-all"
                >
                  <Play className="w-4 h-4 fill-zinc-950" />
                  START EXORCISING (30s)
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 2: CAULDRON CATCH ================= */}
      {activeTab === 'cauldron' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between bg-zinc-900/90 p-3 rounded-lg border border-zinc-800 text-xs">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-zinc-400">Score: </span>
                <span className="font-bold text-orange-400 font-mono text-sm">
                  {cauldronScore}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-zinc-400">Lives: </span>
                {Array.from({ length: 3 }).map((_, i) => (
                  <span
                    key={i}
                    className={`text-sm ${
                      i < cauldronLives ? 'text-red-500' : 'text-zinc-600 opacity-40'
                    }`}
                  >
                    ❤️
                  </span>
                ))}
              </div>
            </div>

            {!cauldronActive ? (
              <button
                onClick={startCauldronGame}
                className="px-4 py-1.5 bg-orange-600 hover:bg-orange-500 text-zinc-950 font-extrabold rounded-lg flex items-center gap-1.5 shadow transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-zinc-950" />
                PLAY CAULDRON
              </button>
            ) : (
              <div className="text-[11px] font-mono text-zinc-400">
                Move mouse to catch candy!
              </div>
            )}
          </div>

          {/* Game Canvas Area */}
          <div
            ref={gameAreaRef}
            onMouseMove={handleMouseMoveArea}
            className="h-72 bg-gradient-to-b from-purple-950/30 via-zinc-950 to-zinc-950 border-2 border-zinc-800 rounded-xl relative overflow-hidden select-none cursor-crosshair"
          >
            {/* Falling items */}
            {cauldronItems.map((item) => (
              <div
                key={item.id}
                className="absolute text-2xl transform -translate-x-1/2 -translate-y-1/2 pointer-events-none drop-shadow-md"
                style={{ left: `${item.x}%`, top: `${item.y}%` }}
              >
                {item.type === 'candy'
                  ? '🍬'
                  : item.type === 'chocolate'
                  ? '🍫'
                  : '🕷️'}
              </div>
            ))}

            {/* Cauldron Player */}
            <div
              className="absolute bottom-3 text-4xl transform -translate-x-1/2 transition-transform duration-75 select-none drop-shadow-[0_0_15px_rgba(249,115,22,0.5)]"
              style={{ left: `${cauldronPos}%` }}
            >
              🍲
            </div>

            {/* Touch controls for mobile / responsive */}
            <div className="absolute bottom-2 left-2 right-2 flex justify-between pointer-events-auto sm:hidden">
              <button
                onClick={() => setCauldronPos((p) => Math.max(10, p - 15))}
                className="p-3 bg-zinc-800/80 rounded-lg text-white font-bold"
              >
                ⬅️
              </button>
              <button
                onClick={() => setCauldronPos((p) => Math.min(90, p + 15))}
                className="p-3 bg-zinc-800/80 rounded-lg text-white font-bold"
              >
                ➡️
              </button>
            </div>

            {!cauldronActive && (
              <div className="absolute inset-0 bg-zinc-950/85 backdrop-blur-xs flex flex-col items-center justify-center p-4">
                <span className="text-4xl mb-2">🍲🍬✨</span>
                <h3 className="font-bold text-orange-400 text-base">
                  Cauldron Candy Catch
                </h3>
                <p className="text-xs text-zinc-400 text-center max-w-sm mt-1 mb-4">
                  Move your witch's cauldron to catch falling chocolates and candies. Avoid falling
                  creepy spiders!
                </p>
                <button
                  onClick={startCauldronGame}
                  className="px-6 py-2.5 bg-orange-600 hover:bg-orange-500 text-zinc-950 font-black rounded-xl text-sm shadow-[0_0_20px_rgba(249,115,22,0.5)] flex items-center gap-2 transform hover:scale-105 transition-all"
                >
                  <Play className="w-4 h-4 fill-zinc-950" />
                  START CATCHING
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 3: CANDY SHOP / EXCHANGE ALTAR ================= */}
      {activeTab === 'shop' && (
        <div className="flex flex-col gap-3">
          <div className="p-3 bg-gradient-to-r from-orange-950/40 to-zinc-900 border border-orange-500/20 rounded-xl text-xs text-zinc-300">
            <span className="font-bold text-orange-400">🍬 Halloween Exchange Altar: </span>
            Redeem the soul candies you earned in the arcade for funny prank utilities and trophies!
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SHOP_CATALOG.map((item) => {
              const isUnlocked = unlockedItems.has(item.id);
              const canAfford = candies >= item.cost;

              return (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-xl border flex flex-col justify-between ${
                    isUnlocked
                      ? 'bg-zinc-900/60 border-emerald-500/40'
                      : canAfford
                      ? 'bg-zinc-900 border-zinc-700 hover:border-orange-500/60'
                      : 'bg-zinc-950 border-zinc-800 opacity-70'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl p-2 bg-zinc-950 rounded-lg border border-zinc-800">
                        {item.icon}
                      </span>
                      <div>
                        <h4 className="font-bold text-sm text-zinc-100">{item.name}</h4>
                        <span className="text-xs font-mono text-orange-400 font-bold">
                          {item.cost} Candies 🍬
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-zinc-400 mt-2.5 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-3.5 pt-2.5 border-t border-zinc-800/80 flex items-center justify-between">
                    {isUnlocked ? (
                      <>
                        <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> UNLOCKED
                        </span>
                        {item.action === 'bsod' && onTriggerBSOD && (
                          <button
                            onClick={onTriggerBSOD}
                            className="px-2.5 py-1 bg-blue-700 hover:bg-blue-600 text-white rounded text-xs font-mono font-bold transition-colors"
                          >
                            Launch BSOD Prank
                          </button>
                        )}
                      </>
                    ) : (
                      <button
                        disabled={!canAfford}
                        onClick={() => {
                          onUnlockItem(item.id, item.cost);
                          sound.playCandyChime();
                          try {
                            confetti({ particleCount: 25, spread: 50 });
                          } catch {}
                        }}
                        className={`w-full py-1.5 px-3 rounded text-xs font-bold font-mono transition-all ${
                          canAfford
                            ? 'bg-orange-600 hover:bg-orange-500 text-zinc-950 shadow'
                            : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                        }`}
                      >
                        {canAfford ? 'EXCHANGE FOR CANDY 🍬' : 'NEED MORE CANDY'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
