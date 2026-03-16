"use client";

import { useEffect, useRef, useState } from 'react';

interface CanvasProps {
  width: number;
  height: number;
  color: string;
  brushSize: number;
  isEraser: boolean;
  onDrawingStart: (x: number, y: number) => void;
  onDrawingMove: (x: number, y: number) => void;
  onDrawingEnd: () => void;
  onClear: () => void;
}

export default function Canvas({
  width,
  height,
  color,
  brushSize,
  isEraser,
  onDrawingStart,
  onDrawingMove,
  onDrawingEnd,
  onClear,
}: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctxRef.current = ctx;
    canvas.width = width;
    canvas.height = height;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
  }, [width, height]);

  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);

  // Mouse handlers
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const start = (e: MouseEvent) => {
      setIsDrawing(true);
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      onDrawingStart(x, y);
    };
    const move = (e: MouseEvent) => {
      if (!isDrawing) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      onDrawingMove(x, y);
    };
    const end = () => {
      setIsDrawing(false);
      onDrawingEnd();
    };

    canvas.addEventListener('mousedown', start);
    canvas.addEventListener('mousemove', move);
    canvas.addEventListener('mouseup', end);
    canvas.addEventListener('mouseleave', end);

    return () => {
      canvas.removeEventListener('mousedown', start);
      canvas.removeEventListener('mousemove', move);
      canvas.removeEventListener('mouseup', end);
      canvas.removeEventListener('mouseleave', end);
    };
  }, []); // Note: we don't depend on color/brushSize/isEraser because the drawing logic is stubbed.
  // However, if we wanted to draw, we would need to use the color, brushSize, isEraser in the move handler.
  // For Step 3, we are just logging. So it's fine.

  // Clear handler
  const handleClear = () => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    onClear();
  };

  // Optional: allow clearing by double-click or a button? We'll rely on the toolbar button.
  return (
    <div>
      <canvas
        ref={canvasRef}
        className="cursor-pointer bg-white"
        // We could add onClick={handleClear} but we have a toolbar button.
      />
    </div>
  );
}
