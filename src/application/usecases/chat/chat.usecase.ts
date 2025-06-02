import { Chat } from "../../../domain/entities/chat.entities";
import {
  Conversation,
  TrainerChatList,
  UserChatList,
} from "../../../domain/entities/conversation.entities";
import { IChatRepository } from "../../../domain/interfaces/IChatRepository";
import { IConversationRepository } from "../../../domain/interfaces/IConversationRepository";
import { validationError } from "../../../presentation/middlewares/error.middleware";
import {
  ApplicationStatus,
  ChatStatus,
} from "../../../shared/constants/index.constants";
import { CreateChatDTO, FindChatDTO } from "../../dtos/chat-dtos";
import {
  IncrementUnReadMessageCount,
  UpdateLastMessage,
  UpdateUnReadMessageCount,
} from "../../dtos/conversation-dtos";
import { GetChatListQueryDTO } from "../../dtos/query-dtos";

export class ChatUseCase {
  constructor(
    private chatRepository: IChatRepository,
    private conversation: IConversationRepository
  ) {}
  async sendMessageAndSave(createChat: CreateChatDTO): Promise<Chat> {
    const createdMessage = await this.chatRepository.saveChat(createChat);
    if (!createdMessage) {
      throw new validationError(ChatStatus.FailedToCreateMessageInChatDatabase);
    }
    return createdMessage;
  }

  async markMessageAsRead({
    userId,
    otherUserId,
  }: {
    userId: string;
    otherUserId: string;
  }): Promise<Chat[] | null> {
    return await this.chatRepository.markAsRead(userId, otherUserId);
  }

  async getMessages({ userId, otherUserId }: FindChatDTO): Promise<Chat[]> {
    const chatData = await this.chatRepository.getMessagesBetween2users({
      userId,
      otherUserId,
    });
    if (!chatData) {
      throw new validationError(ChatStatus.FailedToGetChatMessages);
    }
    return chatData;
  }

  async getTrainerChatList(
    trainerId: string,
    { search }: GetChatListQueryDTO
  ): Promise<TrainerChatList[]> {
    if (!trainerId) {
      throw new validationError(ApplicationStatus.AllFieldsAreRequired);
    }
    const trainerChatList = await this.conversation.findTrainerChatList(
      trainerId,
      { search }
    );
    if (!trainerChatList) {
      throw new validationError(ChatStatus.FailedToRetrieveChatList);
    }
    return trainerChatList;
  }

  async getUserChatList(
    userId: string,
    { search }: GetChatListQueryDTO
  ): Promise<UserChatList[]> {
    if (!userId) {
      throw new validationError(ApplicationStatus.AllFieldsAreRequired);
    }
    const usersChatList = await this.conversation.findUserChatList(userId, {
      search,
    });
    if (!usersChatList) {
      throw new validationError(ChatStatus.FailedToRetrieveChatList);
    }
    return usersChatList;
  }

  async updateLastMessage({
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
      throw new validationError(ChatStatus.FailedToUpdateLastMessage);
    }
    return lastMessage;
  }

  async updateUnReadMessageCount({
    userId,
    otherUserId,
    count,
  }: UpdateUnReadMessageCount): Promise<Conversation | null> {
    const updatedUnReadMessageDoc =
      await this.conversation.updateUnReadMessageCount({
        userId,
        otherUserId,
        count,
      });
    return updatedUnReadMessageDoc;
  }

  async incrementUnReadMessageCount({
    userId,
    otherUserId,
  }: IncrementUnReadMessageCount): Promise<Conversation> {
    const incrementUnReadMessageDoc =
      await this.conversation.incrementUnReadMessageCount({
        userId,
        otherUserId,
      });

    if (!incrementUnReadMessageDoc) {
      throw new validationError(ChatStatus.FailedtoUpdateUnReadCount);
    }

    return incrementUnReadMessageDoc;
  }
}
