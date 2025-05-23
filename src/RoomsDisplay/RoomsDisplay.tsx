import { useEffect, useState, type JSX } from 'react';
import { io } from 'socket.io-client';
import { v4 as uuid } from 'uuid';
import FormInput from './components/form-input/FormInput';
import RoomSmall from './components/room-small/RoomSmall';
import type { RoomDataType } from '../types/RoomData.type';
import type { UserType } from '../types/User.type';
import './roomsDisplay.css';
import Room from './components/room/Room';
// import Room from './components/room/Room';

const socket = io('localhost:3000');

type FormStateType = {
  createName: string;
  unsetUserName: string;
};

type AppStateType = {
    user: UserType | null;
    roomData: RoomDataType | null;
};

const RoomsDisplay = () => {
  const [roomList, setRoomList] = useState<RoomDataType[]>([]);
  const [formState, setFormState] = useState<FormStateType>({
    createName: '',
    unsetUserName: ''
  });
  const [appState, setAppState] = useState<AppStateType>({
    user: null,
    roomData: null,
  });

  // useEffect(() => {
  //   const handleRoomListData = (data: RoomDataType[]) => {
  //     setRoomList(data);
  //   };
  //   socket.emit('getRoomList');
  //   socket.on('getRoomList', handleRoomListData);

  //   return () => {
  //     socket.off('getRoomList', handleRoomListData);
  //   };
  // }, [socket]);

  useEffect(() => {
  const handleBeforeUnload = () => {
    if (appState.user && appState.roomData) {
      socket.emit('leaveRoom', {
        roomId: appState.roomData.roomId,
        userId: appState.user.id,
      });
    }
  };

  window.addEventListener('beforeunload', handleBeforeUnload);

  return () => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
  };
}, [appState.user, appState.roomData]);

  const enterRoom = (roomId: string): void => {
    socket.emit('enterRoom', { roomId: roomId, user: appState.user });
    setAppState(prev => ({...prev, roomData: roomList.find((room)=> room.roomId === roomId) || null}));
    socket.on('roomData', (data)=> setAppState(prev => ({...prev, roomData: data })))
  };

  const populateRoomList = (): JSX.Element => {
    if(!roomList.length) return <p>There are no active rooms.</p>;

    return (
      <div className='rooms-display__room-list'>
        {roomList.map((room,i)=> (
          <span key={i}>
            <RoomSmall room={room} onClick={enterRoom}/>
          </span>
        ))}
      </div>
    );
  };

  const handleChange = (e:  React.ChangeEvent<HTMLInputElement>, type: string): void => {
    if(type === 'Room') setFormState({...formState, createName: e.target!.value});
    else setFormState({...formState, unsetUserName: e.target!.value});
  };

  const handleCreateRoom = ():void => {
    if(formState.createName.length < 1) return;
    if(roomList.some((room) => room.name.toLowerCase() === formState.createName.toLowerCase())) return;
    if(roomList.some((room) => room.users.some((user: UserType) => user.id === appState.user!.id))) return;

    const newRoom = {
      roomId: uuid(),
      name: formState.createName,
      hostId: appState.user!.id,
      users: [appState.user!],
    };

    socket.emit('createRoom', newRoom);
    
    setFormState({ ...formState, createName: '' });
    setAppState({ ...appState, roomData: newRoom });

    socket.on('roomData', (data)=> setAppState(prev => ({...prev, roomData: data })));
  };

  const handleCreateUser = ():void => {
    if(formState.unsetUserName.length < 1) return;

    setFormState({
      ...formState,
      unsetUserName: '',
    });
    setAppState({
      ...appState,
      user: { id: uuid(),
      name: formState.unsetUserName,
    }});

    const handleRoomListData = (data: RoomDataType[]) => {
      setRoomList(data);
    };
    socket.emit('getRoomList');
    socket.on('getRoomList', handleRoomListData);
  };

  return (
    <>
    { appState.roomData
      ? <div className='rooms-display'>
        <Room room={appState.roomData}/>
      </div>
      : <div className='rooms-display'>
        {populateRoomList()}

        { !appState.user &&
          <FormInput
            name={formState.unsetUserName}
            handleChange={handleChange}
            handleSubmit={handleCreateUser}
            type='User'
          />
        }

        { appState.user && (
            roomList.some((room) => room.hostId === appState.user!.id)
              ? <h2>You already have a room!</h2>
              : <FormInput
                  name={formState.createName}
                  handleChange={handleChange}
                  handleSubmit={handleCreateRoom}
                  type='Room'
                />
          )
        }
      </div>
    }
    </>
  );
};

export default RoomsDisplay;