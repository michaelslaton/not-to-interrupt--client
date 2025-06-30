import type { Socket } from "socket.io-client";
import type { RoomDataType } from "../../../types/RoomData.type";
import './roomSmall.css';
import { useAppStateContext } from "../../RoomsDisplay";

type RoomProps = {
  room: RoomDataType;
  socket: Socket;
}


const RoomSmall = ({ room, socket }: RoomProps ) => {
  const {appState} = useAppStateContext();

  const enterRoom = (roomId: string): void => {
    socket.emit('enterRoom', { roomId, user: {...appState.user, socketId: socket.id} });
  };

  return (
    <div
      onClick={()=> enterRoom(room.roomId)}
      className='room-small'
    >
      <div className='room-small__title'>
        <h2>{room.name}</h2>
      </div>

      <div className='room-small__users'>
        {room.users.map((user,i)=> (
          <div key={i} className='room-small__user-small'>
            {user.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomSmall;