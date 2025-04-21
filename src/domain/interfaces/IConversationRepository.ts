import { CreateConversation, ConversationSubscriptionUpdate, FindConversation, UpdateLastMessage, UpdateUnReadMessageCount, IncrementUnReadMessageCount } from "../../application/dtos/conversationDTO";
import { GetChatListQueryDTO } from "../../application/dtos/queryDTOs";
import { IdDTO } from "../../application/dtos/utilityDTOs";
import { Conversation, TrainerChatList, UserChatList } from "../entities/conversationEntity";

export interface IConversationRepository {
 createChatConversation({userId,trainerId,stripeSubscriptionStatus}:CreateConversation):Promise<void>
 updateSubscriptionStatus({userId,trainerId,stripeSubscriptionStatus}:ConversationSubscriptionUpdate):Promise<void>
 findConversation({userId,trainerId}:FindConversation):Promise<Conversation | null>
 findUserChatList(userId:IdDTO,{search}:GetChatListQueryDTO):Promise<UserChatList[]>
 findTrainerChatList(trainerId:IdDTO,{search}:GetChatListQueryDTO):Promise<TrainerChatList[]>
 updateLastMessage(UpdateLastMessage:UpdateLastMessage):Promise<Conversation|null>
 updateUnReadMessageCount(UpdateUnReadMessageCount:UpdateUnReadMessageCount):Promise<Conversation| null>
 incrementUnReadMessageCount(incrementUnReadMessageCount:IncrementUnReadMessageCount):Promise<Conversation | null>
}