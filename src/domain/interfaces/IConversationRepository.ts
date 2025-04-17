import { CreateConversation, ConversationSubscriptionUpdate, FindConversation, UpdateLastMessage } from "../../application/dtos/conversationDTO";
import { IdDTO } from "../../application/dtos/utilityDTOs";
import { Conversation, TrainerChatList, UserChatList } from "../entities/conversationEntity";

export interface IConversationRepository {
 createChatConversation({userId,trainerId,stripeSubscriptionStatus}:CreateConversation):Promise<void>
 updateSubscriptionStatus({userId,trainerId,stripeSubscriptionStatus}:ConversationSubscriptionUpdate):Promise<void>
 findConversation({userId,trainerId}:FindConversation):Promise<Conversation | null>
 findUserChatList(userId:IdDTO):Promise<UserChatList[]>
 findTrainerChatList(trainerId:IdDTO):Promise<TrainerChatList[]>
 updateLastMessage(UpdateLastMessage:UpdateLastMessage):Promise<Conversation|null>
}