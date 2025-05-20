import {
  CreateConversation,
  ConversationSubscriptionUpdate,
  FindConversation,
  UpdateLastMessage,
  UpdateUnReadMessageCount,
  IncrementUnReadMessageCount,
} from "../../application/dtos/conversation-dtos";
import { GetChatListQueryDTO } from "../../application/dtos/query-dtos";
import { IdDTO } from "../../application/dtos/utility-dtos";
import {
  Conversation,
  TrainerChatList,
  UserChatList,
} from "../entities/conversation";

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
    userId: IdDTO,
    { search }: GetChatListQueryDTO
  ): Promise<UserChatList[]>;
  findTrainerChatList(
    trainerId: IdDTO,
    { search }: GetChatListQueryDTO
  ): Promise<TrainerChatList[]>;
  updateLastMessage(
    UpdateLastMessage: UpdateLastMessage
  ): Promise<Conversation | null>;
  updateUnReadMessageCount(
    UpdateUnReadMessageCount: UpdateUnReadMessageCount
  ): Promise<Conversation | null>;
  incrementUnReadMessageCount(
    incrementUnReadMessageCount: IncrementUnReadMessageCount
  ): Promise<Conversation | null>;
}
