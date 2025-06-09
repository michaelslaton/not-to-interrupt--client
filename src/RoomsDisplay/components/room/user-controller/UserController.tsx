import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHandPaper } from '@fortawesome/fontawesome-free-solid';
import type { UserType } from '../../../../types/User.type';
import { useAppStateContext } from '../../../RoomsDisplay';
import './userController.css';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { useState, type JSX } from 'react';
import Toggle from '../../toggle/Toggle';

type UserControllerProps = {
  user: UserType;
}

const UserController = ({ user }: UserControllerProps) => {
 const { appState, setAppState } = useAppStateContext();
 const [comment, setComment] = useState<string>('');

 const miniCheck = (): boolean => {
  if (user.id === appState.user?.id) return false;
  else return true
 };

 const handleAfk = (afk: boolean): void => {
  setAppState((prev)=> ({
    ...prev,
    user: {
      ...prev.user!,
      controller: {
        ...prev.user!.controller,
        afk: afk,
        handUp: false,
      }
    }
  }));
 };

  const handleHandUp = (handUp: boolean): void => {
    setAppState((prev)=> ({
      ...prev,
      user: {
        ...prev.user!,
        controller: {
          ...prev.user!.controller,
          handUp: handUp,
          afk: false,
        }
      }
    }));
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


  const submitComment = (): void => {
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

  const commentColorCheck = (): string => {
    const userComment: string = user.controller.comment;
    if(userComment === '' && comment === '') return ''
    else if (comment === user.controller.comment) return 'match'
    else return 'un-match';
  };

  return (
    <div className={`controller ${miniCheck() && 'mini'}`}>

      <div className={`controller__title ${miniCheck() && 'mini'}`}>
        {user.name}
      </div>

      <div className='controller__controls-wrapper'>
        <div className={`controller__window ${miniCheck() && 'mini'}`}>
          { user.id === appState.user?.id && <Toggle action={handleAfk} data={user.controller.afk}/> }
          <div className={`controller__small-window afk ${user.controller.afk && 'true'} ${miniCheck() && 'mini'}`}>
            AFK
          </div>
        </div>

        <div className={`controller__window ${miniCheck() && 'mini'}`}>
          { user.id === appState.user?.id && <Toggle action={handleHandUp} data={user.controller.handUp}/> }
          <div className={`controller__small-window icon hand ${user.controller.handUp && 'up'} ${miniCheck() && 'mini'}`}>
            <FontAwesomeIcon icon={faHandPaper as IconProp} />
          </div>
        </div>

        <div className={`controller__comment ${miniCheck() && 'mini'}`}>
          <textarea
            className={`controller__comment-input ${commentColorCheck()}`}
            onChange={(e)=> setComment(e.target.value)}
            defaultValue={user.controller.comment}
            rows={6}
          />
          <button
            className='controller__comment-submit'
            onClick={submitComment}>
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