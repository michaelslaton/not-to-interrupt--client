import type { UserType } from '../../../../types/User.type';
// import { useAppStateContext } from '../../../RoomsDisplay';
import './userController.css';

type UserControllerProps = {
  user: UserType;
}

const UserController = ({ user }: UserControllerProps) => {
//  const { appState, setAppState } = useAppStateContext();

  return (
    <div>
      {user.name}
    </div>
  );
};

export default UserController;