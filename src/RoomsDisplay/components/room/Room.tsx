import type { RoomDataType } from "../../../types/RoomData.type";

type RoomProps = {
  room: RoomDataType;
};

const Room = ({ room }: RoomProps) => {

  return (
    <>
      {room.name}
    </>
  );
};

export default Room;