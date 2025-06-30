import Chat from './chat/Chat';
import UserController from './user-controller/UserController';
import { useAppStateContext } from '../../RoomsDisplay';
import type { RoomDataType } from '../../../types/RoomData.type';
import type { Socket } from 'socket.io-client';
import type { UserType } from '../../../types/User.type';
import './room.css';

type RoomProps = {
  room: RoomDataType;
  user: UserType;
  socket: Socket;
};

const Room = ({ room, user, socket }: RoomProps) => {
   if (!room || !Array.isArray(room.users)) return <p>Loading room data...</p>;
    const { setAppState } = useAppStateContext();

  const leaveRoom = (roomId: string, userId: string): void => {
    setAppState(prev => ({
      ...prev, 
      roomData: null,
      user: {
        ...prev.user!,
        controller: {
          ...prev.user!.controller,
          hasMic: false,
        }
      }
    }));
    socket.emit('leaveRoom', { roomId, userId });
    socket.emit('getRoomList');
  };

  return (
    <div className='room-full__wrapper'>

      <h2 className='room-full__room-title'>
        {room.name}
      </h2>

      <div className='room-full'>
        <Chat socket={socket} room={room} user={user}/>

        <div className='room-full__space controllers'>
          <UserController user={user} socket={socket}/>
          {room.users.map((roomUser, i) => {
            if (roomUser.id !== user.id)
              return <UserController key={i} user={roomUser} socket={socket}/>;
          })}
        </div>
      </div>

      <div className='leave-room-wrapper'>
        <button
          className='button'
          onClick={() => leaveRoom(room.roomId, user.id)}
        >
          Leave Room
        </button>
      </div>

    </div>
  );
};

export default Room;