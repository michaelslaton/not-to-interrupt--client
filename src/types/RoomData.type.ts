import type { UserType } from "./User.type";

type RoomDataType = {
  roomId: string;
  name: string;
  hostId: string;
  users: UserType[];
};

export type { RoomDataType };