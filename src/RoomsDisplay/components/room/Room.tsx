import type { RoomDataType } from "../../../types/RoomData.type";

type RoomProps = {
  room: RoomDataType;
};

const Room = ({ room }: RoomProps) => {
   if (!room || !Array.isArray(room.users)) return <p>Loading room data...</p>;

  return (
    <>
      {room.users.map((user)=> (
        <>{user.name}</>
      ))}
    </>
  );
};

export default Room;