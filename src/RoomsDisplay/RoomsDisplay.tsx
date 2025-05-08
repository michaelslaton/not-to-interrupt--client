import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import type { CrudDataType } from "../types/CrudData.type";

const socket = io('localhost:3000');

const RoomsDisplay = () => {
  const [crudData, setCrudData] = useState<CrudDataType[]>([]);

  useEffect(()=>{
    socket.on('crudData', (data)=>{
      setCrudData(data);
    })
  },[socket]);

  const handleCreate = (name: string):void => {
    let id:number= 0;
    if(!crudData.length) id = 1;
    else id = crudData[crudData.length - 1].roomId + 1;
    socket.emit('create', { roomId: id, name: name });
    return
  };

  return (
    <>
      { crudData.length ?
        <>
          {crudData.map((room)=> (
            <>{room.name}</>
          ))}
          <button
            onClick={()=> handleCreate('tempo 2')}
          >
            Create Room
          </button>
        </>
        :
        <>
          There are no active rooms. Would you like to create one?
          <button
            onClick={()=> handleCreate('tempo 1')}
          >
            Create Room
          </button>
        </>
      }
    </>
  );
};

export default RoomsDisplay;