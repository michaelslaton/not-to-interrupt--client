import type { UserType } from '../../../../types/User.type';
import { useAppStateContext } from '../../../RoomsDisplay';
import './userController.css';

type UserControllerProps = {
  user: UserType;
}

const UserController = ({ user }: UserControllerProps) => {
 const { appState, setAppState } = useAppStateContext();

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
  console.log('AFK class applied:', user.controller.afk ? 'true' : 'false');
  console.log('Appstate Level AFK class applied:', appState.user?.controller);
 };

  return (
    <div className='controller'>
      <div className='controller__title'>
        {user.name}
      </div>
      <div className='controller__afk-window'>
        <div className={`controller__afk ${user.controller.afk && 'true'}`}>AFK</div>
        {user.id === appState.user?.id &&
          <button onClick={handleAfk}>AFK</button>
        }
      </div>
    </div>
  );
};

export default UserController;