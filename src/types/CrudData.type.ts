import type { UserType } from "./User.type";

type CrudDataType = {
  roomId: number;
  name: string;
  userName: string;
  users: UserType[];
};

export type { CrudDataType };