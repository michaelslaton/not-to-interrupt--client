import type { RoomDataType } from '../../../types/RoomData.type';
import type { UserType } from '../../../types/User.type';
import UserController from './user-controller/UserController';
import './room.css';
import type { Socket } from 'socket.io-client';
import { useState, type JSX } from 'react';

type RoomProps = {
  room: RoomDataType;
  leaveRoom: Function,
  user: UserType;
  socket: Socket;
};

const Room = ({ room, leaveRoom, user, socket }: RoomProps) => {
   if (!room || !Array.isArray(room.users)) return <p>Loading room data...</p>;
   const [chatMessage, setChatMessage] = useState<string>('');

   const sendChat = () => {
    const data = {roomId: room.roomId, user: user.name, message: chatMessage};
    setChatMessage('');
    socket.emit('chat', data);
   };

  const formatUrls = (text: string): (JSX.Element | string)[] => {
    const urlRegex = /((https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-z]{2,}(\/[^\s]*)?)/g;
    const parts: (string | JSX.Element)[] = [];

    let lastIndex: number = 0;
    const matches: RegExpExecArray[] = [...text.matchAll(urlRegex)];
    matches.forEach((match, i) => {
      const url: string = match[0];
      const index: number = match.index ?? 0;
      if (lastIndex < index) {
        parts.push(text.substring(lastIndex, index));
      };
      const hasProtocol: boolean = url.startsWith('http://') || url.startsWith('https://');
      const href: string = hasProtocol ? url : `http://${url}`;
      parts.push(
        <a key={i} href={href} target='_blank' rel='noopener noreferrer'>
          {url}
        </a>
      );
      lastIndex = index + url.length;
    });
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    };
    return parts;
  };

  const populateChat = () => {
    const chatData = room.chat.map((entry)=>(
      <div className='room-full__chat-entry-wrapper'>
        <div className='room-full__chat-entry-user'>
          {`${entry.user}`}
        </div>
        <div className='room-full__chat-entry-message'>
          {formatUrls(entry.message)}
        </div>
      </div>
    ));

    return (
      <>
        {chatData}
      </>
    );
  };

  return (
    <div className='room-full__wrapper'>
      <h2 className='room-full__room-title'>{room.name}</h2>
      <div className='room-full'>

        <div className='room-full__space'>
          <div className='room-full__chat-window'>
            {populateChat()}
          </div>
          
          <div className='room-full__chat-input-wrapper'>
            <textarea
              onChange={(e)=> setChatMessage(e.target.value)}
              value={chatMessage}
              className='room-full__chat-input'
            />

            <button
              className='room-full__chat-send'
              onClick={sendChat}
            >
              Send
            </button>
          </div>
        </div>

        <div className='room-full__space controllers'>
          <UserController user={user}/>
          {room.users.map((roomUser, i) => {
            if (roomUser.id !== user.id)
              return <UserController key={i} user={roomUser} />;
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