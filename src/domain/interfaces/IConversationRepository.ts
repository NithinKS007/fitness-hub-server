import {
  CreateConversation,
  ConversationSubscriptionUpdate,
  FindConversation,
  UpdateLastMessage,
  UpdateUnReadMessageCount,
  IncrementUnReadMessageCount,
} from "../../application/dtos/conversation-dtos";
import { GetChatListQueryDTO } from "../../application/dtos/query-dtos";
import {
  Conversation,
  TrainerChatList,
  UserChatList,
} from "../entities/conversation.entities";

export interface IConversationRepository {
  createChatConversation({
    userId,
    trainerId,
    stripeSubscriptionStatus,
  }: CreateConversation): Promise<void>;
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
  ): Promise<Conversation | null>;
  updateUnReadCount(
    UpdateUnReadMessageCount: UpdateUnReadMessageCount
  ): Promise<Conversation | null>;
  incrementUnReadMessageCount(
    incrementUnReadMessageCount: IncrementUnReadMessageCount
  ): Promise<Conversation | null>;
}
