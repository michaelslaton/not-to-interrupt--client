import { useState, type FormEvent, type JSX } from 'react';
import type { RoomDataType } from '../../../../types/RoomData.type';
import type { Socket } from 'socket.io-client';
import type { UserType } from '../../../../types/User.type';
import './chat.css';

type ChatProps = {
  socket: Socket;
  room: RoomDataType;
  user: UserType;
};

const Chat = (data: ChatProps) => {
  const [chatMessage, setChatMessage] = useState<string>('');
  const { socket, room, user } = data;

  const sendChat = (e: FormEvent): void => {
    e.preventDefault();
    const data = {
      roomId: room.roomId,
      user: user.name,
      message: chatMessage
    };
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

  const populateChat = (): JSX.Element => {
    const chatData = [...room.chat].reverse().map((entry, i) => (
      <div key={i} className='chat__entry-wrapper'>
        <div className='chat__entry-user'>{entry.user}</div>
        <div className='chat__entry-message'>
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
    <div className='room-full__space chat__no-anchor'>
      <div className='chat__window'>
        {populateChat()}
      </div>
      
      <form
        onSubmit={(e)=> sendChat(e)}
        className='chat__input-wrapper'
      >
        <input
          onChange={(e)=> setChatMessage(e.target.value)}
          value={chatMessage}
          className='chat__input'
        />

        <button
          type='submit'
          className='chat__send'
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;