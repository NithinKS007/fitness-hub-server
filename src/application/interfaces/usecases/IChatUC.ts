import { IBaseUseCase } from "./IBase.UC";
import {
  GetTrainerChatListDTO,
  GetUserChatListDTO,
} from "@application/dtos/query-dtos";
import {
  Conversation,
  CreateChatDTO,
  FindChatDTO,
  TrainerChatList,
  UserChatList,
} from "@application/dtos/chat-dtos";
import { Chat } from "@domain/entities/chat.entity";
import {
  IncrementUnReadMessageCount,
  UpdateLastMessage,
  UpdateUnReadMessageCount,
} from "@application/dtos/conversation-dtos";

export interface ICreateMessageUC extends IBaseUseCase<CreateChatDTO, Chat> {}
export interface IGetChatHistoryUC extends IBaseUseCase<FindChatDTO, Chat[]> {}
export interface IGetTrainerChatListUC
  extends IBaseUseCase<GetTrainerChatListDTO, TrainerChatList[]> {}
export interface IGetUserChatListUC
  extends IBaseUseCase<GetUserChatListDTO, UserChatList[]> {}
export interface IMarkMessageRead
  extends IBaseUseCase<
    {
      userId: string;
      otherUserId: string;
    },
    Chat[] | null
  > {}
export interface IIncrementUnReadMessageCountUC
  extends IBaseUseCase<IncrementUnReadMessageCount, Conversation> {}
export interface IUpdateLastMessageUC
  extends IBaseUseCase<UpdateLastMessage, Conversation> {}
export interface IUpdateUnReadMessageCountUC
  extends IBaseUseCase<UpdateUnReadMessageCount, Conversation | null> {}
