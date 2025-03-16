import React, {useImperativeHandle, useRef } from 'react';
import type { Ref } from "react";

type canvasDrawFunction = (a:CanvasRenderingContext2D, b:CanvasRenderingContext2D) => void;
type canvasExportFunction = (a:HTMLCanvasElement) => void;

export type CanvasesHandle = {
  //canvasDraw: canvasDrawFunction;
  //canvasExport: canvasExportFunction;
  canvasDraw: () => void;
  canvasExport: () => void;
};

const Canvases = (
  {
    ref,
    dimension = 1000,
    drawCanvas = () => {},
    exportCanvas = () => {}
  }:{
    ref: Ref<CanvasesHandle>;
    dimension?: number;
    drawCanvas?: canvasDrawFunction;
    exportCanvas?: canvasExportFunction;
  }) => {

  const canvasDrawingRef = useRef<HTMLCanvasElement>(null);
  const canvasUIRef = useRef<HTMLCanvasElement>(null);

  useImperativeHandle(ref, () => ({
    canvasDraw: () => {
      if (canvasDrawingRef.current && canvasUIRef.current){
        const dCanvas = canvasDrawingRef.current;
        const dCanvasContext = dCanvas.getContext('2d') as CanvasRenderingContext2D;
        const uCanvas = canvasUIRef.current;
        const uCanvasContext = uCanvas.getContext('2d') as CanvasRenderingContext2D;

        drawCanvas(dCanvasContext, uCanvasContext);
      }
    },
    canvasExport: () => {
      if (canvasDrawingRef.current){
        exportCanvas(canvasDrawingRef.current);
      }
    }
  }));

  return (
    <>
      <canvas ref={canvasDrawingRef} width={dimension} height={dimension}/>
      <canvas ref={canvasUIRef} width={dimension} height={dimension}/>
    </>
  )
}

export default Canvases;