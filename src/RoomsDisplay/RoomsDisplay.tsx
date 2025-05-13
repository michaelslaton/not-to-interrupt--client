import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import type { CrudDataType } from '../types/CrudData.type';
import FormInput from './components/FormInput';
import './roomsDisplay.css';
import RoomSmall from './components/RoomSmall';
import type { UserType } from '../types/User.type';

const socket = io('localhost:3000');

type FormInputType = {
    createName: string;
    unsetUserName: string;
    user: UserType | null;
}

const RoomsDisplay = () => {
  const [crudData, setCrudData] = useState<CrudDataType[]>([]);
  const [formInput, setFormInput] = useState<FormInputType>({
    createName: '',
    unsetUserName: '',
    user: null,
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

      if(crudData.some((data) => data.name.toLowerCase() === formInput.createName.toLowerCase())) return;
      if(crudData.some((data) => data.users.some((user: UserType) => user.name === formInput.user!.name))) return;
  
      socket.emit('create', { roomId: id, name: formInput.createName, userName: formInput.user!.name, users: [formInput.user] });
      setFormInput({...formInput, createName: ''});
    }
    else if(type === 'User') {
      if(formInput.unsetUserName.length < 1) return;
      
      setFormInput({...formInput, unsetUserName: '', user: { id: 1, name: formInput.unsetUserName }});
    }
  };

  return (
    <div className='rooms-display'>
      { crudData.length ?
          <div className='rooms-display__room-list'>
            {crudData.map((room)=> (
              <RoomSmall room={room}/>
            ))}
          </div>
          :
          <p>There are no active rooms.</p>
      }

      { !formInput.user &&
        <FormInput
          name={formInput.unsetUserName}
          handleChange={handleChange}
          handleSubmit={handleCreate}
          type='User'
        />
      }

      { formInput.user?.name &&
        formInput.user.name.length > 1 &&
        !crudData.some((data) => data.users.some((user: UserType) => user.name === formInput.user!.name)) ?
        <FormInput
          name={formInput.createName}
          handleChange={handleChange}
          handleSubmit={handleCreate}
          type='Room'
        />
        :
        <h2>You already have a room!</h2>
      }
    </div>
  );
};

export default RoomsDisplay;