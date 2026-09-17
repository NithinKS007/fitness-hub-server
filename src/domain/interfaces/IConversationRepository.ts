import {
  Conversation,
  TrainerChatList,
  UserChatList,
} from "@application/dtos/chat-dtos";
import {
  ConversationSubscriptionUpdate,
  FindConversation,
  UpdateLastMessage,
  IncrementUnReadMessageCount,
} from "@application/dtos/conversation-dtos";
import {
  GetUserChatListDTO,
  GetTrainerChatListDTO,
  GetUserTrainersListQueryDTO,
} from "@application/dtos/query-dtos";
import { UserMyTrainersList } from "@application/dtos/subscription-dtos";
import { PaginationDTO } from "@application/dtos/utility-dtos";
import { Conversation as ConversationDomain } from "@domain/entities/conversation.entity";
import { IBaseRepository } from "@domain/interfaces/IBaseRepository";
import { IConversation } from "@infrastructure/databases/models/conversation.model";

export interface IConversationRepository
  extends IBaseRepository<IConversation, ConversationDomain> {
  updateSubscriptionStatus({
    userId,
    trainerId,
    stripeSubscriptionStatus,
  }: ConversationSubscriptionUpdate): Promise<void>;
  findConversation({
    userId,
    trainerId,
  }: FindConversation): Promise<Conversation | null>;
  findUserChatList(dtos: GetUserChatListDTO): Promise<UserChatList[]>;
  findTrainerChatList(dtos: GetTrainerChatListDTO): Promise<TrainerChatList[]>;
  updateLastMessage(
    UpdateLastMessage: UpdateLastMessage
  ): Promise<ConversationDomain | null>;
  findChatWithLastMessage(conversationId: string): Promise<Conversation>;
  findChatUpdateCount(
    userId: string,
    otherUserId: string
  ): Promise<Conversation | null>;
  incrementUnReadMessageCount(
    incrementUnReadMessageCount: IncrementUnReadMessageCount
  ): Promise<ConversationDomain | null>;
  getUserTrainersList(dtos: GetUserTrainersListQueryDTO): Promise<{
    userTrainersList: UserMyTrainersList[];
    paginationData: PaginationDTO;
  }>;
}
