import React, { useState, useRef, useEffect } from 'react';
import { sound } from '../../utils/soundEngine';
import { Minus, Square, X } from 'lucide-react';

interface DesktopWindowFrameProps {
  id: string;
  title: string;
  icon: string;
  isOpen: boolean;
  isMinimized: boolean;
  zIndex: number;
  initialPos?: { x: number; y: number; w: number; h: number };
  isGravityActive?: boolean;
  isPoltergeistActive?: boolean;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  children: React.ReactNode;
}

export const DesktopWindowFrame: React.FC<DesktopWindowFrameProps> = ({
  id,
  title,
  icon,
  isOpen,
  isMinimized,
  zIndex,
  initialPos = { x: 30, y: 65, w: 760, h: 540 },
  isGravityActive = false,
  isPoltergeistActive = false,
  onFocus,
  onClose,
  onMinimize,
  children,
}) => {
  // Clamp initial pos to viewport
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
  const [position, setPosition] = useState({
    x: isMobile ? 8 : Math.max(10, Math.min(window.innerWidth - 300, initialPos.x)),
    y: isMobile ? 55 : Math.max(50, Math.min(window.innerHeight - 300, initialPos.y)),
  });
  const [isMaximized, setIsMaximized] = useState(false);
  const isDragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  // Handle window resize adjustments
  useEffect(() => {
    const handleResize = () => {
      setPosition((prev) => ({
        x: Math.max(4, Math.min(window.innerWidth - 120, prev.x)),
        y: Math.max(50, Math.min(window.innerHeight - 100, prev.y)),
      }));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isOpen || isMinimized) return null;

  // Mouse Drag Handlers
  const handleMouseDownHeader = (e: React.MouseEvent) => {
    if (isMaximized) return;
    onFocus();
    isDragging.current = true;
    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };

    const handleMouseMove = (ev: MouseEvent) => {
      if (!isDragging.current) return;
      const nextX = Math.max(4, Math.min(window.innerWidth - 100, ev.clientX - dragOffset.current.x));
      const nextY = Math.max(45, Math.min(window.innerHeight - 80, ev.clientY - dragOffset.current.y));
      setPosition({ x: nextX, y: nextY });
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Touch Drag Handlers for Mobile & Tablet
  const handleTouchStartHeader = (e: React.TouchEvent) => {
    if (isMaximized || e.touches.length === 0) return;
    onFocus();
    isDragging.current = true;
    const touch = e.touches[0];
    dragOffset.current = {
      x: touch.clientX - position.x,
      y: touch.clientY - position.y,
    };

    const handleTouchMove = (ev: TouchEvent) => {
      if (!isDragging.current || ev.touches.length === 0) return;
      const t = ev.touches[0];
      const nextX = Math.max(4, Math.min(window.innerWidth - 80, t.clientX - dragOffset.current.x));
      const nextY = Math.max(45, Math.min(window.innerHeight - 80, t.clientY - dragOffset.current.y));
      setPosition({ x: nextX, y: nextY });
    };

    const handleTouchEnd = () => {
      isDragging.current = false;
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };

    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
  };

  return (
    <div
      onClick={onFocus}
      style={{
        zIndex,
        ...(isMaximized || isMobile
          ? {
              left: isMobile ? '4px' : 0,
              top: isMobile ? '52px' : 0,
              width: isMobile ? 'calc(100vw - 8px)' : '100vw',
              height: isMobile ? 'calc(100vh - 102px)' : 'calc(100vh - 44px)',
            }
          : {
              left: `${position.x}px`,
              top: `${position.y}px`,
              width: `${Math.min(initialPos.w, window.innerWidth - 20)}px`,
              maxWidth: 'calc(100vw - 16px)',
            }),
      }}
      className={`fixed transition-transform duration-300 rounded-lg shadow-[0_15px_40px_rgba(0,0,0,0.85)] border-2 border-orange-500/70 bg-zinc-950 flex flex-col overflow-hidden ${
        isPoltergeistActive ? 'animate-poltergeist' : ''
      } ${
        isGravityActive
          ? 'rotate-6 translate-y-16 scale-95 origin-bottom-right transition-all duration-700'
          : ''
      }`}
    >
      {/* Retro OS Titlebar */}
      <div
        onMouseDown={handleMouseDownHeader}
        onTouchStart={handleTouchStartHeader}
        className="bg-gradient-to-r from-orange-600 via-amber-700 to-zinc-900 px-3 py-2 flex items-center justify-between cursor-move select-none border-b border-orange-400/40 touch-none"
      >
        <div className="flex items-center gap-2 text-zinc-950 font-bold text-xs tracking-wider">
          <span className="text-base">{icon}</span>
          <span className="truncate max-w-[170px] sm:max-w-md font-mono uppercase">
            {title}
          </span>
        </div>

        {/* Window Action Buttons */}
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => {
              sound.playGlitch();
              onMinimize();
            }}
            title="Minimize"
            className="w-5 h-5 bg-zinc-900 hover:bg-zinc-800 text-orange-400 border border-zinc-700 rounded flex items-center justify-center text-xs transition-colors"
          >
            <Minus className="w-3 h-3" />
          </button>

          <button
            onClick={() => {
              sound.playGlitch();
              setIsMaximized(!isMaximized);
            }}
            title="Maximize / Restore"
            className="w-5 h-5 bg-zinc-900 hover:bg-zinc-800 text-orange-400 border border-zinc-700 rounded flex items-center justify-center text-xs transition-colors hidden sm:flex"
          >
            <Square className="w-2.5 h-2.5" />
          </button>

          <button
            onClick={() => {
              sound.playGlitch();
              onClose();
            }}
            title="Close"
            className="w-5 h-5 bg-red-700 hover:bg-red-600 text-white border border-red-500 rounded flex items-center justify-center text-xs transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Window Body Container */}
      <div className="flex-1 overflow-y-auto bg-zinc-950 text-zinc-100 max-h-[75vh] sm:max-h-[78vh]">
        {children}
      </div>
    </div>
  );
};
