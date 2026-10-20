import React from 'react';
import { CurseId, CurseConfig } from '../../types';
import { sound } from '../../utils/soundEngine';
import {
  Flame,
  Volume2,
  Sparkles,
  Zap,
  Check,
  RotateCcw,
  Sliders,
} from 'lucide-react';

interface CurseControlWindowProps {
  activeCurses: Set<CurseId>;
  onToggleCurse: (id: CurseId) => void;
  onActivateAll: () => void;
  onClearAll: () => void;
}

export const CURSE_LIST: CurseConfig[] = [
  {
    id: 'gravity',
    name: 'Gravity Inversion',
    category: 'Physics',
    description: 'Forces all desktop windows and icons to tumble upside down or sink to the abyss.',
    icon: '🙃',
    dangerLevel: 'Chaos',
    soundFx: 'Creak',
  },
  {
    id: 'ghosts',
    name: 'Ghost Jumpscares',
    category: 'Visual',
    description: 'Releases mischievous 8-bit ghosts that fly across your screen begging for sweets.',
    icon: '👻',
    dangerLevel: 'Spooky',
    soundFx: 'Ghost Moan',
  },
  {
    id: 'spookyCursor',
    name: 'Spooky Cursor Slime',
    category: 'Visual',
    description: 'Leaves a gooey trail of glowing pumpkins, candy corn, and ectoplasm behind your mouse.',
    icon: '🎃',
    dangerLevel: 'Silly',
    soundFx: 'Slime Squish',
  },
  {
    id: 'ectoplasm',
    name: 'Ectoplasm Melt Mode',
    category: 'Visual',
    description: 'Drips green slime from the screen ceiling with vintage CRT phosphor scanlines.',
    icon: '🧪',
    dangerLevel: 'Spooky',
    soundFx: 'Slime Squish',
  },
  {
    id: 'phantomTyping',
    name: 'Phantom Typewriter',
    category: 'System',
    description: 'A cyber-poltergeist hijacks an on-screen console to type hilarious candy demands.',
    icon: '⌨️',
    dangerLevel: 'Silly',
    soundFx: 'Glitch',
  },
  {
    id: 'poltergeist',
    name: 'Poltergeist Jitter',
    category: 'Physics',
    description: 'Haunted vibrations that make windows tremble and shiver as if possessed.',
    icon: '🪟',
    dangerLevel: 'Spooky',
    soundFx: 'Thunder',
  },
  {
    id: 'glitchPopups',
    name: 'Retro Glitch Alerts',
    category: 'System',
    description: 'Spawns nostalgic 90s error dialogs warning of excessive candy consumption.',
    icon: '⚠️',
    dangerLevel: 'Chaos',
    soundFx: 'Glitch',
  },
  {
    id: 'whispers',
    name: 'Eerie Audio Triggers',
    category: 'Audio',
    description: 'Synthesizes ghostly whispering wind whenever the mouse moves or clicks.',
    icon: '👂',
    dangerLevel: 'Spooky',
    soundFx: 'Whisper',
  },
];

export const CurseControlWindow: React.FC<CurseControlWindowProps> = ({
  activeCurses,
  onToggleCurse,
  onActivateAll,
  onClearAll,
}) => {
  const playPreviewSound = (fx: string) => {
    switch (fx) {
      case 'Ghost Moan':
        sound.playGhostMoan();
        break;
      case 'Slime Squish':
        sound.playSlimeSquish();
        break;
      case 'Whisper':
        sound.playWhisper();
        break;
      case 'Glitch':
        sound.playGlitch();
        break;
      case 'Creak':
        sound.playOrganChord();
        break;
      case 'Thunder':
        sound.playChainsRattle();
        break;
      default:
        sound.playCandyChime();
    }
  };

  const allActive = CURSE_LIST.every((c) => activeCurses.has(c.id));

  return (
    <div className="p-4 sm:p-5 flex flex-col gap-5 text-zinc-100 max-w-4xl mx-auto">
      {/* Top Banner & Quick Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-r from-orange-950/60 via-zinc-900 to-purple-950/50 border border-orange-500/30">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🔮</span>
            <h2 className="text-lg font-bold tracking-wide text-orange-400">
              Possession Curse Registry
            </h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1 max-w-lg">
            Toggle individual paranormal phenomena or arm the complete Halloween chaos protocol.
            Safe, non-destructive, and 100% reversible with the Panic Button!
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => {
              if (allActive) {
                onClearAll();
                sound.playPumpkinScream();
              } else {
                onActivateAll();
                sound.playEvilLaugh();
              }
            }}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              allActive
                ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg'
                : 'bg-orange-600 hover:bg-orange-500 text-zinc-950 shadow-[0_0_15px_rgba(249,115,22,0.4)]'
            }`}
          >
            <Zap className="w-4 h-4" />
            {allActive ? 'DISARM ALL CURSES' : 'MAXIMUM CHAOS (ALL ON)'}
          </button>
        </div>
      </div>

      {/* Grid of Curses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {CURSE_LIST.map((curse) => {
          const isActive = activeCurses.has(curse.id);

          return (
            <div
              key={curse.id}
              onClick={() => {
                onToggleCurse(curse.id);
                if (!isActive) {
                  playPreviewSound(curse.soundFx);
                } else {
                  sound.playGlitch();
                }
              }}
              className={`group relative p-4 rounded-xl border-2 transition-all cursor-pointer select-none flex flex-col justify-between ${
                isActive
                  ? 'bg-orange-950/30 border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.25)]'
                  : 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-850'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2 bg-zinc-950/70 border border-zinc-800 rounded-lg group-hover:scale-110 transition-transform">
                      {curse.icon}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3
                          className={`font-bold text-sm tracking-wide ${
                            isActive ? 'text-orange-400' : 'text-zinc-200'
                          }`}
                        >
                          {curse.name}
                        </h3>
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                            curse.dangerLevel === 'Chaos'
                              ? 'bg-red-950/80 text-red-400 border border-red-800'
                              : curse.dangerLevel === 'Spooky'
                              ? 'bg-purple-950/80 text-purple-400 border border-purple-800'
                              : 'bg-amber-950/80 text-amber-400 border border-amber-800'
                          }`}
                        >
                          {curse.dangerLevel}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-zinc-500">
                        Class: {curse.category}
                      </span>
                    </div>
                  </div>

                  {/* Toggle switch visual */}
                  <div
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                      isActive ? 'bg-orange-600' : 'bg-zinc-700'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        isActive ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </div>
                </div>

                <p className="text-xs text-zinc-400 mt-3 leading-relaxed">
                  {curse.description}
                </p>
              </div>

              {/* Card Footer with Audio Preview */}
              <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1">
                  {isActive ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> HAUNTING ACTIVE
                    </span>
                  ) : (
                    <span className="text-zinc-500">Dormant</span>
                  )}
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    playPreviewSound(curse.soundFx);
                  }}
                  className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 rounded text-zinc-300 hover:text-white flex items-center gap-1 text-[11px] font-mono transition-colors"
                  title="Test audio trigger"
                >
                  <Volume2 className="w-3 h-3 text-orange-400" />
                  <span>Preview Audio</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
