import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHandPaper } from '@fortawesome/fontawesome-free-solid';
import type { UserType } from '../../../../types/User.type';
import { useAppStateContext } from '../../../RoomsDisplay';
import './userController.css';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import Toggle from '../../toggle/Toggle';
import type { Socket } from 'socket.io-client';

type UserControllerProps = {
  user: UserType;
  socket?: Socket;
}

const UserController = ({ user, socket }: UserControllerProps) => {
 const { appState, setAppState } = useAppStateContext();
 const { controller, id} = user;

 const miniCheck = (): boolean => {
  if (id === appState.user?.id) return false;
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

  const passMic = (): void => {
    if(!appState.user?.controller.hasMic) return;
    if(!socket) return;
    setAppState(prev => ({
      ...prev,
      user: {
        ...prev.user!,
        controller: {
          ...prev.user!.controller!,
          hasMic: false,
        },
      },
    }));
    socket!.emit('passMic', { currentUser: appState.user?.id, newUser: id });
  };

  return (
    <div className={`controller ${miniCheck() && 'mini'}`}>

      <div className={`controller__title ${miniCheck() && 'mini'}`}>
        {user.name}
      </div>

      <div className='controller__controls-wrapper'>
        <div className={`controller__window ${miniCheck() && 'mini'}`}>
          { id === appState.user?.id && <Toggle action={handleAfk} data={controller.afk}/> }
          <div className={`controller__small-window afk ${controller.afk && 'true'} ${miniCheck() && 'mini'}`}>
            AFK
          </div>
        </div>

        <div className={`controller__window ${miniCheck() && 'mini'}`}>
          { user.id === appState.user?.id && <Toggle action={handleHandUp} data={controller.handUp}/> }
          <div className={`controller__small-window icon hand ${controller.handUp && 'up'} ${miniCheck() && 'mini'}`}>
            <FontAwesomeIcon icon={faHandPaper as IconProp} />
          </div>
        </div>
      </div>

      { miniCheck() &&
        <>
          { !controller.hasMic &&
            appState.user!.controller.hasMic &&
            <button
              className='controller__pass-mic'
              onClick={() => passMic()}
            >
              Pass Mic
            </button>
          }
          { controller.hasMic &&
            `I got it!`
          }
        </>
      }

    </div>
  );
};

export default UserController;