import { useState, useEffect } from "react";
import InputLabel from "./InputLabel";

const DeletIcon = (props: React.ComponentPropsWithoutRef<"svg">) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path
        fillRule="evenodd"
        d="M11.097 1.515a.75.75 0 0 1 .589.882L10.666 7.5h4.47l1.079-5.397a.75.75 0 1 1 1.47.294L16.665 7.5h3.585a.75.75 0 0 1 0 1.5h-3.885l-1.2 6h3.585a.75.75 0 0 1 0 1.5h-3.885l-1.08 5.397a.75.75 0 1 1-1.47-.294l1.02-5.103h-4.47l-1.08 5.397a.75.75 0 1 1-1.47-.294l1.02-5.103H3.75a.75.75 0 0 1 0-1.5h3.885l1.2-6H5.25a.75.75 0 0 1 0-1.5h3.885l1.08-5.397a.75.75 0 0 1 .882-.588ZM10.365 9l-1.2 6h4.47l1.2-6h-4.47Z"
        clipRule="evenodd"
      />
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
            className="aspect-square rounded-full bg-slate-200 w-[30px] h-[30px]"
            onClick={() => {
              deleteItem(index);
            }}
          ><DeletIcon width={20} height={20}/></button>
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