import { useEffect, useRef, useState } from "react";
import socket, { joinRoom } from "@/lib/socket";
import axios from "axios";

const DrawingBoard = ({ room }) => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("black");
  const [lineWidth, setLineWidth] = useState(5);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    if (isClient) {
      const canvas = canvasRef.current;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const context = canvas.getContext("2d");
      context.lineCap = "round";
      context.strokeStyle = color; // Set initial stroke color
      context.lineWidth = lineWidth; // Set initial line width
      contextRef.current = context;

      if (room) {
        joinRoom(room);
      }

      socket.on("draw", ({ x0, y0, x1, y1, color, lineWidth }) => {
        drawLine(x0, y0, x1, y1, color, lineWidth);
      });

      return () => {
        socket.off("draw");
      };
    }
  }, [room, color, lineWidth, isClient]);

  const drawLine = (x0, y0, x1, y1, color, lineWidth) => {
    const context = contextRef.current;
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.stroke();
    context.closePath();
  };

  const handleMouseDown = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    setIsDrawing(true);
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
  };

  const handleMouseMove = async ({ nativeEvent }) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    const { offsetX: x0, offsetY: y0 } = contextRef.current.lastPos || {
      offsetX,
      offsetY,
    };
    drawLine(x0, y0, offsetX, offsetY, color, lineWidth);
    contextRef.current.lastPos = { offsetX, offsetY };
    socket.emit("draw", {
      room,
      x0,
      y0,
      x1: offsetX,
      y1: offsetY,
      color,
      lineWidth,
    });
    await axios.post("/api/game/updatestate", {
      offsetX,
      offsetY,
      color,
      lineWidth,
      room,
    });
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    contextRef.current.closePath();
    contextRef.current.lastPos = null; // Reset last position
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="flex flex-col items-center">
      {isClient && (
        <>
          <div className="flex mb-4">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="mr-2"
            />
            <input
              type="number"
              value={lineWidth}
              onChange={(e) => setLineWidth(Number(e.target.value))}
              className="mr-2 w-16"
              min="1"
              max="50"
            />
            <button
              onClick={clearCanvas}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Clear
            </button>
          </div>
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="w-full h-full border border-gray-300 rounded shadow-lg bg-white"
          />
        </>
      )}
    </div>
  );
};

export default DrawingBoard;
