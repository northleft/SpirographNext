import { useState, useEffect, useRef } from "react";
import ColorPicker from "./ColorPicker";

//interface isActiveType {
//  top: number;
//  left: number;
//  height: number;
//}

function InputLabel(
  {
    name = 'undefinedname',
    label = '',
    kind = 'text',
    min,
    max,
    value = '',
    isInArray = false,
    update
  }:{
    name: string,
    label?: string,
    kind?: string,
    min?: number,
    max?: number,
    value: boolean | string | number | object | [],
    isInArray?: boolean,
    update?: ({
      key,
      value
    }:{
      key: string,
      value: boolean | string | number | object | []
    }) => void
  }){

  const [data, setData] = useState(value);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isActivePosition, setIsActivePosition] = useState({
    top: 0,
    left: 0,
    height: 0
  });

  const inputRef = useRef(null);

  useEffect(() => {
    if (update){
      update({
        key: name,
        value: data
      });
    }
  }, [data]);

  useEffect(() => {
    setData(value);
  }, [value]);
  
  const isKindNumber:boolean = ['integer', 'float'].indexOf(kind) > -1;

  const specialKeys = [
    'Delete',
    'Backspace',
    'Control',
    'Enter',
    'Shift',
    'Alt',
    'ArrowUp',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight'
  ];

  const handleKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const key = event.key;
    const isSpecialKey = event.altKey || event.ctrlKey || event.shiftKey || event.metaKey || specialKeys.indexOf(event.key) > -1;

    //console.log(event);

    if (!isSpecialKey){
      let isValidKey = true;
      if (kind == 'integer'){
        isValidKey = '0123456789-'.indexOf(key) > -1;
      } else if (kind == 'float'){
        isValidKey = '0123456789.-'.indexOf(key) > -1;
      }

      if (!isValidKey){
        event.preventDefault();
        event.stopPropagation();
        return false;
      }
    } else {
      // Special key behavior

    }
  }

  const handlerOnBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    let newValue:string | number = event.target.value;
    
    if (isKindNumber){
      newValue = Number(newValue);
      
      if (kind == 'float'){
        newValue = parseFloat(newValue.toString().replace(/[^-?\d+(\.\d+)?]/g, ''));
      }
      if (kind == 'integer'){
        newValue = parseInt(newValue.toString().replace(/[^0-9.,\-]/g,''));
      }

      if (min != undefined){
        newValue = Math.max(min, newValue);
      }

      if (max != undefined){
        newValue = Math.min(max, newValue);
      }
    }

    if (newValue != data){
      setData(newValue);
      event.target.value = String(newValue);
    }
  }

  const handleColorClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const bounds = (event.target as HTMLDivElement).getBoundingClientRect();
    setIsActivePosition({
      top: bounds.top,
      left: bounds.left,
      height: bounds.height
    })
    
    setIsActive(true);
  }

  const colorExit = () => {
    setIsActive(false);
  }

  const colorUpdate = (v: string) => {
    setData(v);
    colorExit();
  }
  
  const returnColorPicker = () => {
    if (isActive && typeof data == 'string'){
      return <ColorPicker
        default_value={data}
        top={isActivePosition.top + isActivePosition.height}
        left={isActivePosition.left}
        exitHandle={colorExit}
        update={colorUpdate}
      />
    }
  }

  if (kind != 'color'){
    return (
      <label className={'float-left w-full flex justify-between mb-2 ' + (isInArray ? 'pl-1' : 'mb-2')}>
        <span className="">{label}</span>
        <input
          ref={inputRef}
          onKeyDown={handleKey}
          onKeyUp={handleKey}
          onBlur={handlerOnBlur}
          defaultValue={String(value)}
          type="text"
          className="bg-slate-200 border-stone-400 border-1 w-14 text-sm px-2 py-1 outline-none rounded-md">
        </input>
      </label>
    )
  } else {
    return (
      <>
        <label className={'float-left w-full flex justify-between relative ' + (isInArray ? 'pl-2' : 'mb-2')}>
          <span className="">{label}</span>
          <input
            readOnly
            ref={inputRef}
            onClick={handleColorClick}
            value={String(value)}
            type="text"
            className="bg-slate-200 border-stone-400 border-1 w-[102px] text-sm px-2 py-1 outline-none rounded-md cursor-pointer">
          </input>

          <div
            className="absolute inset-y-0 right-1 flex h-full items-center"
            onClick={handleColorClick}
          >
            <div
              className="size-5 rounded-md"
              style={{
                backgroundColor: String(data),
              }}
            />
          </div>
        </label>
        { returnColorPicker() }
      </>
    )
  }
}

export default InputLabel;