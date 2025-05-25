import type { RoomDataType } from "../../../types/RoomData.type";
import type { UserType } from "../../../types/User.type";

type RoomProps = {
  room: RoomDataType;
  leaveRoom: Function,
  user: UserType;
};

const Room = ({ room, leaveRoom, user }: RoomProps) => {
   if (!room || !Array.isArray(room.users)) return <p>Loading room data...</p>;

  return (
    <>
      {room.users.map((user)=> (
        <>{user.name}</>
      ))}
      <button onClick={()=> leaveRoom(room.roomId, user.id)}>Leave Room</button>
    </>
  );
};

export default Room;