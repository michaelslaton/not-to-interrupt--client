import type { CrudDataType } from "../../types/CrudData.type";
import '../roomsDisplay.css';

type RoomProps = {
  room: CrudDataType;
}


const RoomSmall = ({ room }: RoomProps ) => {

  return (
    <div className='room-small'>
      <div className='room-small__title'>
        <h2>{room.name}</h2>
      </div>

      <div className='room-small__users'>
        {room.users.map((user)=> (
          <div className='room-small__user-small'>{user.name}</div>
        ))}
      </div>
    </div>
  );
};

export default RoomSmall;