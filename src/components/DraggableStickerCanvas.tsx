import React, { useRef, useState, useEffect } from 'react';
import { StickerOverlay } from '../types';
import { playStickerPopSound } from '../utils/audio';
import {
  RotateCcw,
  Copy,
  Trash2,
  FlipHorizontal,
  ArrowUp,
  ArrowDown,
  Maximize2,
} from 'lucide-react';

interface DraggableStickerCanvasProps {
  stickers: StickerOverlay[];
  selectedId: string | null;
  onSelectSticker: (id: string | null) => void;
  onChangeStickers: (updated: StickerOverlay[]) => void;
  children: React.ReactNode; // Base photo or video template beneath
  className?: string;
}

export const DraggableStickerCanvas: React.FC<DraggableStickerCanvasProps> = ({
  stickers,
  selectedId,
  onSelectSticker,
  onChangeStickers,
  children,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Pointer drag state
  const activePointerIdRef = useRef<number | null>(null);
  const dragStartPosRef = useRef<{ x: number; y: number; stickerX: number; stickerY: number } | null>(null);
  const isTransformingRef = useRef<boolean>(false);
  const transformStartRef = useRef<{ dist: number; angle: number; scale: number; rotation: number } | null>(null);

  // Multi-pointer map for pinch-to-zoom
  const pointerMapRef = useRef<Map<number, { x: number; y: number }>>(new Map());

  // Snap guide alignment lines state
  const [snapGuideX, setSnapGuideX] = useState<boolean>(false);
  const [snapGuideY, setSnapGuideY] = useState<boolean>(false);

  // Handle Pointer Down on a Sticker
  const handleStickerPointerDown = (
    e: React.PointerEvent<HTMLDivElement>,
    sticker: StickerOverlay
  ) => {
    e.stopPropagation();
    e.preventDefault();

    // Select sticker
    onSelectSticker(sticker.id);

    const targetEl = e.currentTarget;
    targetEl.setPointerCapture(e.pointerId);

    activePointerIdRef.current = e.pointerId;
    pointerMapRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;

    dragStartPosRef.current = {
      x: e.clientX,
      y: e.clientY,
      stickerX: sticker.x,
      stickerY: sticker.y,
    };
  };

  // Handle Pointer Move for Dragging & Snap Guides
  const handleStickerPointerMove = (
    e: React.PointerEvent<HTMLDivElement>,
    sticker: StickerOverlay
  ) => {
    if (!pointerMapRef.current.has(e.pointerId)) return;
    pointerMapRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    // Handle Multi-touch Pinch to Zoom & Rotate
    if (pointerMapRef.current.size >= 2) {
      const pts = Array.from(pointerMapRef.current.values());
      const dx = pts[1].x - pts[0].x;
      const dy = pts[1].y - pts[0].y;
      const dist = Math.hypot(dx, dy);
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

      if (!transformStartRef.current) {
        transformStartRef.current = {
          dist,
          angle,
          scale: sticker.scale,
          rotation: sticker.rotation,
        };
      } else {
        const scaleRatio = dist / transformStartRef.current.dist;
        const newScale = Math.max(0.4, Math.min(3.0, transformStartRef.current.scale * scaleRatio));
        const newRotation = transformStartRef.current.rotation + (angle - transformStartRef.current.angle);

        const updated = stickers.map((s) =>
          s.id === sticker.id ? { ...s, scale: newScale, rotation: newRotation } : s
        );
        onChangeStickers(updated);
      }
      return;
    }

    if (!dragStartPosRef.current || isTransformingRef.current) return;

    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;

    const deltaX = ((e.clientX - dragStartPosRef.current.x) / containerRect.width) * 100;
    const deltaY = ((e.clientY - dragStartPosRef.current.y) / containerRect.height) * 100;

    let newX = Math.max(-10, Math.min(100, dragStartPosRef.current.stickerX + deltaX));
    let newY = Math.max(-10, Math.min(100, dragStartPosRef.current.stickerY + deltaY));

    // Snap Alignment to Center (50%)
    let snapX = false;
    let snapY = false;

    if (Math.abs(newX - 50) < 2.5) {
      newX = 50;
      snapX = true;
    }
    if (Math.abs(newY - 50) < 2.5) {
      newY = 50;
      snapY = true;
    }

    setSnapGuideX(snapX);
    setSnapGuideY(snapY);

    const updated = stickers.map((s) =>
      s.id === sticker.id ? { ...s, x: newX, y: newY } : s
    );
    onChangeStickers(updated);
  };

  // Handle Pointer Up / Drop Sound
  const handleStickerPointerUp = (
    e: React.PointerEvent<HTMLDivElement>,
    sticker: StickerOverlay
  ) => {
    pointerMapRef.current.delete(e.pointerId);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }

    activePointerIdRef.current = null;
    dragStartPosRef.current = null;
    transformStartRef.current = null;
    isTransformingRef.current = false;

    setSnapGuideX(false);
    setSnapGuideY(false);

    playStickerPopSound();
  };

  // Corner Handle Pointer Events for Combined Rotate & Resize
  const handleCornerHandlePointerDown = (
    e: React.PointerEvent<HTMLDivElement>,
    sticker: StickerOverlay
  ) => {
    e.stopPropagation();
    e.preventDefault();

    e.currentTarget.setPointerCapture(e.pointerId);
    isTransformingRef.current = true;

    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;

    const stickerCenterX = containerRect.left + (sticker.x / 100) * containerRect.width;
    const stickerCenterY = containerRect.top + (sticker.y / 100) * containerRect.height;

    const dx = e.clientX - stickerCenterX;
    const dy = e.clientY - stickerCenterY;
    const initialDist = Math.hypot(dx, dy);
    const initialAngle = (Math.atan2(dy, dx) * 180) / Math.PI;

    transformStartRef.current = {
      dist: initialDist,
      angle: initialAngle,
      scale: sticker.scale,
      rotation: sticker.rotation,
    };
  };

  const handleCornerHandlePointerMove = (
    e: React.PointerEvent<HTMLDivElement>,
    sticker: StickerOverlay
  ) => {
    if (!isTransformingRef.current || !transformStartRef.current) return;

    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;

    const stickerCenterX = containerRect.left + (sticker.x / 100) * containerRect.width;
    const stickerCenterY = containerRect.top + (sticker.y / 100) * containerRect.height;

    const dx = e.clientX - stickerCenterX;
    const dy = e.clientY - stickerCenterY;
    const currentDist = Math.hypot(dx, dy);
    const currentAngle = (Math.atan2(dy, dx) * 180) / Math.PI;

    const scaleRatio = currentDist / Math.max(1, transformStartRef.current.dist);
    const newScale = Math.max(0.4, Math.min(3.0, transformStartRef.current.scale * scaleRatio));
    const newRotation = transformStartRef.current.rotation + (currentAngle - transformStartRef.current.angle);

    const updated = stickers.map((s) =>
      s.id === sticker.id ? { ...s, scale: newScale, rotation: newRotation } : s
    );
    onChangeStickers(updated);
  };

  const handleCornerHandlePointerUp = (
    e: React.PointerEvent<HTMLDivElement>
  ) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    isTransformingRef.current = false;
    transformStartRef.current = null;
  };

  // Quick Action Handlers
  const handleDuplicate = (sticker: StickerOverlay) => {
    const dup: StickerOverlay = {
      ...sticker,
      id: `st_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      x: Math.min(85, sticker.x + 4),
      y: Math.min(85, sticker.y + 4),
      zIndex: (sticker.zIndex || 10) + 1,
    };
    onChangeStickers([...stickers, dup]);
    onSelectSticker(dup.id);
  };

  const handleDelete = (id: string) => {
    onChangeStickers(stickers.filter((s) => s.id !== id));
    if (selectedId === id) onSelectSticker(null);
  };

  const handleFlipX = (sticker: StickerOverlay) => {
    onChangeStickers(
      stickers.map((s) => (s.id === sticker.id ? { ...s, flipX: !s.flipX } : s))
    );
  };

  const handleBringForward = (sticker: StickerOverlay) => {
    onChangeStickers(
      stickers.map((s) => (s.id === sticker.id ? { ...s, zIndex: (s.zIndex || 10) + 1 } : s))
    );
  };

  const handleSendBackward = (sticker: StickerOverlay) => {
    onChangeStickers(
      stickers.map((s) =>
        s.id === sticker.id ? { ...s, zIndex: Math.max(1, (s.zIndex || 10) - 1) } : s
      )
    );
  };

  return (
    <div
      ref={containerRef}
      onClick={() => onSelectSticker(null)}
      className={`relative overflow-hidden select-none touch-none ${className}`}
      style={{ touchAction: 'none' }}
    >
      {/* Base Canvas Graphic / Video Layer */}
      {children}

      {/* Center Snap Guide Lines */}
      {snapGuideX && (
        <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-[#F0509B] z-40 pointer-events-none border-r border-white" />
      )}
      {snapGuideY && (
        <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-[#F0509B] z-40 pointer-events-none border-b border-white" />
      )}

      {/* Absolutely Positioned Draggable Sticker Layers */}
      {stickers.map((st) => {
        const isSelected = selectedId === st.id;
        const flipTransform = st.flipX ? 'scaleX(-1)' : 'scaleX(1)';

        return (
          <div
            key={st.id}
            onPointerDown={(e) => handleStickerPointerDown(e, st)}
            onPointerMove={(e) => handleStickerPointerMove(e, st)}
            onPointerUp={(e) => handleStickerPointerUp(e, st)}
            onPointerCancel={(e) => handleStickerPointerUp(e, st)}
            style={{
              left: `${st.x}%`,
              top: `${st.y}%`,
              transform: `translate(-50%, -50%) rotate(${st.rotation}deg) scale(${st.scale}) ${flipTransform}`,
              zIndex: st.zIndex || 10,
              touchAction: 'none',
            }}
            className={`absolute cursor-grab active:cursor-grabbing transition-shadow ${
              isSelected ? 'ring-2 ring-dashed ring-[#F0509B] p-1 rounded-2xl z-50' : ''
            }`}
          >
            {/* Sticker Graphic Body */}
            <div className="bg-white text-slate-900 font-bold text-xs px-3 py-1.5 rounded-full border-3 border-slate-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.9)] flex items-center gap-1.5 whitespace-nowrap animate-pop">
              <span>{st.content}</span>
            </div>

            {/* Selected Handle Controls */}
            {isSelected && (
              <div
                style={{ transform: `scale(${1 / Math.max(0.6, st.scale)})` }}
                className="absolute inset-0 pointer-events-auto"
              >
                {/* Top-Right: Delete Handle */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(st.id);
                  }}
                  className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-rose-600 text-white border-2 border-slate-900 flex items-center justify-center font-black text-xs shadow-md hover:scale-110 active:scale-95 cursor-pointer z-50"
                  title="Delete sticker"
                >
                  ×
                </button>

                {/* Top-Left: Duplicate Handle */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDuplicate(st);
                  }}
                  className="absolute -top-3 -left-3 w-6 h-6 rounded-full bg-[#F7C948] text-slate-900 border-2 border-slate-900 flex items-center justify-center font-bold text-[10px] shadow-md hover:scale-110 active:scale-95 cursor-pointer z-50"
                  title="Duplicate sticker"
                >
                  <Copy className="w-3 h-3" />
                </button>

                {/* Bottom-Left: Flip Horizontal Handle */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFlipX(st);
                  }}
                  className="absolute -bottom-3 -left-3 w-6 h-6 rounded-full bg-sky-400 text-slate-900 border-2 border-slate-900 flex items-center justify-center font-bold text-[10px] shadow-md hover:scale-110 active:scale-95 cursor-pointer z-50"
                  title="Flip horizontal"
                >
                  <FlipHorizontal className="w-3 h-3" />
                </button>

                {/* Bottom-Right: Corner Combined Rotate & Resize Handle */}
                <div
                  onPointerDown={(e) => handleCornerHandlePointerDown(e, st)}
                  onPointerMove={(e) => handleCornerHandlePointerMove(e, st)}
                  onPointerUp={handleCornerHandlePointerUp}
                  className="absolute -bottom-3 -right-3 w-6 h-6 rounded-full bg-[#00C49F] text-white border-2 border-slate-900 flex items-center justify-center font-bold text-[10px] shadow-md cursor-nwse-resize z-50 hover:scale-110"
                  title="Drag to resize & rotate"
                >
                  <Maximize2 className="w-3 h-3" />
                </div>

                {/* Floating Z-Index Controls */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-1 bg-slate-900/90 text-white rounded-lg p-0.5 border border-slate-900 shadow-md">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBringForward(st);
                    }}
                    className="p-1 hover:text-[#F7C948]"
                    title="Bring forward"
                  >
                    <ArrowUp className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSendBackward(st);
                    }}
                    className="p-1 hover:text-[#F7C948]"
                    title="Send backward"
                  >
                    <ArrowDown className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
