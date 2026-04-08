import { useState, useEffect } from "react";

function SpiroEllipse(){
  const width = .4;
  const height = .4;

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

export default SpiroEllipse;