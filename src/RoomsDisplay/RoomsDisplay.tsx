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
const regExOnlyLettersAndSpace: RegExp = /^[A-Za-z ]+$/;

(window as any).socket = socket;

export type FormStateType = {
  newRoomName: string;
  newUserName: string;
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
    newRoomName: '',
    newUserName: ''
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
    socket.on('receiveMic', () => {
      setAppState(prev => ({
        ...prev,
        user: {
          ...prev.user!,
          controller: {
            ...prev.user!.controller!,
            hasMic: true,
            handUp: false,
          },
        },
      }));
    });
    socket.on('pingCheck', ()=> socket.emit('pongCheck'));

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
  const handleCreateUser = (e: Event): void => {
    e.preventDefault();
    const enteredName: string = formState.newUserName.trim();
    if(!socket.id) return console.error('No open socket');
    if(enteredName.length < 3) return console.error(`Entered User name is too short. (3 characters minimum)`);
    if(enteredName.length > 8) return console.error(`Entered User name is too long. (8 characters maximum)`);
    if(!regExOnlyLettersAndSpace.test(enteredName)) return console.error('Entered User name containes symbols or numbers.');
    if((enteredName.match(/ /g) || []).length > 1) return console.error('Entered User name containes too many spaces.');

    const newUser: UserType = {
      id: uuid(),
      name: enteredName,
      socketId: socket.id,
      controller: {
        afk: false,
        handUp: false,
        hasMic: false,
        comment: '',
      },
    };
    setAppState(prev => ({
      ...prev,
      user: newUser
    }));
    setFormState(prev => ({ ...prev, newUserName: '' }));
    socket.emit('getRoomList');
  };

  const handleCreateRoom = (e: Event): void => {
    e.preventDefault();
    const enteredName: string = formState.newRoomName.trim();
    if (!enteredName.length) return;
    if (!appState.user) return;
    if (roomList.some(room => room.name.toLowerCase() === enteredName.toLowerCase())) return;
    if (roomList.some(room => room.users.some(user => user.id === appState.user!.id))) return;
    if(enteredName.length < 3) return console.error(`Entered Room name is too short. (3 characters minimum)`);
    if(enteredName.length > 15) return console.error(`Entered Room name is too long. (15 characters maximum)`);
    if(!regExOnlyLettersAndSpace.test(enteredName)) return console.error('Entered Room name containes symbols or numbers.');
    if((enteredName.match(/ /g) || []).length > 1) return console.error('Entered Room name containes too many spaces.');

    const newRoom: RoomDataType = {
      roomId: uuid(),
      name: enteredName,
      hostId: appState.user.id,
      users: [{...appState.user, controller: {...appState.user.controller, hasMic: true}}],
      chat: []
    };

    socket.emit('createRoom', newRoom);
    setAppState((prev) => ({
      ...prev,
      user: {
        ...prev.user!,
        controller: { ...prev.user!.controller!, hasMic: true },
      },
    }));
    setFormState(prev => ({ ...prev, newRoomName: '' }));
  };

  const populateRoomList = (): JSX.Element => {
    if (!appState.user) return <></>;
    if (!roomList.length) return <p>There are no active rooms.</p>;
    return (
      <div className='rooms-display__room-list'>
        {roomList.map((room, i) => (
          <span key={i}>
            <RoomSmall
              room={room}
              socket={socket}
            />
          </span>
        ))}
      </div>
    );
  };

  return (
    <AppStateContext.Provider value={{appState, setAppState}}>
      {appState.roomData ? (
            <div className='rooms-display'>
              <Room room={appState.roomData} user={appState.user!} socket={socket}/>
            </div>
      ) : (
        <div className='rooms-display'>
          <div className='central-space'>
            {populateRoomList()}

            {!appState.user && (
              <FormInput
              name={formState.newUserName}
              handleSubmit={handleCreateUser}
              setFormState={setFormState}
              type='User'
              maxLength={8}
              />
            )}

            {appState.user && !roomList.some(room => room.hostId === appState.user!.id) && (
              <FormInput
              name={formState.newRoomName}
              handleSubmit={handleCreateRoom}
              setFormState={setFormState}
              type='Room'
              maxLength={15}
              />
            )}
          </div>

          {appState.user && roomList.some(room => room.hostId === appState.user!.id) && (
            <h2>You already have a room!</h2>
          )}
          

        </div>
      )}
    </AppStateContext.Provider>
  );
};

export default RoomsDisplay;