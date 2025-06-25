import type { UserType } from "./User.type";

type ChatEntry = {
  user: string;
  message: string;
}

type RoomDataType = {
  roomId: string;
  name: string;
  hostId: string;
  users: UserType[];
  chat: ChatEntry[];
};

export type { RoomDataType };