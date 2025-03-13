import { useState, useEffect, useRef } from "react";
import ColorPicker from "./ColorPicker";

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
    name: string | number,
    label?: string,
    kind?: string,
    min?: number,
    max?: number,
    value: any,
    isInArray?: boolean,
    update?: (n: any) => any
  }){

  const [data, setData] = useState(value);
  const [isActive, setIsActive] = useState<any>(false);
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
  
  const isKindNumber = ['integer', 'float'].indexOf(kind) > -1;
  //const isKindColor = kind == 'color';

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
  const handleKey = (event: any) => {
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
  const handlerOnChange = (event: any) => {

  }
  const handlerOnBlur = (event: any)  => {
    const value = event.target.value;
    let newValue:any = value;
    
    if (kind == 'integer'){

    } else if (kind == 'float'){
      newValue = parseFloat(newValue.replace(/[^-?\d+(\.\d+)?]/g, ''));
    } else if (kind == 'integer'){
      newValue = parseInt(newValue.replace(/[^0-9.,\-]/g,''));
    }

    if (isKindNumber && min != undefined){
      newValue = Math.max(min, newValue);
    }

    if (isKindNumber && max != undefined){
      newValue = Math.min(max, newValue);
    }

    if (newValue != data){
      setData(newValue);
      event.target.value = newValue;
    }
  }
  const handleColorClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const bounds = event.target.getBoundingClientRect();
    setIsActive(bounds);
  }
  const colorExit = () => {
    setIsActive(false);
  }
  const colorUpdate = (v: any) => {
    
    //console.log(inputRef);
    //console.log(v);
    //inputRef.current.value = v;
    setData(v);

    colorExit();
  }
  const returnColorPicker = () => {
    if (isActive){
      return <ColorPicker
        default_value={data}
        top={isActive.top + isActive.height}
        left={isActive.left}
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
          onChange={handlerOnChange}
          onBlur={handlerOnBlur}
          defaultValue={value}
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
            value={data}
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
                backgroundColor: data,
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