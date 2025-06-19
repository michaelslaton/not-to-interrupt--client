import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHandPaper } from '@fortawesome/fontawesome-free-solid';
import type { UserType } from '../../../../types/User.type';
import { useAppStateContext } from '../../../RoomsDisplay';
import './userController.css';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import Toggle from '../../toggle/Toggle';

type UserControllerProps = {
  user: UserType;
}

const UserController = ({ user }: UserControllerProps) => {
 const { appState, setAppState } = useAppStateContext();

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
      </div>

    </div>
  );
};

export default UserController;