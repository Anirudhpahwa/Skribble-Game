"use client";

import { useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
}
interface Stroke {
  points: Point[];
  color: string;
  size: number;
}

interface CanvasProps {
  width: number;
  height: number;
  strokes: Stroke[];
  currentStroke: Point[];
  currentColor: string;
  currentSize: number;
  onDrawingStart: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onDrawingMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onDrawingEnd: () => void;
}

export default function Canvas({
  width,
  height,
  strokes,
  currentStroke,
  currentColor,
  currentSize,
  onDrawingStart,
  onDrawingMove,
  onDrawingEnd,
}: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = width;
    canvas.height = height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Set drawing properties
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Redraw existing strokes
    strokes.forEach(stroke => {
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.size;
      ctx.beginPath();
      const points = stroke.points;
      if (points.length > 0) {
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.stroke();
      }
    });

    // Draw current stroke (if any)
    if (currentStroke.length > 0) {
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = currentSize;
      ctx.beginPath();
      ctx.moveTo(currentStroke[0].x, currentStroke[0].y);
      for (let i = 1; i < currentStroke.length; i++) {
        ctx.lineTo(currentStroke[i].x, currentStroke[i].y);
      }
      ctx.stroke();
    }
  }, [width, height, strokes, currentStroke, currentColor, currentSize]);

  // Mouse event handlers
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseDown = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      onDrawingStart(e);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      onDrawingMove(e);
    };

    const handleMouseUp = () => {
      onDrawingEnd();
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseUp);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseUp);
    };
  }, [onDrawingStart, onDrawingMove, onDrawingEnd]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-pointer bg-white"
      />
    </div>
  );
}
