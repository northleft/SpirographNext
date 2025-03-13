import React, { useEffect, useImperativeHandle, useRef } from 'react';

const Canvas = (
  {
    ref = null,
    dimension = 1000,
    drawCanvas = () => {},
    exportCanvas = () => {}
  }:{
    ref: any
    dimension?: number,
    drawCanvas?: any,
    exportCanvas?: any
  }) => {

  const canvasDrawingRef = useRef(null);
  const canvasUIRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      canvasDraw(){
        const dCanvas = canvasDrawingRef.current;
        const dCanvasContext = dCanvas.getContext('2d');
        const uCanvas = canvasUIRef.current;
        const uCanvasContext = uCanvas.getContext('2d');

        drawCanvas({
          drawCTX: dCanvasContext,
          uiCTX: uCanvasContext
        });
      },
      canvasExport(){
        const drawCanvas:any = canvasDrawingRef.current;

        exportCanvas(drawCanvas);
      }
    }
  });

  return (
    <>
      <canvas ref={canvasDrawingRef} width={dimension} height={dimension}/>
      <canvas ref={canvasUIRef} width={dimension} height={dimension}/>
    </>
  )
}

export default Canvas;