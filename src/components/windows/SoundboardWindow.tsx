import React, { useState } from 'react';
import { sound } from '../../utils/soundEngine';
import { Volume2, VolumeX, Play, Music, Radio, Sparkles } from 'lucide-react';

export const SoundboardWindow: React.FC = () => {
  const [isMuted, setIsMuted] = useState(sound.getMuted());
  const [activeSound, setActiveSound] = useState<string | null>(null);
  const [ambientActive, setAmbientActive] = useState(sound.getIsAmbientPlaying());

  const triggerSound = (name: string, fn: () => void) => {
    setActiveSound(name);
    fn();
    setTimeout(() => {
      setActiveSound((current) => (current === name ? null : current));
    }, 450);
  };

  const handleToggleAmbient = () => {
    const active = sound.toggleAmbientDrone();
    setAmbientActive(active);
  };

  const soundList = [
    {
      id: 'organ_chord',
      name: 'Gothic Pipe Organ',
      emoji: '🎹',
      desc: 'Bach D-Minor Phantom of the Opera chords',
      color: 'from-purple-900 to-zinc-900',
      fn: () => sound.playOrganChord(),
    },
    {
      id: 'heartbeat',
      name: 'Panicked Heartbeat',
      emoji: '💓',
      desc: 'Sub-bass visceral thumping in the dark',
      color: 'from-red-950 to-rose-900',
      fn: () => sound.playHeartbeat(),
    },
    {
      id: 'chains',
      name: 'Spectral Chains Rattle',
      emoji: '⛓️',
      desc: 'Clinking iron chains dragging across dungeon floor',
      color: 'from-slate-700 to-zinc-800',
      fn: () => sound.playChainsRattle(),
    },
    {
      id: 'cat_hiss',
      name: 'Black Cat Screech',
      emoji: '🐈‍⬛',
      desc: 'Sharp hissing arch-back feline shriek',
      color: 'from-amber-800 to-orange-950',
      fn: () => sound.playCatHiss(),
    },
    {
      id: 'clock_chime',
      name: 'Midnight Clock Gong',
      emoji: '🕰️',
      desc: 'Heavy grandfather clock tolling 12 o\'clock',
      color: 'from-yellow-700 to-zinc-800',
      fn: () => sound.playClockChime(),
    },
    {
      id: 'witch_cackle',
      name: 'Shrill Witch Cackle',
      emoji: '🧙‍♀️',
      desc: 'High-pitched manic cackle in the woods',
      color: 'from-emerald-800 to-teal-950',
      fn: () => sound.playWitchCackle(),
    },
    {
      id: 'zombie_groan',
      name: 'Guttural Zombie Groan',
      emoji: '🧟',
      desc: 'Deep resonant undead vocalization',
      color: 'from-lime-900 to-zinc-900',
      fn: () => sound.playZombieGroan(),
    },
    {
      id: 'pumpkin_scream',
      name: 'Screaming Pumpkin Panic',
      emoji: '🎃',
      desc: 'High-pitch cartoon panic scream + holy chimes',
      color: 'from-orange-600 to-amber-600',
      fn: () => sound.playPumpkinScream(),
    },
    {
      id: 'evil_laugh',
      name: 'Evil Poltergeist Laugh',
      emoji: '😈',
      desc: 'Chilling 5-stage resonant cackle',
      color: 'from-red-600 to-purple-700',
      fn: () => sound.playEvilLaugh(),
    },
    {
      id: 'ghost_moan',
      name: 'Theremin Ghost Moan',
      emoji: '👻',
      desc: 'Ethereal spectral frequency modulation',
      color: 'from-purple-600 to-indigo-700',
      fn: () => sound.playGhostMoan(),
    },
    {
      id: 'whisper',
      name: 'Whispering Ether Wind',
      emoji: '💨',
      desc: 'Filtered autumn breeze through keyhole',
      color: 'from-teal-600 to-cyan-700',
      fn: () => sound.playWhisper(),
    },
    {
      id: 'slime',
      name: 'Ectoplasm Squish',
      emoji: '🧪',
      desc: 'Gooey visceral slime droplet',
      color: 'from-emerald-600 to-lime-600',
      fn: () => sound.playSlimeSquish(),
    },
    {
      id: 'creak',
      name: 'Creaking Crypt Door',
      emoji: '🚪',
      desc: 'Heavy rusty iron hinge groan',
      color: 'from-amber-700 to-yellow-800',
      fn: () => sound.playCreak(),
    },
    {
      id: 'arcade_zap',
      name: '8-Bit Exorcist Laser',
      emoji: '⚡',
      desc: 'Square wave arcade ghost zapper',
      color: 'from-yellow-500 to-orange-500',
      fn: () => sound.playArcadeZap(),
    },
    {
      id: 'candy_chime',
      name: 'Trick-or-Treat Chime',
      emoji: '🍬',
      desc: 'Sweet golden arpeggio bell',
      color: 'from-pink-600 to-rose-600',
      fn: () => sound.playCandyChime(),
    },
    {
      id: 'thunder',
      name: 'Midnight Thunderclap',
      emoji: '⛈️',
      desc: 'Sub-bass rumble and lightning strike',
      color: 'from-blue-700 to-slate-800',
      fn: () => sound.playThunder(),
    },
    {
      id: 'glitch',
      name: 'Cyber Glitch Burst',
      emoji: '👾',
      desc: 'Retro 90s digital buffer underrun',
      color: 'from-fuchsia-600 to-purple-600',
      fn: () => sound.playGlitch(),
    },
  ];

  return (
    <div className="p-4 sm:p-5 flex flex-col gap-4 text-zinc-100 max-w-4xl mx-auto">
      {/* Top Bar with Ambient Drone Switch */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 bg-zinc-900 border border-zinc-800 rounded-xl">
        <div className="flex items-center gap-2.5">
          <Music className="w-5 h-5 text-orange-400" />
          <div>
            <h3 className="font-bold text-sm text-zinc-100">
              Crypt Sound Synthesizer (17 FX)
            </h3>
            <span className="text-[10px] font-mono text-zinc-500">
              Zero Latency // Pure Web Audio API
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Ambient Drone Mode */}
          <button
            onClick={handleToggleAmbient}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg border text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all ${
              ambientActive
                ? 'bg-purple-950/80 border-purple-500 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.4)] animate-pulse'
                : 'bg-zinc-800 hover:bg-zinc-750 border-zinc-700 text-zinc-300'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>{ambientActive ? 'AMBIENT DRONE: ON' : 'AMBIENT DRONE: OFF'}</span>
          </button>

          {/* Master Mute Toggle */}
          <button
            onClick={() => {
              const next = sound.toggleMute();
              setIsMuted(next);
            }}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
              isMuted
                ? 'bg-red-950/80 border-red-700 text-red-400'
                : 'bg-zinc-800 border-zinc-700 text-zinc-200 hover:text-white'
            }`}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-orange-400" />}
            <span>{isMuted ? 'MUTED' : 'AUDIO ON'}</span>
          </button>
        </div>
      </div>

      {/* Grid of Sound Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
        {soundList.map((item) => {
          const isPlaying = activeSound === item.name;

          return (
            <button
              key={item.id}
              onClick={() => triggerSound(item.name, item.fn)}
              className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all transform active:scale-95 group ${
                isPlaying
                  ? 'bg-gradient-to-r ' + item.color + ' border-white text-white shadow-lg scale-102'
                  : 'bg-zinc-900/90 border-zinc-800 hover:border-orange-500/50 hover:bg-zinc-850'
              }`}
            >
              <div className="flex items-start justify-between">
                <span className="text-2xl p-1.5 bg-zinc-950/60 rounded-lg border border-zinc-800/80">
                  {item.emoji}
                </span>
                <span
                  className={`p-1.5 rounded-full transition-transform ${
                    isPlaying ? 'bg-white/30 scale-125' : 'bg-zinc-800 group-hover:bg-orange-600'
                  }`}
                >
                  <Play className="w-3 h-3 fill-current" />
                </span>
              </div>

              <div className="mt-2.5">
                <div className="font-bold text-xs tracking-wide">{item.name}</div>
                <div className="text-[10px] text-zinc-400 mt-0.5 line-clamp-1">{item.desc}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
