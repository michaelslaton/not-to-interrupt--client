import type { UserType } from "./User.type";

type RoomUser = UserType & {
  socketId: string;
}

type RoomDataType = {
  roomId: string;
  name: string;
  hostId: string;
  users: RoomUser[];
};

export type { RoomDataType };