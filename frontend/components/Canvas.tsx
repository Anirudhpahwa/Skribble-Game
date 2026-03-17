"use client";

import { useEffect, useRef, useState } from 'react';

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
  width: number; // desired display width (from parent)
  height: number; // desired display height (from parent)
  strokes: Stroke[];
  currentStroke: Point[];
  currentColor: string;
  currentSize: number;
  brushSize: number;
  toolMode: 'brush' | 'eraser';
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
  brushSize,
  toolMode,
  onDrawingStart,
  onDrawingMove,
  onDrawingEnd,
}: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState<Point | null>(null);

  // Set the internal canvas size to match the container size
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set the drawing buffer size to match the container size
    canvas.width = width;
    canvas.height = height;

    // Clear the canvas
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
  }, [width, height]);

  // Redraw strokes and current stroke
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

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
  }, [strokes, currentStroke, currentColor, currentSize]);

    // Set up mouse events and cursor
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const handleMouseDown = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        onDrawingStart(e as unknown as React.MouseEvent<HTMLCanvasElement>);
      };

      const handleMouseMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setMousePos({ x, y });
        onDrawingMove(e as unknown as React.MouseEvent<HTMLCanvasElement>);
      };

    const handleMouseUp = () => {
      onDrawingEnd();
    };

    const handleMouseLeave = () => {
      setMousePos(null);
      onDrawingEnd();
    };

    // Set cursor based on toolMode
    if (toolMode === 'brush') {
      canvas.style.cursor = 'crosshair';
    } else {
      // For eraser, we hide the default cursor and show our own circle
      canvas.style.cursor = 'none';
    }

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.style.cursor = 'default';
    };
  }, [toolMode, onDrawingStart, onDrawingMove, onDrawingEnd]);

  return (
    <div
      style={{
        position: 'relative',
        width: width,
        height: height,
      }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full bg-white"
        style={{ display: 'block' }}
      />
      {/* Eraser preview */}
      {toolMode === 'eraser' && mousePos && (
        <div
          style={{
            position: 'absolute',
            left: mousePos.x - currentSize, // circle radius is currentSize, so we subtract radius to center
            top: mousePos.y - currentSize,
            width: currentSize * 2,
            height: currentSize * 2,
            borderRadius: '50%',
            border: '1px solid gray',
            backgroundColor: 'rgba(255,255,255,0.8)',
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  );
}
