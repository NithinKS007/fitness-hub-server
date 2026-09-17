import { IBaseUseCase } from "./IBase.UC";
import {
  GetTrainerChatListDTO,
  GetUserChatListDTO,
} from "@application/dtos/query-dtos";
import {
  ChatLastMsg,
  CreateChatDTO,
  FindMessageDTO,
} from "@application/dtos/chat-dtos";
import { Message } from "@domain/entities/message.entity";
import {
  IncrementUnReadMessageCount,
  UpdateLastMessage,
  UpdateUnReadMessageCount,
} from "@application/dtos/conversation-dtos";
import {
  TRChatListUILayer,
  URChatListUILayer,
} from "@infrastructure/mappers/chat.mapper";

export interface ICreateMessageUC extends IBaseUseCase<CreateChatDTO, Message> {}
export interface IGetChatHistoryUC extends IBaseUseCase<FindMessageDTO, Message[]> {}
export interface IGetTrainerChatListUC
  extends IBaseUseCase<GetTrainerChatListDTO, TRChatListUILayer[]> {}
export interface IGetUserChatListUC
  extends IBaseUseCase<GetUserChatListDTO, URChatListUILayer[]> {}
export interface IMarkMessageRead
  extends IBaseUseCase<
    {
      userId: string;
      otherUserId: string;
    },
    Message[] | null
  > {}
export interface IIncrementUnReadMessageCountUC
  extends IBaseUseCase<IncrementUnReadMessageCount, ChatLastMsg> {}
export interface IUpdateLastMessageUC
  extends IBaseUseCase<UpdateLastMessage, ChatLastMsg> {}
export interface IUpdateUnReadMessageCountUC
  extends IBaseUseCase<UpdateUnReadMessageCount, ChatLastMsg | null> {}
