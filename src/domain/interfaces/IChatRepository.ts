import { ChatLastMsg } from "@application/dtos/chat-dtos";
import {
  FindConversation,
  UpdateLastMessage,
  IncrementUnReadMessageCount,
} from "@application/dtos/conversation-dtos";
import {
  GetUserChatListDTO,
  GetTrainerChatListDTO,
  GetUserTrainersListDTO,
} from "@application/dtos/query-dtos";
import { PagedResponse } from "@application/dtos/utility-dtos";
import { Chat } from "@domain/entities/chat.entity";
import { IBaseRepository } from "@domain/interfaces/IBaseRepository";
import { IChat } from "@infrastructure/databases/models/chat.model";
import {
  TRChatListUILayer,
  URChatListUILayer,
  UserMyTRListUILayer,
} from "@infrastructure/mappers/chat.mapper";

export interface IChatRepository
  extends IBaseRepository<IChat, Chat> {
  findChat({
    userId,
    trainerId,
  }: FindConversation): Promise<ChatLastMsg | null>;
  findUserChatList(dtos: GetUserChatListDTO): Promise<URChatListUILayer[]>;
  findTrainerChatList(
    dtos: GetTrainerChatListDTO
  ): Promise<TRChatListUILayer[]>;
  updateLastMessage(
    UpdateLastMessage: UpdateLastMessage
  ): Promise<Chat | null>;
  findChatWithLastMessage(
    conversationId: string
  ): Promise<ChatLastMsg>;
  findChatUpdateCount(
    userId: string,
    otherUserId: string
  ): Promise<ChatLastMsg | null>;
  incrementUnReadMessageCount(
    incrementUnReadMessageCount: IncrementUnReadMessageCount
  ): Promise<Chat | null>;
  getUserTrainersList(
    dtos: GetUserTrainersListDTO
  ): Promise<PagedResponse<UserMyTRListUILayer>>;
}
