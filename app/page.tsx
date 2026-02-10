"use client";
import { useEffect, useRef, useState } from "react";
import { Undo2, Download } from "lucide-react";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(8);
  const currentStrokeRef = useRef<{ x: number; y: number }[]>([]);
  const [undoAnimating, setUndoAnimating] = useState(false);
  const strokesHistoryRef = useRef<
    Array<{
      points: { x: number; y: number }[];
      color: string;
      lineWidth: number;
    }>
  >([]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");

    canvas.width = window.innerWidth * 2; // to change when called as a component
    canvas.height = window.innerHeight * 2; // [...]
    canvas.style.width = `${window.innerWidth}px`; // [...]
    canvas.style.height = `${window.innerHeight}px`; // [...]

    if (!context) return;

    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.lineWidth = 8;
    context.scale(2, 2);
    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = "black";

    contextRef.current = context;
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!contextRef.current) return;
    const { offsetX, offsetY } = e.nativeEvent;
    const canvas = canvasRef.current;
    if (!canvas?.getContext) return;
    contextRef.current.strokeStyle = color ?? "black";
    contextRef.current.lineWidth = lineWidth;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    currentStrokeRef.current = [{ x: offsetX, y: offsetY }];
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!contextRef.current) return;
    if (!isDrawing) {
      return;
    }
    const { offsetX, offsetY } = e.nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
    currentStrokeRef.current.push({ x: offsetX, y: offsetY });
  };

  const finishDrawing = () => {
    if (!contextRef.current) return;
    setIsDrawing(false);
    contextRef.current.closePath();
    if (isDrawing && currentStrokeRef.current.length > 1) {
      const stroke = {
        points: currentStrokeRef.current,
        color: color,
        lineWidth: lineWidth,
      };
      strokesHistoryRef.current.push(stroke);
    }
  };

  const undo = () => {
    if (!contextRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const context = contextRef.current;

    setUndoAnimating(true);
    setTimeout(() => setUndoAnimating(false), 150);

    strokesHistoryRef.current.pop();

    context.clearRect(0, 0, canvas.width, canvas.height);

    contextRef.current.strokeStyle = color ?? "black";

    strokesHistoryRef.current.forEach((stroke) => {
      context.strokeStyle = stroke.color;
      context.lineWidth = stroke.lineWidth;
      context.beginPath();

      const firstPoint = stroke.points[0];
      context.moveTo(firstPoint.x, firstPoint.y);

      for (let i = 1; i < stroke.points.length; i++) {
        const point = stroke.points[i];
        context.lineTo(point.x, point.y);
      }

      context.stroke();
    });
  };

  const save = () => {
    if (!contextRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const image = canvas.toDataURL("image/png");
    console.log(image);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    }, "image/png");
  };
  return (
    <>
      <div className=" flex flex-row gap-4 rounded-4xl p-4 w-fit h-fit bg-neutral-100 absolute bottom-6 left-1/2 -translate-x-1/2">
        <span className="flex gap-1.5">
          <button
            className={`w-7 h-7 rounded-4xl grow-0 bg-neutral-500 flex items-center justify-center 
              ${undoAnimating ? "ring-2 ring-neutral-400" : ""}`}
            onClick={() => undo()}
          >
            <Undo2 color="white" size={16} />
          </button>
        </span>
        <span className="flex gap-1.5">
          <button
            data-color="#000000"
            className={`w-7 h-7 rounded-4xl grow-0 bg-black ${color === "#000000" ? "ring-2 ring-neutral-400" : ""}`}
            onClick={(e) => setColor(e.currentTarget.dataset.color!)}
          ></button>
          <button
            data-color="#f6339a"
            className={`w-7 h-7 rounded-4xl grow-0 bg-pink-500 ${color === "#f6339a" ? "ring-2 ring-neutral-400" : ""}`}
            onClick={(e) => setColor(e.currentTarget.dataset.color!)}
          ></button>
          <button
            data-color="#efb100"
            className={`w-7 h-7 rounded-4xl grow-0 bg-yellow-500 ${color === "#efb100" ? "ring-2 ring-neutral-400" : ""}`}
            onClick={(e) => setColor(e.currentTarget.dataset.color!)}
          ></button>
          <button
            data-color="#00c951"
            className={`w-7 h-7 rounded-4xl grow-0 bg-green-500 ${color === "#00c951" ? "ring-2 ring-neutral-400" : ""}`}
            onClick={(e) => setColor(e.currentTarget.dataset.color!)}
          ></button>
          <button
            data-color="#2b7fff"
            className={`w-7 h-7 rounded-4xl grow-0 bg-blue-500 ${color === "#2b7fff" ? "ring-2 ring-neutral-400" : ""}`}
            onClick={(e) => setColor(e.currentTarget.dataset.color!)}
          ></button>
          <button
            data-color="#ad46ff"
            className={`w-7 h-7 rounded-4xl grow-0 bg-purple-500 ${color === "#ad46ff" ? "ring-2 ring-neutral-400" : ""}`}
            onClick={(e) => setColor(e.currentTarget.dataset.color!)}
          ></button>
          <button
            data-color="#fb2c36"
            className={`w-7 h-7 rounded-4xl grow-0 bg-red-500 ${color === "#fb2c36" ? "ring-2 ring-neutral-400" : ""}`}
            onClick={(e) => setColor(e.currentTarget.dataset.color!)}
          ></button>
          <button
            data-color="#ff6900"
            className={`w-7 h-7 rounded-4xl grow-0 bg-orange-500 ${color === "#ff6900" ? "ring-2 ring-neutral-400" : ""}`}
            onClick={(e) => setColor(e.currentTarget.dataset.color!)}
          ></button>
          <button
            data-color="#737373"
            className={`w-7 h-7 rounded-4xl grow-0 bg-neutral-500 ${color === "#737373" ? "ring-2 ring-neutral-400" : ""}`}
            onClick={(e) => setColor(e.currentTarget.dataset.color!)}
          ></button>
        </span>
        <span className="flex gap-1.5">
          <button
            data-linewidth="8"
            className={`w-7 h-7 rounded-4xl flex items-center justify-center grow-0 border-2 bg-none ${lineWidth === 8 ? "ring-2 ring-neutral-400" : "opacity-30"}`}
            onClick={(e) =>
              setLineWidth(Number(e.currentTarget.dataset.linewidth!))
            }
          >
            <div className="w-2 h-2 bg-black rounded-2xl"></div>
          </button>
          <button
            data-linewidth="12"
            className={`w-7 h-7 rounded-4xl flex items-center justify-center grow-0 border-2 bg-none ${lineWidth === 12 ? "ring-2 ring-neutral-400" : "opacity-30"}`}
            onClick={(e) =>
              setLineWidth(Number(e.currentTarget.dataset.linewidth!))
            }
          >
            <div className="w-3 h-3 bg-black rounded-2xl"></div>
          </button>
          <button
            data-linewidth="16"
            className={`w-7 h-7 rounded-4xl flex items-center justify-center grow-0 border-2 bg-none ${lineWidth === 16 ? "ring-2 ring-neutral-400" : "opacity-30"}`}
            onClick={(e) =>
              setLineWidth(Number(e.currentTarget.dataset.linewidth!))
            }
          >
            <div className="w-4 h-4 bg-black rounded-2xl"></div>
          </button>
          <button
            data-linewidth="20"
            className={`w-7 h-7 rounded-4xl flex items-center justify-center grow-0 border-2 bg-none ${lineWidth === 20 ? "ring-2 ring-neutral-400" : "opacity-30"}`}
            onClick={(e) =>
              setLineWidth(Number(e.currentTarget.dataset.linewidth!))
            }
          >
            <div className="w-5 h-5 bg-black rounded-2xl"></div>
          </button>
        </span>
        <span className="flex gap-1.5">
          <button
            className={`w-7 h-7 rounded-4xl grow-0 bg-neutral-500 flex items-center justify-center `}
            onClick={() => save()}
          >
            <Download color="white" size={16} />
          </button>
        </span>
      </div>
      <canvas
        onMouseDown={startDrawing}
        onMouseUp={finishDrawing}
        onMouseMove={draw}
        onMouseLeave={finishDrawing}
        ref={canvasRef}
      />
    </>
  );
}
