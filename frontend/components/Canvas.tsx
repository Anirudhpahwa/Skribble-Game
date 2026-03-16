"use client";

import { useEffect, useRef } from 'react';

interface CanvasProps {
  isDrawing: boolean;
  onDrawingStart: (x: number, y: number) => void;
  onDrawingMove: (x: number, y: number) => void;
  onDrawingEnd: () => void;
}

export default function Canvas({ 
  isDrawing, 
  onDrawingStart, 
  onDrawingMove, 
  onDrawingEnd 
}: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size to parent container
    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      // Redraw existing content if needed
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  // Drawing event handlers (stubs for now)
  const handleMouseDown = (e: MouseEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    onDrawingStart(x, y);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDrawing) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    onDrawingMove(x, y);
  };

  const handleMouseUp = () => {
    onDrawingEnd();
  };

  const handleMouseLeave = () => {
    onDrawingEnd();
  };

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full cursor-pointer bg-white"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    />
  );
}
