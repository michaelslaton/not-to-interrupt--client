import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import type { CrudDataType } from "../types/CrudData.type";
import FormInput from "./components/createForm";
import './roomsDisplay.css';

const socket = io('localhost:3000');

const RoomsDisplay = () => {
  const [crudData, setCrudData] = useState<CrudDataType[]>([]);
  const [formInput, setFormInput] = useState({
    createName: '',
    unsetUserName: '',
    userName: ''
  })

  useEffect(()=>{
    socket.on('crudData', (data)=>{
      setCrudData(data);
    })
  },[socket]);

  const handleChange = (e:  React.ChangeEvent<HTMLInputElement>, type: string): void => {
    if(type === 'Room') setFormInput({...formInput, createName: e.target!.value});
    else setFormInput({...formInput, unsetUserName: e.target!.value});
  };

  const handleCreate = (type: string):void => {
    if(type === 'Room'){
      if(formInput.createName.length < 1) return;
  
      let id:number= 0;
  
      if(!crudData.length) id = 1;
      else id = crudData[crudData.length - 1].roomId + 1;
  
      socket.emit('create', { roomId: id, name: formInput.createName, userName: formInput.userName });
      setFormInput({...formInput, createName: ''});
    }
    else if(type === 'User') {
      if(formInput.unsetUserName.length < 1) return;
      
      setFormInput({...formInput, unsetUserName: '', userName: formInput.unsetUserName});
    }
  };

  return (
    <div className='rooms-display'>
      { crudData.length ?
          <>
            {crudData.map((room)=> (
              <div key={room.roomId}>{room.name}</div>
            ))}
          </>
          :
          <p>There are no active rooms.</p>
      }

      { formInput.userName.length < 1 &&
        <FormInput
          name={formInput.unsetUserName}
          handleChange={handleChange}
          handleSubmit={handleCreate}
          type='User'
        />
      }

      { formInput.userName.length > 1 &&
        <FormInput
          name={formInput.createName}
          handleChange={handleChange}
          handleSubmit={handleCreate}
          type='Room'
        />
      }
    </div>
  );
};

export default RoomsDisplay;