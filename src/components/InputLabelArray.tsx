import { useState, useEffect } from "react";
import InputLabel from "./InputLabel";

const DeletIcon = (props: React.ComponentPropsWithoutRef<"svg">) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
      {...props}
    >
      <line x1="1" y1="1" x2="21" y2="21"/>
      <line x1="1" y1="21" x2="21" y2="1"/>
    </svg>
  );
};

function InputLabelArray(
  {
    name = 'undefinedname',
    label = '',
    itemLabel = '',
    kind = '',
    value = [],
    defaultValue = false,
    update
  }:{
    name: string,
    label?: string,
    itemLabel?: string,
    kind: string,
    value?: (boolean | string | number | object | [])[],
    defaultValue?: boolean | string | number | object | [],
    update?: ({
      key,
      value
    }:{
      key: string,
      value: boolean | string | number | object | []
    }) => void
  }){

  const [data, setData] = useState(value);
  itemLabel = itemLabel || kind.charAt(0).toUpperCase() + kind.slice(1);
  //const inputRef = useRef(null);

  useEffect(() => {
    if (update){
      update({
        key: name,
        value: data
      });
    }
  }, [data]);

  const inputUpdated = ({
    key,
    value
  }:{
    key: number | string,
    value: boolean | string | number | object | []
  }) => {
    const newData:(boolean | string | number | object | [])[] = [...data];
    key = Number(key);
    newData[key] = value;
    setData(newData)
  }

  const addToArray = (item = defaultValue || {
    integer: 0,
    float: 0,
    string: '',
    color: '#000000'
  }[kind] || 'default') => {
    console.log(item);
    setData([...data, item])
  }

  const deleteItem = (deleteIndex:number) => {
    const newData:(boolean | string | number | object | [])[] = [];
    data.map((item, i) => {
      if (deleteIndex != i){
        newData.push(item);
      }
    });

    setData(newData);
  }

  return (
    <>
      <button
        className="bg-gray-300 px-2 py-1 rounded w-full mt-4 mb-2"
        onClick={() => {addToArray()}}
      >{label}</button>
      {data.map((item, index) => (
        <div key={index} className="flex mb-2 justify-center items-center">
          <button
            className="aspect-square rounded-full bg-slate-200 w-[30px] h-[30px] flex items-center justify-around"
            onClick={() => {
              deleteItem(index);
            }}
          ><DeletIcon width={16} height={16}/></button>
          <InputLabel
            key={index}
            label={itemLabel + ' ' + (index + 1)}
            name={String(index)}
            kind={kind}
            value={item}
            update={inputUpdated}
            isInArray={true}
          />
        </div>
      ))}
    </>
  )
}

export default InputLabelArray;