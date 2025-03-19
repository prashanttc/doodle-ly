"use client";

import { useEffect, useRef } from "react";
import { Button } from "./ui/button";

interface BoardProps {
  onSave: (imageUrl: string) => void; 
  credits: number;
}

const Board = ({ onSave, credits }: BoardProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    // Initial setup
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.lineWidth = 2;
    context.strokeStyle = "black";
    context.lineCap = "round";

    // Coordinate scaling helper
    const getScaledCoordinates = (e: MouseEvent) => {
      const scaleX = canvas.width / canvas.clientWidth;
      const scaleY = canvas.height / canvas.clientHeight;
      return {
        x: e.offsetX * scaleX,
        y: e.offsetY * scaleY
      };
    };

    // Event handlers
    const startDrawing = (e: MouseEvent) => {
      isDrawingRef.current = true;
      const { x, y } = getScaledCoordinates(e);
      context.beginPath();
      context.moveTo(x, y);
    };

    const draw = (e: MouseEvent) => {
      if (!isDrawingRef.current) return;
      const { x, y } = getScaledCoordinates(e);
      context.lineTo(x, y);
      context.stroke();
    };

    const stopDrawing = () => {
      isDrawingRef.current = false;
      context.closePath();
    };

    // Add event listeners
    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseout", stopDrawing);

    return () => {
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", stopDrawing);
      canvas.removeEventListener("mouseout", stopDrawing);
    };
  }, []);

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
  
    // Convert canvas to data URL (PNG format)
    const dataUrl = canvas.toDataURL("image/png");
  
    // Trigger a download of the generated image
    // const link = document.createElement("a");
    // link.href = dataUrl;
    // link.download = "scribble.png";
    // link.click();
  
    // Pass the saved image URL to the parent component
    onSave(dataUrl);
  };
  
  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
  
    const context = canvas.getContext("2d");
    if (!context) return;
  
    // Clear the canvas and fill it with a white background
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
  };
  
  return (
    <div className=" flex-col w-1/2 p-5  border-2 border-white/50 rounded-4xl gap-4 hidden xl:flex">
      <div className="flex items-center justify-between">
        <h1 className="text-xl text-white font-semibold ">create doodle </h1>
        <div className=" flex gap-2 ">
        <Button
        disabled={credits===0}
          onClick={handleSave}
          className="px-4 py-2 bg-black border-2 border-white/40 text-white rounded-xl cursor-pointer"
        >
          Save Drawing
        </Button>
        <Button
          onClick={handleClear}
          className="px-4 py-2 bg-red-500 text-white rounded-xl cursor-pointer"
        >
          Clear
        </Button>
      </div>
      </div>{" "}
      <canvas
        ref={canvasRef}
        width={700}
        height={500}
        className="border rounded-xl"
      />
      
    </div>
  );
};

export default Board;

