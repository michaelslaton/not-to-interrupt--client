import type { RoomDataType } from "../../../types/RoomData.type";
import './roomSmall.css';

type RoomProps = {
  room: RoomDataType;
  onClick: Function;
}


const RoomSmall = ({ room, onClick }: RoomProps ) => {

  return (
    <div
      onClick={()=> onClick(room.roomId)}
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