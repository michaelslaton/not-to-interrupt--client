import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHandPaper } from '@fortawesome/fontawesome-free-solid';
import type { UserType } from '../../../../types/User.type';
import { useAppStateContext } from '../../../RoomsDisplay';
import './userController.css';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { useState, type JSX } from 'react';

type UserControllerProps = {
  user: UserType;
}

const UserController = ({ user }: UserControllerProps) => {
 const { appState, setAppState } = useAppStateContext();
 const [comment, setComment] = useState<string>('');

 const miniCheck = ():boolean => {
  if (user.id === appState.user?.id) return false;
  else return true
 };

 const handleAfk = ():void => {
  setAppState((prev)=> ({
    ...prev,
    user: {
      ...prev.user!,
      controller: {
        ...prev.user!.controller,
        afk: !prev.user!.controller.afk,
        handUp: false,
      }
    }
  }));
 };

  const handleHandUp = ():void => {
    setAppState((prev)=> ({
      ...prev,
      user: {
        ...prev.user!,
        controller: {
          ...prev.user!.controller,
          handUp: !prev.user!.controller.handUp,
          afk: false,
        }
      }
    }));
  };

  const formatUrls = (text: string) => {
    const urlRegex = /((https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-z]{2,}(\/[^\s]*)?)/g;
    const parts: (string | JSX.Element)[] = [];
    let lastIndex = 0;
    const matches = [...text.matchAll(urlRegex)];
    matches.forEach((match, i) => {
      const url = match[0];
      const index = match.index ?? 0;
      if (lastIndex < index) {
        parts.push(text.substring(lastIndex, index));
      };
      const hasProtocol = url.startsWith('http://') || url.startsWith('https://');
      const href = hasProtocol ? url : `http://${url}`;
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


  const submitComment = ():void => {
    if(comment === user.controller.comment) return;
    setAppState((prev)=> ({
      ...prev,
      user: {
        ...prev.user!,
        controller: {
          ...prev.user!.controller,
          comment: comment,
        }
      }
    }));
  };

  return (
    <div className={`controller ${miniCheck() && 'mini'}`}>

      <div className={`controller__title ${miniCheck() && 'mini'}`}>
        {user.name}
      </div>

      <div className='controller__controls-wrapper'>
        <div className='controller__window'>
          <button
            className={`controller__small-window-button ${miniCheck() && 'mini'}`}
            onClick={handleAfk}
          >
            AFK
          </button>
          <div className={`controller__small-window afk ${user.controller.afk && 'true'} ${miniCheck() && 'mini'}`}>
            AFK
          </div>
        </div>

        <div className='controller__window'>
          <button
            className={`controller__small-window-button ${miniCheck() && 'mini'}`}
            onClick={handleHandUp}
          >
            Hand Up
          </button>
          <div className={`controller__small-window icon hand ${user.controller.handUp && 'up'} ${miniCheck() && 'mini'}`}>
            <FontAwesomeIcon icon={faHandPaper as IconProp} />
          </div>
        </div>

        <div className={`controller__comment ${miniCheck() && 'mini'}`}>
          <textarea
            className={`controller__comment-input`}
            onChange={(e)=> setComment(e.target.value)}
            defaultValue={user.controller.comment}
            rows={6}
          />
          <button onClick={submitComment}>
            Submit
          </button>
        </div>
        { user.id !== appState.user?.id &&
          <div className='controller__comment-input'>
            {formatUrls(user.controller.comment)}
          </div>
        }
      </div>

    </div>
  );
};

export default UserController;