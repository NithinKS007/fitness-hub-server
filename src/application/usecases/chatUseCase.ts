import { Chat } from "../../domain/entities/chatEntity";
import {
  MongoUserSubscriptionsList,
  MonogoTrainerSubscribersList,
} from "../../domain/entities/subscriptionEntity";
import { IChatRepository } from "../../domain/interfaces/IChatRepository";
import { IUserSubscriptionPlanRepository } from "../../domain/interfaces/IUserSubscriptionRepository";
import { validationError } from "../../presentation/middlewares/errorMiddleWare";
import { HttpStatusMessages } from "../../shared/constants/httpResponseStructure";
import { CreateChatDTO, FindChatDTO } from "../dtos/chatDTOs";
import { IdDTO } from "../dtos/utilityDTOs";

export class ChatUseCase {
  constructor(
    private chatRepository: IChatRepository,
    private userSubscriptionPlanRepository: IUserSubscriptionPlanRepository
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
  ): Promise<MonogoTrainerSubscribersList[]> {
    if (!trainerId) {
      throw new validationError(HttpStatusMessages.AllFieldsAreRequired);
    }
    const trainerChatList =
      await this.userSubscriptionPlanRepository.findTrainerChatList(trainerId);
    if (!trainerChatList) {
      throw new validationError(HttpStatusMessages.FailedToRetrieveChatList);
    }
    return trainerChatList;
  }

  public async getUserChatList(
    userId: IdDTO
  ): Promise<MongoUserSubscriptionsList[]> {
    if (!userId) {
      throw new validationError(HttpStatusMessages.AllFieldsAreRequired);
    }
    const usersChatList =
      await this.userSubscriptionPlanRepository.findUserChatList(userId);
    if (!usersChatList) {
      throw new validationError(HttpStatusMessages.FailedToRetrieveChatList);
    }
    return usersChatList;
  }
}
