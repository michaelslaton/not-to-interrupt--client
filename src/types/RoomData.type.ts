import type { UserType } from "./User.type";

type RoomUser = UserType & {
  socketId: string;
}

type ChatEntry = {
  user: string;
  message: string;
}

type RoomDataType = {
  roomId: string;
  name: string;
  hostId: string;
  users: RoomUser[];
  chat: ChatEntry[];
};

export type { RoomDataType };