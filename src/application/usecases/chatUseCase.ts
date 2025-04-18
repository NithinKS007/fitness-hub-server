import { Chat } from "../../domain/entities/chatEntity";
import {
  Conversation,
  TrainerChatList,
  UserChatList,
} from "../../domain/entities/conversationEntity";
import { IChatRepository } from "../../domain/interfaces/IChatRepository";
import { IConversationRepository } from "../../domain/interfaces/IConversationRepository";
import { validationError } from "../../presentation/middlewares/errorMiddleWare";
import { HttpStatusMessages } from "../../shared/constants/httpResponseStructure";
import {
  CreateChatDTO,
  FindChatDTO,
} from "../dtos/chatDTOs";
import {
  IncrementUnReadMessageCount,
  UpdateLastMessage,
  UpdateUnReadMessageCount,
} from "../dtos/conversationDTO";
import { IdDTO } from "../dtos/utilityDTOs";

export class ChatUseCase {
  constructor(
    private chatRepository: IChatRepository,
    private conversation: IConversationRepository
  ) {}
  public async sendMessageAndSave(createChat: CreateChatDTO): Promise<Chat> {
    const createdMessage = await this.chatRepository.saveChat(createChat);
    if (!createdMessage) {
      throw new validationError(
        HttpStatusMessages.FailedToCreateMessageInChatDatabase
      );
    }
    return createdMessage;
  }

  public async markMessageAsRead({
    userId,
    otherUserId,
  }: {
    userId: string;
    otherUserId: string;
  }): Promise<Chat[] | null> {
    return await this.chatRepository.markAsRead(userId, otherUserId);
  }

  public async getMessages({
    userId,
    otherUserId,
  }: FindChatDTO): Promise<Chat[]> {
    const chatData = await this.chatRepository.getMessagesBetween2users({
      userId,
      otherUserId,
    });
    if (!chatData) {
      throw new validationError(HttpStatusMessages.FailedToGetChatMessages);
    }
    return chatData;
  }

  public async getTrainerChatList(
    trainerId: IdDTO
  ): Promise<TrainerChatList[]> {
    if (!trainerId) {
      throw new validationError(HttpStatusMessages.AllFieldsAreRequired);
    }
    const trainerChatList = await this.conversation.findTrainerChatList(
      trainerId
    );
    if (!trainerChatList) {
      throw new validationError(HttpStatusMessages.FailedToRetrieveChatList);
    }
    return trainerChatList;
  }

  public async getUserChatList(userId: IdDTO): Promise<UserChatList[]> {
    if (!userId) {
      throw new validationError(HttpStatusMessages.AllFieldsAreRequired);
    }
    const usersChatList = await this.conversation.findUserChatList(userId);
    if (!usersChatList) {
      throw new validationError(HttpStatusMessages.FailedToRetrieveChatList);
    }
    return usersChatList;
  }

  public async updateLastMessage({
    userId,
    otherUserId,
    lastMessageId,
  }: UpdateLastMessage): Promise<Conversation> {
    const lastMessage = await this.conversation.updateLastMessage({
      userId,
      otherUserId,
      lastMessageId,
    });
    if (!lastMessage) {
      throw new validationError(HttpStatusMessages.FailedToUpdateLastMessage);
    }
    return lastMessage;
  }

  public async updateUnReadMessageCount({
    userId,
    otherUserId,
    count,
  }: UpdateUnReadMessageCount): Promise<Conversation> {
    const updatedUnReadMessageDoc =
      await this.conversation.updateUnReadMessageCount({
        userId,
        otherUserId,
        count,
      });

    if (!updatedUnReadMessageDoc) {
      throw new validationError(HttpStatusMessages.FailedtoUpdateUnReadCount);
    }
    return updatedUnReadMessageDoc;
  }

  public async incrementUnReadMessageCount({
    userId,
    otherUserId,
  }: IncrementUnReadMessageCount): Promise<Conversation> {
    const incrementUnReadMessageDoc =
      await this.conversation.incrementUnReadMessageCount({
        userId,
        otherUserId,
      });

    if(!incrementUnReadMessageDoc){
      throw new validationError(HttpStatusMessages.FailedtoUpdateUnReadCount)
    }

    return incrementUnReadMessageDoc
  }
}
