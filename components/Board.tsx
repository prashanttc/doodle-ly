"use client";

import { useEffect, useRef } from "react";

interface BoardProps {
  onSave: (imageUrl: string) => void; // Callback to pass the saved image URL
}

const Board = ({ onSave }: BoardProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    // Fill the canvas with white background initially
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Set initial drawing styles
    context.lineWidth = 2;
    context.strokeStyle = "black";
    context.lineCap = "round";

    const startDrawing = (e: MouseEvent) => {
      isDrawingRef.current = true;
      context.beginPath();
      context.moveTo(e.offsetX, e.offsetY);
    };

    const draw = (e: MouseEvent) => {
      if (!isDrawingRef.current) return;
      context.lineTo(e.offsetX, e.offsetY);
      context.stroke();
    };

    const stopDrawing = () => {
      isDrawingRef.current = false;
      context.closePath();
    };

    // Add event listeners once on mount
    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseout", stopDrawing);

    // Cleanup on unmount
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
        <div className=" flex gap-2">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-black border-2 border-white/40 text-white rounded-xl cursor-pointer"
        >
          Save Drawing
        </button>
        <button
          onClick={handleClear}
          className="px-4 py-2 bg-red-500 text-white rounded-xl cursor-pointer"
        >
          Clear
        </button>
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
