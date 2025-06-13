import { createContext, useContext, useEffect, useState, type JSX } from 'react';
import { io, Socket } from 'socket.io-client';
import { v4 as uuid } from 'uuid';
import FormInput from './components/form-input/FormInput';
import RoomSmall from './components/room-small/RoomSmall';
import Room from './components/room/Room';
import type { RoomDataType } from '../types/RoomData.type';
import type { UserType } from '../types/User.type';
import './roomsDisplay.css';

const socket: Socket = io(import.meta.env.VITE_SOCKET_URL || 'localhost:3000');

type FormStateType = {
  createName: string;
  unsetUserName: string;
};

type AppStateType = {
  user: UserType | null;
  roomData: RoomDataType | null;
};

export const AppStateContext = createContext<{
  appState: AppStateType;
  setAppState: React.Dispatch<React.SetStateAction<AppStateType>>;
} | undefined>(undefined);

export const useAppStateContext = () => {
  const context = useContext(AppStateContext);
  if(!context) throw new Error('useAppStateContext must be used inside AppStateContext.Provider');
  return context;
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

  useEffect(() => {
    const handleRoomData = (data: RoomDataType) => {
      setAppState(prev => ({ ...prev, roomData: data }));
    };

    const handleRoomList = (data: RoomDataType[]) => {
      setRoomList(data);
      if (appState.user) {
        const foundRoom = data.find(room =>
          room.users.some(user => user.id === appState.user!.id)
        );
        if (foundRoom) {
          setAppState(prev => ({ ...prev, roomData: foundRoom }));
        } else {
          setAppState(prev => ({ ...prev, roomData: null }));
        }
      }
    };

    socket.on('roomData', handleRoomData);
    socket.on('getRoomList', handleRoomList);

    return () => {
      socket.off('roomData', handleRoomData);
      socket.off('getRoomList', handleRoomList);
    };
  }, [appState.user]);

  useEffect(() => {
    if (appState.roomData && appState.user) {
      socket.emit('controllerUpdate', {
        user: appState.user,
        roomId: appState.roomData?.roomId
      });
    };
  }, [appState.user]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (appState.user && appState.roomData) {
        socket.emit('leaveRoom', {
          roomId: appState.roomData.roomId,
          userId: appState.user.id,
        });
      };
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [appState.user, appState.roomData]);

  // ----- SOCKET COMMANDS ----- >
  const enterRoom = (roomId: string): void => {
    socket.emit('enterRoom', { roomId, user: appState.user });
  };

  const leaveRoom = (roomId: string, userId: string): void => {
    setAppState(prev => ({ ...prev, roomData: null }));
    socket.emit('leaveRoom', { roomId, userId });
    socket.emit('getRoomList');
  };

  const handleCreateUser = (e: Event): void => {
    e.preventDefault();
    if (formState.unsetUserName.trim().length < 1) return;
    const newUser: UserType = {
      id: uuid(),
      name: formState.unsetUserName.trim(),
      controller: {
        afk: false,
        handUp: false,
        comment: '',
      },
    };
    setAppState(prev => ({
      ...prev,
      user: newUser
    }));
    setFormState(prev => ({ ...prev, unsetUserName: '' }));
    socket.emit('getRoomList');
  };

  const handleCreateRoom = (e: Event): void => {
    e.preventDefault();
    const name = formState.createName.trim();
    if (!name.length) return;
    if (!appState.user) return;
    if (roomList.some(room => room.name.toLowerCase() === name.toLowerCase())) return;
    if (roomList.some(room => room.users.some(user => user.id === appState.user!.id))) return;

    const newRoom: RoomDataType = {
      roomId: uuid(),
      name: name,
      hostId: appState.user.id,
      users: [{...appState.user, socketId: socket.id!}],
    };

    socket.emit('createRoom', newRoom);
    setFormState(prev => ({ ...prev, createName: '' }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, type: string): void => {
    if (type === 'Room') {
      setFormState(prev => ({ ...prev, createName: e.target.value }));
    } else {
      setFormState(prev => ({ ...prev, unsetUserName: e.target.value }));
    }
  };

  const populateRoomList = (): JSX.Element => {
    if (!appState.user) return <></>;
    if (!roomList.length) return <p>There are no active rooms.</p>;

    return (
      <div className='rooms-display__room-list'>
        {roomList.map((room, i) => (
          <span key={i}>
            <RoomSmall room={room} onClick={enterRoom} />
          </span>
        ))}
      </div>
    );
  };

  return (
    <>
      {appState.roomData ? (
          <AppStateContext.Provider value={{appState, setAppState}}>
            <div className='rooms-display'>
              <Room room={appState.roomData} leaveRoom={leaveRoom} user={appState.user!} />
            </div>
          </AppStateContext.Provider>
      ) : (
        <div className='rooms-display'>
          {populateRoomList()}

          {!appState.user && (
            <FormInput
              name={formState.unsetUserName}
              handleChange={handleChange}
              handleSubmit={handleCreateUser}
              type='User'
            />
          )}

          {appState.user && !roomList.some(room => room.hostId === appState.user!.id) && (
            <FormInput
              name={formState.createName}
              handleChange={handleChange}
              handleSubmit={handleCreateRoom}
              type='Room'
            />
          )}

          {appState.user && roomList.some(room => room.hostId === appState.user!.id) && (
            <h2>You already have a room!</h2>
          )}
        </div>
      )}
    </>
  );
};

export default RoomsDisplay;