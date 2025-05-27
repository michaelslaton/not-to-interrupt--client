import type { RoomDataType } from "../../../types/RoomData.type";
import type { UserType } from "../../../types/User.type";
import './room.css';
import UserController from "./user-controller/UserController";

type RoomProps = {
  room: RoomDataType;
  leaveRoom: Function,
  user: UserType;
};

const Room = ({ room, leaveRoom, user }: RoomProps) => {
   if (!room || !Array.isArray(room.users)) return <p>Loading room data...</p>;

  return (
    <div className='room-full__wrapper'>
        <h2 className='room-full__room-title'>
          {room.name}
        </h2>

      <div className='room-full'>
        {room.users.map((user)=> (
          <UserController user={user}/>
        ))}
      </div>

      <button
        className='room-full__leave-button'
        onClick={()=> leaveRoom(room.roomId, user.id)}
      >
        Leave Room
      </button>
    </div>
  );
};

export default Room;