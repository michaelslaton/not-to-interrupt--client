import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { v4 as uuid } from 'uuid';
import FormInput from './components/FormInput';
import RoomSmall from './components/RoomSmall';
import type { RoomDataType } from '../types/RoomData.type';
import type { UserType } from '../types/User.type';
import './roomsDisplay.css';

const socket = io('localhost:3000');

type FormStateType = {
  createName: string;
  unsetUserName: string;
};

type AppStateType = {
    user: UserType | null;
};

const RoomsDisplay = () => {
  const [roomList, setRoomList] = useState<RoomDataType[]>([]);
  const [formState, setFormState] = useState<FormStateType>({
    createName: '',
    unsetUserName: ''
  });
  const [appState, setAppState] = useState<AppStateType>({
    user: null,
  });

  useEffect(() => {
    const handleCrudData = (data: RoomDataType[]) => {
      setRoomList(data);
    };

    socket.on('crudData', handleCrudData);

    return () => {
      socket.off('crudData', handleCrudData); // cleanup on unmount
    };
  }, [socket]);

  const populateRoomList = () => {
    if(!roomList.length) return <p>There are no active rooms.</p>;

    return (
      <div className='rooms-display__room-list'>
        {roomList.map((room,i)=> (
          <span key={i}>
            <RoomSmall room={room}/>
          </span>
        ))}
      </div>
    );
  };

  const handleChange = (e:  React.ChangeEvent<HTMLInputElement>, type: string): void => {
    if(type === 'Room') setFormState({...formState, createName: e.target!.value});
    else setFormState({...formState, unsetUserName: e.target!.value});
  };

  const handleCreate = (type: string):void => {
    if(type === 'Room'){
      if(formState.createName.length < 1) return;
      if(roomList.some((room) => room.name.toLowerCase() === formState.createName.toLowerCase())) return;
      if(roomList.some((room) => room.users.some((user: UserType) => user.id === appState.user!.id))) return;
  
      socket.emit('create', { roomId: uuid(), name: formState.createName, hostId: appState.user!.id, users: [appState.user] });
      setFormState({...formState, createName: ''});
    }
    else if(type === 'User') {
      if(formState.unsetUserName.length < 1) return;
      
      setFormState({...formState, unsetUserName: ''});
      setAppState({...appState, user: { id: uuid(), name: formState.unsetUserName }});
    }
  };

  return (
    <>
      <div className='rooms-display'>
        {populateRoomList()}

        { !appState.user &&
          <FormInput
            name={formState.unsetUserName}
            handleChange={handleChange}
            handleSubmit={handleCreate}
            type='User'
          />
        }

        { appState.user && (
            roomList.some((room) => room.hostId === appState.user!.id)
              ? <h2>You already have a room!</h2>
              : <FormInput
                  name={formState.createName}
                  handleChange={handleChange}
                  handleSubmit={handleCreate}
                  type='Room'
                />
          )
        }
      </div>
    </>
  );
};

export default RoomsDisplay;