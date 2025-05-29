import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHandPaper } from '@fortawesome/fontawesome-free-solid';
import type { UserType } from '../../../../types/User.type';
import { useAppStateContext } from '../../../RoomsDisplay';
import './userController.css';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';

type UserControllerProps = {
  user: UserType;
}

const UserController = ({ user }: UserControllerProps) => {
 const { appState, setAppState } = useAppStateContext();

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
        afk: !prev.user!.controller.afk
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
          handUp: !prev.user!.controller.handUp
        }
      }
    }));
  };

  return (
    <div className={`controller ${miniCheck() && 'mini'}`}>

      <div className={`controller__title ${miniCheck() && 'mini'}`}>
        {user.name}
      </div>

      <div className='controller__window'>
        <div className={`controller__small-window afk ${user.controller.afk && 'true'} ${miniCheck() && 'mini'}`}>
          AFK
        </div>
        <button
          className={`controller__small-window-button ${miniCheck() && 'mini'}`}
          onClick={handleAfk}
        >
          AFK
        </button>
      </div>

      <div className='controller__window'>
        <div className={`controller__small-window icon hand ${user.controller.handUp && 'up'} ${miniCheck() && 'mini'}`}>
          <FontAwesomeIcon icon={faHandPaper as IconProp} />
        </div>
        <button
          className={`controller__small-window-button ${miniCheck() && 'mini'}`}
          onClick={handleHandUp}
        >
          Hand Up
        </button>
      </div>

    </div>
  );
};

export default UserController;