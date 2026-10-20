export type CurseId =
  | 'gravity'
  | 'ghosts'
  | 'spookyCursor'
  | 'ectoplasm'
  | 'phantomTyping'
  | 'poltergeist'
  | 'glitchPopups'
  | 'whispers';

export interface CurseConfig {
  id: CurseId;
  name: string;
  category: 'Physics' | 'Visual' | 'Audio' | 'System';
  description: string;
  icon: string;
  dangerLevel: 'Silly' | 'Spooky' | 'Chaos' | 'Overdrive';
  soundFx: string;
}

export interface GhostItem {
  id: string;
  x: number;
  y: number;
  speed: number;
  direction: 1 | -1;
  emoji: string;
  saying: string;
  scale: number;
}

export interface SlimeDrop {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  emoji: string;
}

export interface GlitchPopupData {
  id: string;
  title: string;
  message: string;
  x: number;
  y: number;
  icon: string;
}

export interface DesktopWindow {
  id: string;
  title: string;
  icon: string;
  isOpen: boolean;
  isMinimized: boolean;
  zIndex: number;
  defaultPosition: { x: number; y: number; w: number; h: number };
}

export interface ShopItem {
  id: string;
  name: string;
  cost: number;
  icon: string;
  description: string;
  purchased: boolean;
}
