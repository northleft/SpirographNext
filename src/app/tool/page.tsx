'use client'
import React, { useEffect, useRef, useState } from 'react';
import InputLabel from '@/components/InputLabel';
import InputLabelArray from '@/components/InputLabelArray';
import Canvases from '@/components/Canvases';
import type {CanvasesHandle} from '@/components/Canvases';

interface GraphState {
  radius: number;
  nib: number;
  nibpx: number;
  color: string;
  colors: Array<[]>;
}

type GraphStateTypes = {
  [K in keyof GraphState]?: GraphState[K];
};

const onePI = Math.PI;
const twoPI = onePI * 2;
  
const getLoops = (one:number = .5, two:number = 1) => {
  let int:number = 1;
  let res = false;
  const maximumReps = 66666;

  while (!res){
    res = parseFloat(((int * one) / two).toPrecision(6)) % 1 == 0 || int > maximumReps;
    int++;
  }

  return int-1;
}

const getCircle = (
  radius:number = 0,
  distance:number = 0
) => {
  const circumference = twoPI * radius;
  distance = distance % circumference;
  const theta = distance / circumference * twoPI;
  const cos = Math.cos(theta);
  const sin = Math.sin(theta);
  const x = cos * radius;
  const y = sin * radius;
  const tangent = Math.atan((radius * cos) / (-radius * sin)) + (theta > onePI ? onePI : 0);

  return {
    distance,
    radius,
    circumference,
    theta,
    cos,
    sin,
    tangent,
    x,
    y
  }
}

const rotatePoint = (theta:number, x:number, y:number, originX:number = 0, originY:number = 0) => {
  theta = theta % twoPI;
  const cos = Math.cos(theta);
  const sin = Math.sin(theta);

  x = x - originX;
  y = y - originY;

  return {
    x: x * cos - y * sin + originX,
    y: x * sin + y * cos + originY
  };
}

const getBetweenNumbers = (one:number, two:number, pct:number) => {
  return pct * (two - one) + one;
}

const generateFilename = () => {
  let ret = "";
  const date = new Date();

  function gfTwoCharacters(t:string|number){
    t = t.toString();
    while (t.length < 2){
      t = "0" + t;
    }

    return t;
  }

  ret =
    date.getFullYear() +
    "." +
    gfTwoCharacters(date.getMonth() + 1) +
    "." +
    gfTwoCharacters(date.getDate()) +
    "." +
    gfTwoCharacters(date.getHours() + 1) +
    "." +
    gfTwoCharacters(date.getMinutes());
  //+ '.' +
  //(Math.random() + 1).toString(36).slice(2,8)

  return ret;
}

const Tool = () => {
  //let tempRadius:number = parseFloat((Math.floor(Math.random() * 50) / 100 + .1).toPrecision(2));

  const [graph, setGraph] = useState<GraphState>({
    radius: parseFloat((Math.floor(Math.random() * 50) / 100 + .1).toPrecision(3)),
    nib: .85,
    nibpx: 2,
    color: '#1C9484',
    colors: []
  });

  const [isAnimating, setIsAnimating] = useState(false);
  const [animatingInt, setAnimatingInt] = useState(0);

  const canvasRef = useRef<CanvasesHandle>(null)

  const canvasBuild = () => {
    if (!isAnimating){
      setIsAnimating(true);
    } else {
      setIsAnimating(false);
    }
    
    //canvasRef.current?.canvasDraw();
  }
  const canvasExport = () => {
    canvasRef.current?.canvasExport();
  }

  useEffect(() => {
    //console.log('useeffect graph', graph)
  }, [graph]);

  // when the graph values are change
  const inputUpdated = ({
    key,
    value
  }:{
    key: keyof GraphState,
    value: GraphState[key]
  }) => {
    const oldValue = graph[key];

    if (oldValue != value){
      const newGraph = {...graph};
      newGraph[key] = value;

      setGraph(newGraph);
    }
  }

  useEffect(() => {
    if (isAnimating){
      canvasRef.current!.canvasDraw()
    }

    // Clean up on component unmount (optional)
    cancelAnimationFrame(animatingInt); 
  }, [isAnimating]);
  
  const drawCanvas = (drawCTX:CanvasRenderingContext2D, uiCTX:CanvasRenderingContext2D) => {
    const onePI = Math.PI;
    const twoPI = onePI * 2;
    const width = drawCTX.canvas.width;
    const height = drawCTX.canvas.height;
    const cx = width / 2;
    const cy = height / 2;

    const ticksPerLoop = 100;
    const loops = getLoops(graph.radius, 1);
    const ticks = loops * ticksPerLoop;
    
    const parentRadius = 300;
    const radius = graph.radius * parentRadius;
    const circumference = twoPI * radius;
    const inc = circumference / ticksPerLoop;

    drawCTX.clearRect(0, 0, width, height);

    let prev:object | null = null;
    let index:number = 0;

    const colors = {
      hexes: [graph.color, ...graph.colors],
      red: [],
      green: [],
      blue: [],
      gap: 0,
      gaps: 0
    }
    colors.gaps = colors.hexes.length
    colors.gap = 1 / colors.gaps;

    colors.hexes.map(function(hex:string){
      hex = hex.replace('#', '');

      // Handle 3-digit hex codes (e.g., #abc)
      if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
      }

      // Convert hex to RGB
      colors.red.push(parseInt(hex.substring(0, 2), 16));
      colors.green.push(parseInt(hex.substring(2, 4), 16));
      colors.blue.push(parseInt(hex.substring(4, 6), 16));
    });

    const animate = () => {

      for (let i = 0; i < ticksPerLoop; i++){
        const distance = inc * index;
        const pct = index / ticks;
        const parentCircle = getCircle(parentRadius, distance);
        const circle = getCircle(radius, distance);
        const tangent = parentCircle.tangent - circle.tangent;
        const point = rotatePoint(tangent + onePI, circle.x, circle.y);
        const nibPoint = rotatePoint(
          tangent,
          radius * graph.nib,
          0
        );
        
        const colorNumber = pct * colors.gaps;
        const colorIndex = Math.floor(colorNumber);
        const colorPct = colorNumber % 1;
        const drawRed = getBetweenNumbers(colors.red[colorIndex % colors.hexes.length], colors.red[(colorIndex + 1) % colors.hexes.length], colorPct);
        const drawGreen = getBetweenNumbers(colors.green[colorIndex % colors.hexes.length], colors.green[(colorIndex + 1) % colors.hexes.length], colorPct);
        const drawBlue = getBetweenNumbers(colors.blue[colorIndex % colors.hexes.length], colors.blue[(colorIndex + 1) % colors.hexes.length], colorPct);
  
        const drawColor = `rgb(${drawRed}, ${drawGreen}, ${drawBlue})`
  
        uiCTX.clearRect(0, 0, width, height);
  
        // parent circle
        uiCTX.beginPath();
        uiCTX.strokeStyle = 'rgba(0, 0, 0, 255)';
        uiCTX.lineWidth = .5;
        uiCTX.arc(cx, cy, parentCircle.radius, 0, twoPI);
        uiCTX.stroke();
  
        // circle circle
        uiCTX.beginPath();
        uiCTX.lineWidth = 1.5;
        uiCTX.strokeStyle = 'red';
        uiCTX.arc(
          parentCircle.x + point.x + cx,
          parentCircle.y + point.y + cy,
          circle.radius, tangent, tangent + onePI
        );
        uiCTX.stroke();
  
        uiCTX.beginPath();
        uiCTX.lineWidth = 1.5;
        uiCTX.strokeStyle = 'blue';
        uiCTX.arc(
          parentCircle.x + point.x + cx,
          parentCircle.y + point.y + cy,
          circle.radius, tangent + onePI, tangent + twoPI
        );
        uiCTX.stroke();
  
        point.x += nibPoint.x + parentCircle.x;
        point.y += nibPoint.y + parentCircle.y;
  
        uiCTX.beginPath();
        uiCTX.strokeStyle = 'rgba(0, 0, 0, 255)';
        uiCTX.lineWidth = .75;
        uiCTX.arc(point.x + cx, point.y + cy, 10, 0, twoPI);
        uiCTX.stroke();
  
        if (prev){
          drawCTX.beginPath();
          drawCTX.lineWidth = graph.nibpx;
          drawCTX.strokeStyle = drawColor;
          drawCTX.moveTo(prev.x + cx, prev.y + cy);
          drawCTX.lineTo(point.x + cx, point.y + cy);
          drawCTX.stroke();
        }
  
        drawCTX.beginPath();
        drawCTX.lineWidth = 0;
        drawCTX.fillStyle = drawColor;
        drawCTX.arc(point.x + cx, point.y + cy, graph.nibpx / 2, 0, twoPI);
        drawCTX.fill();
  
        prev = point;
        index++;
      }
      

      if (isAnimating && index < ticks){
        setAnimatingInt(requestAnimationFrame(animate));
      } else {
        setIsAnimating(false)
      }
    }
    
    const int = requestAnimationFrame(animate);

    setAnimatingInt(int);
  }

  const exportCanvas = (canvas:HTMLCanvasElement) => {
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(
          window.open(URL.createObjectURL(blob!), 'name=' + generateFilename())
        )
      });
    });
  }

  return (
    <div id="spiro-tool" className="flex flex-col w-screen h-screen p-2">
      <div id="spiro-tool-menu" className="bg-white rounded p-2 flex justify-between items-center">
        <h1 className="text-xl">Spirograph Maker</h1>
        <h2><a href="https://juan-garcia.dev" target="_blank">Juan Garcia</a></h2>
      </div>
      <div id="spiro-container" className="flex-grow flex mt-2">
        <div id="spiro-tool-panel" className="w-[240px]">
          <div id="spiro-graph" className="bg-white float-left w-full p-3 rounded">
            <button
              className="bg-gray-300 px-2 py-1 rounded float-left clear-both mb-2"
              onClick={canvasBuild}
            >{isAnimating ? 'Stop' : 'Build'}</button>
            <button
              className="bg-gray-300 px-2 py-1 rounded float-left clear-both"
              onClick={canvasExport}
            >Export PNG</button>
          </div>
          <div id="spiro-cog" className="bg-white float-left w-full px-2 py-3 rounded-lg mt-2">
            <InputLabel
              label="Radius"
              name="radius"
              kind="float"
              min={0.05}
              max={1}
              value={graph.radius}
              update={inputUpdated}
            />
            <InputLabel
              label="Nib Position"
              name="nib"
              kind="float"
              min={0}
              value={graph.nib}
              update={inputUpdated}
            />
            <InputLabel
              label="Nib Size"
              name="nibpx"
              kind="float"
              min={0}
              value={graph.nibpx}
              update={inputUpdated}
            />
            <InputLabel
              label="Color 0"
              name="color"
              kind="color"
              value={graph.color}
              update={inputUpdated}
            />
            <InputLabelArray
              label="Add Additional Colors"
              name="colors"
              kind="color"
              value={graph.colors}
              update={inputUpdated}
            />
          </div>
        </div>
        <div id="spiro-tool-graph" className=" bg-white rounded flex-grow ml-2 relative overflow-hidden">
          <Canvases
            ref={canvasRef}
            dimension={800}
            drawCanvas={drawCanvas}
            exportCanvas={exportCanvas}
          />
        </div>
      </div>
    </div>
  );
}

export default Tool;