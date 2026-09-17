import { Message } from "@domain/entities/message.entity";
import { ObjectId } from "mongoose";
import { BaseMapper } from "./BaseMapper";
import { IMessage } from "@infrastructure/databases/models/message.model";

interface UserData {
  fname: string;
  lname: string;
  email: string;
  profilePic: string;
  isBlocked: boolean;
}
type UserDataDB = UserData & {
  _id: ObjectId;
};

type UserDataUI = UserData & {
  id: string;
};

export type URChatListDBLayer = BaseChatListDBLayer & {
  trainerData: UserDataDB
};
export type URChatListUILayer = BaseChatListUILayer & {
  trainerData: UserDataUI
};

export type TRChatListDBLayer = BaseChatListDBLayer & {
  userData: UserDataDB
};

export type TRChatListUILayer = BaseChatListUILayer & {
  userData: UserDataUI
};

interface BaseChatList {
  unreadCount: number;
  providerSubStatus: string;
  createdAt: Date;
  updatedAt: Date;
}

type BaseChatListUILayer = BaseChatList & {
  id: string;
  userId: string;
  trainerId: string;
  lastMessage: Message | null;
};

type BaseChatListDBLayer = BaseChatList & {
  _id: ObjectId;
  userId: ObjectId;
  trainerId: ObjectId;
  lastMessage: IMessage | null;
};

interface BaseUserMyTRListDB {
  providerSubStatus: string;
  trainerData: UserDataDB
}
interface BaseUserMyTRListUI {
  providerSubStatus: string;
  trainerData: UserDataUI
}

export type UserMyTRListDBLayer = BaseUserMyTRListDB & {
  _id: ObjectId;
  trainerId: ObjectId;
  userId: ObjectId;
};

export type UserMyTRListUILayer = BaseUserMyTRListUI & {
  id: string;
  trainerId: string;
  userId: string;
};

export class UserMyTRListMapper extends BaseMapper<
  UserMyTRListDBLayer,
  UserMyTRListUILayer
> {
  private userMapper = new UserMapper();
  mapToDomain(data: UserMyTRListDBLayer): UserMyTRListUILayer {
    const trainerData = this.userMapper.map(data.trainerData);
    return {
      id: this.mapToString(data._id),
      trainerId: this.mapToString(data.trainerId),
      userId: this.mapToString(data.userId),
      providerSubStatus: data.providerSubStatus,
      trainerData: trainerData,
    };
  }

  map(data: UserMyTRListDBLayer): UserMyTRListUILayer {
    return this.toDomain(data, this.mapToDomain.bind(this));
  }
}

class UserMapper extends BaseMapper<UserDataDB, UserDataUI> {
  mapToDomain(data: UserDataDB): UserDataUI {
    return { ...data, id: this.mapToString(data._id) };
  }
  map(data: UserDataDB): UserDataUI {
    return this.toDomain(data, this.mapToDomain.bind(this));
  }
}

class BaseChatListMapper extends BaseMapper<
  BaseChatListDBLayer,
  BaseChatListUILayer
> {
  mapToDomain(data: BaseChatListDBLayer): BaseChatListUILayer {
    return {
      id: this.mapToString(data._id),
      userId: this.mapToString(data.userId),
      trainerId: this.mapToString(data.trainerId),
      unreadCount: data.unreadCount,
      providerSubStatus: data.providerSubStatus,
      lastMessage: data.lastMessage
        ? {
            id: this.mapToString(data._id),
            senderId: this.mapToString(data.lastMessage.senderId),
            receiverId: this.mapToString(data.lastMessage.receiverId),
            message: data.lastMessage.message,
            isRead: data.lastMessage.isRead,
            createdAt: data.lastMessage.createdAt,
            updatedAt: data.lastMessage.updatedAt,
          }
        : null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  map(data: BaseChatListDBLayer): BaseChatListUILayer {
    return this.toDomain(data, this.mapToDomain.bind(this));
  }
}

export class URChatListMapper extends BaseMapper<
  URChatListDBLayer,
  URChatListUILayer
> {
  private userMapper: UserMapper;
  private chatListMapper: BaseChatListMapper;

  constructor() {
    super();
    this.userMapper = new UserMapper();
    this.chatListMapper = new BaseChatListMapper();
  }
  mapToDomain(data: URChatListDBLayer): URChatListUILayer {
    const baseChatList = this.chatListMapper.map(data);
    const userData = this.userMapper.map(data.trainerData);
    return {
      ...baseChatList,
      trainerData: userData,
    };
  }
  map(data: URChatListDBLayer): URChatListUILayer {
    return this.toDomain(data, this.mapToDomain.bind(this));
  }
}

export class TRChatListMapper extends BaseMapper<
  TRChatListDBLayer,
  TRChatListUILayer
> {
  private userMapper: UserMapper;
  private chatListMapper: BaseChatListMapper;

  constructor() {
    super();
    this.userMapper = new UserMapper();
    this.chatListMapper = new BaseChatListMapper();
  }
  mapToDomain(data: TRChatListDBLayer): TRChatListUILayer {
    const baseChatList = this.chatListMapper.map(data);
    const userData = this.userMapper.map(data.userData);
    return {
      ...baseChatList,
      userData: userData,
    };
  }
  map(data: TRChatListDBLayer): TRChatListUILayer {
    return this.toDomain(data, this.mapToDomain.bind(this));
  }
}
