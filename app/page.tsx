"use client";
import { useEffect, useRef, useState } from "react";
import * as Slider from "@radix-ui/react-slider";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(5);
  const currentStrokeRef = useRef<{ x: number; y: number }[]>([]);
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

    context.lineWidth = 5;
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
    console.log(currentStrokeRef);
  };

  const finishDrawing = () => {
    if (!contextRef.current) return;
    setIsDrawing(false);
    contextRef.current.closePath();
    const stroke = {
      points: currentStrokeRef.current,
      color: color,
      lineWidth: lineWidth,
    };
    strokesHistoryRef.current.push(stroke);
  };

  const undo = () => {
    if (!contextRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const context = contextRef.current;

    strokesHistoryRef.current.pop();

    context.clearRect(0, 0, canvas.width, canvas.height);

    contextRef.current.strokeStyle = color ?? "black";

    strokesHistoryRef.current.forEach((stroke) => {
      // Pour chaque trait, vous devez :
      context.strokeStyle = stroke.color;
      context.lineWidth = stroke.lineWidth;
      // a) Configurer la couleur et largeur de CE trait
      // b) Tracer tous les points de CE trait
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

  return (
    <>
      <div className=" flex flex-row gap-1 rounded-4xl p-4 w-fit h-fit bg-amber-400 absolute bottom-6 left-1/2 -translate-x-1/2">
        <button
          data-color="#000000"
          className={`w-6 h-6 rounded-4xl grow-0 bg-black ${color === "#000000" ? "ring-2 ring-white" : ""}`}
          onClick={(e) => setColor(e.currentTarget.dataset.color!)}
        ></button>
        <button
          data-color="#f6339a"
          className={`w-6 h-6 rounded-4xl grow-0 bg-pink-500 ${color === "#f6339a" ? "ring-2 ring-white" : ""}`}
          onClick={(e) => setColor(e.currentTarget.dataset.color!)}
        ></button>
        <button
          data-color="#efb100"
          className={`w-6 h-6 rounded-4xl grow-0 bg-yellow-500 ${color === "#efb100" ? "ring-2 ring-white" : ""}`}
          onClick={(e) => setColor(e.currentTarget.dataset.color!)}
        ></button>
        <button
          data-color="#00c951"
          className={`w-6 h-6 rounded-4xl grow-0 bg-green-500 ${color === "#00c951" ? "ring-2 ring-white" : ""}`}
          onClick={(e) => setColor(e.currentTarget.dataset.color!)}
        ></button>
        <button
          data-color="#2b7fff"
          className={`w-6 h-6 rounded-4xl grow-0 bg-blue-500 ${color === "#2b7fff" ? "ring-2 ring-white" : ""}`}
          onClick={(e) => setColor(e.currentTarget.dataset.color!)}
        ></button>
        <button
          data-color="#ad46ff"
          className={`w-6 h-6 rounded-4xl grow-0 bg-purple-500 ${color === "#ad46ff" ? "ring-2 ring-white" : ""}`}
          onClick={(e) => setColor(e.currentTarget.dataset.color!)}
        ></button>
        <button
          data-color="#fb2c36"
          className={`w-6 h-6 rounded-4xl grow-0 bg-red-500 ${color === "#fb2c36" ? "ring-2 ring-white" : ""}`}
          onClick={(e) => setColor(e.currentTarget.dataset.color!)}
        ></button>
        <button
          data-color="#ff6900"
          className={`w-6 h-6 rounded-4xl grow-0 bg-orange-500 ${color === "#ff6900" ? "ring-2 ring-white" : ""}`}
          onClick={(e) => setColor(e.currentTarget.dataset.color!)}
        ></button>
        <button
          data-color="#737373"
          className={`w-6 h-6 rounded-4xl grow-0 bg-neutral-500 ${color === "#737373" ? "ring-2 ring-white" : ""}`}
          onClick={(e) => setColor(e.currentTarget.dataset.color!)}
        ></button>
        <button
          className="w-6 h-6 rounded-4xl grow-0 bg-neutral-50"
          onClick={(e) => undo()}
        ></button>
        <Slider.Root
          value={[lineWidth]}
          onValueChange={(value) => setLineWidth(value[0])}
          min={1}
          max={50}
          step={5}
          className="relative flex items-center  grow-0 w-auto h-5"
        >
          <Slider.Track className="bg-gray-200 relative w-40 rounded-full h-1">
            <Slider.Range className="absolute bg-black rounded-full h-full" />
          </Slider.Track>
          <Slider.Thumb className="block w-4 h-4 bg-white border-2 border-black rounded-full" />
        </Slider.Root>
      </div>
      <canvas
        onMouseDown={startDrawing}
        onMouseUp={finishDrawing}
        onMouseMove={draw}
        ref={canvasRef}
      />
    </>
  );
}
