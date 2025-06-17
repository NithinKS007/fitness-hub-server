import { Conversation, TrainerChatList, UserChatList } from "@application/dtos/chat-dtos";
import {
  ConversationSubscriptionUpdate,
  FindConversation,
  UpdateLastMessage,
  IncrementUnReadMessageCount,
} from "@application/dtos/conversation-dtos";
import {
  GetChatListQueryDTO,
  GetUserTrainersListQueryDTO,
} from "@application/dtos/query-dtos";
import { UserMyTrainersList } from "@application/dtos/subscription-dtos";
import { PaginationDTO } from "@application/dtos/utility-dtos";
import { IConversation } from "@domain/entities/conversation.entity";
import { IBaseRepository } from "@domain/interfaces/IBaseRepository";

export interface IConversationRepository
  extends IBaseRepository<IConversation> {
  updateSubscriptionStatus({
    userId,
    trainerId,
    stripeSubscriptionStatus,
  }: ConversationSubscriptionUpdate): Promise<void>;
  findConversation({
    userId,
    trainerId,
  }: FindConversation): Promise<Conversation | null>;
  findUserChatList(
    userId: string,
    { search }: GetChatListQueryDTO
  ): Promise<UserChatList[]>;
  findTrainerChatList(
    trainerId: string,
    { search }: GetChatListQueryDTO
  ): Promise<TrainerChatList[]>;

  updateLastMessage(
    UpdateLastMessage: UpdateLastMessage
  ): Promise<IConversation | null>;
  findChatWithLastMessage(conversationId: string): Promise<Conversation>;
  findChatUpdateCount(
    userId: string,
    otherUserId: string
  ): Promise<Conversation | null>;
  incrementUnReadMessageCount(
    incrementUnReadMessageCount: IncrementUnReadMessageCount
  ): Promise<IConversation | null>;
  getUserTrainersList(
    userId: string,
    searchFilterQuery: GetUserTrainersListQueryDTO
  ): Promise<{
    userTrainersList: UserMyTrainersList[];
    paginationData: PaginationDTO;
  }>;
}
