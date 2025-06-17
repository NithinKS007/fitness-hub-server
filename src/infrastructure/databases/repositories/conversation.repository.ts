import { Model } from "mongoose";
import {
  ConversationSubscriptionUpdate,
  FindConversation,
  IncrementUnReadMessageCount,
  UpdateLastMessage,
} from "@application/dtos/conversation-dtos";
import { IConversationRepository } from "@domain/interfaces/IConversationRepository";
import ConversationModel from "@infrastructure/databases/models/conversation.model";
import {
  GetChatListQueryDTO,
  GetUserTrainersListQueryDTO,
} from "@application/dtos/query-dtos";
import { BaseRepository } from "@infrastructure/databases/repositories/base.repository";
import { PaginationDTO } from "@application/dtos/utility-dtos";
import { paginateReq, paginateRes } from "@shared/utils/handle-pagination";
import { IConversation } from "@domain/entities/conversation.entity";
import {
  Conversation,
  TrainerChatList,
  UserChatList,
} from "@application/dtos/chat-dtos";
import { UserMyTrainersList } from "@application/dtos/subscription-dtos";

export class ConversationRepository
  extends BaseRepository<IConversation>
  implements IConversationRepository
{
  constructor(model: Model<IConversation> = ConversationModel) {
    super(model);
  }

  async updateSubscriptionStatus({
    userId,
    trainerId,
    stripeSubscriptionStatus,
  }: ConversationSubscriptionUpdate): Promise<void> {
    await ConversationModel.findOneAndUpdate(
      {
        userId: this.parseId(userId),
        trainerId: this.parseId(trainerId),
      },
      { stripeSubscriptionStatus },
      { new: true }
    );
  }

  async findConversation({
    userId,
    trainerId,
  }: FindConversation): Promise<Conversation | null> {
    const result = await ConversationModel.aggregate([
      {
        $match: {
          userId: this.parseId(userId),
          trainerId: this.parseId(trainerId),
        },
      },
      {
        $lookup: {
          from: "chats",
          localField: "lastMessage",
          foreignField: "_id",
          as: "lastMessage",
        },
      },
      {
        $unwind: {
          path: "$lastMessage",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          userId: 1,
          trainerId: 1,
          lastMessage: 1,
          unreadCount: 1,
          stripeSubscriptionStatus: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);
    return result.length > 0 ? result[0] : null;
  }

  async updateLastMessage({
    userId,
    otherUserId,
    lastMessageId,
  }: UpdateLastMessage): Promise<IConversation | null> {
    return await ConversationModel.findOneAndUpdate(
      {
        $or: [
          {
            userId: this.parseId(userId),
            trainerId: this.parseId(otherUserId),
          },
          {
            userId: this.parseId(otherUserId),
            trainerId: this.parseId(userId),
          },
        ],
      },
      { lastMessage: this.parseId(lastMessageId) },
      { new: true }
    )
      .lean()
      .exec();
  }

  async findChatWithLastMessage(conversationId: string): Promise<Conversation> {
    const result = await ConversationModel.aggregate([
      { $match: { _id: this.parseId(conversationId) } },
      {
        $lookup: {
          from: "chats",
          localField: "lastMessage",
          foreignField: "_id",
          as: "lastMessage",
        },
      },
      { $unwind: { path: "$lastMessage", preserveNullAndEmptyArrays: true } },
    ]);
    return result[0];
  }

  async findChatUpdateCount(
    userId: string,
    otherUserId: string
  ): Promise<Conversation | null> {
    const result = await ConversationModel.aggregate([
      {
        $match: {
          $or: [
            {
              userId: this.parseId(userId),
              trainerId: this.parseId(otherUserId),
            },
            {
              userId: this.parseId(otherUserId),
              trainerId: this.parseId(userId),
            },
          ],
        },
      },
      {
        $lookup: {
          from: "chats",
          localField: "lastMessage",
          foreignField: "_id",
          as: "lastMessage",
        },
      },
      {
        $unwind: "$lastMessage",
      },
      {
        $match: {
          "lastMessage.receiverId": this.parseId(userId),
        },
      },
    ]);
    return result.length > 0 ? result[0] : null;
  }

  async incrementUnReadMessageCount({
    userId,
    otherUserId,
  }: IncrementUnReadMessageCount): Promise<IConversation | null> {
    return await ConversationModel.findOneAndUpdate(
      {
        $or: [
          {
            userId: this.parseId(userId),
            trainerId: this.parseId(otherUserId),
          },
          {
            userId: this.parseId(otherUserId),
            trainerId: this.parseId(userId),
          },
        ],
      },
      {
        $inc: { unreadCount: 1 },
      },
      { new: true }
    )
      .lean()
      .exec();
  }

  async findUserChatList(
    userId: string,
    { search }: GetChatListQueryDTO
  ): Promise<UserChatList[]> {
    let matchQuery: any = {};
    if (search) {
      matchQuery.$or = [
        { "subscribedTrainerData.fname": { $regex: search, $options: "i" } },
        { "subscribedTrainerData.lname": { $regex: search, $options: "i" } },
        { "subscribedTrainerData.email": { $regex: search, $options: "i" } },
      ];
    }
    const result = await ConversationModel.aggregate([
      { $match: { userId: this.parseId(userId) } },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: "trainers",
          localField: "trainerId",
          foreignField: "_id",
          as: "trainerData",
        },
      },
      {
        $unwind: "$trainerData",
      },
      {
        $lookup: {
          from: "users",
          localField: "trainerData.userId",
          foreignField: "_id",
          as: "subscribedTrainerData",
        },
      },
      {
        $unwind: "$subscribedTrainerData",
      },
      { $match: matchQuery },
      {
        $lookup: {
          from: "chats",
          localField: "lastMessage",
          foreignField: "_id",
          as: "lastMessageData",
        },
      },
      {
        $unwind: {
          path: "$lastMessageData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          userId: 1,
          trainerId: 1,
          unreadCount: 1,
          stripeSubscriptionStatus: 1,
          lastMessage: "$lastMessageData",
          createdAt: 1,
          updatedAt: 1,
          subscribedTrainerData: {
            fname: 1,
            lname: 1,
            email: 1,
            profilePic: 1,
            isBlocked: 1,
          },
        },
      },
    ]);
    return result;
  }

  async findTrainerChatList(
    trainerId: string,
    { search }: GetChatListQueryDTO
  ): Promise<TrainerChatList[]> {
    let matchQuery: any = {};
    if (search) {
      matchQuery.$or = [
        { "subscribedUserData.fname": { $regex: search, $options: "i" } },
        { "subscribedUserData.lname": { $regex: search, $options: "i" } },
        { "subscribedUserData.email": { $regex: search, $options: "i" } },
      ];
    }
    const result = await ConversationModel.aggregate([
      { $match: { trainerId: this.parseId(trainerId) } },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "subscribedUserData",
        },
      },
      { $unwind: "$subscribedUserData" },
      { $match: matchQuery },
      {
        $lookup: {
          from: "chats",
          localField: "lastMessage",
          foreignField: "_id",
          as: "lastMessageData",
        },
      },
      {
        $unwind: {
          path: "$lastMessageData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          userId: 1,
          trainerId: 1,
          unreadCount: 1,
          stripeSubscriptionStatus: 1,
          lastMessage: "$lastMessageData",
          createdAt: 1,
          updatedAt: 1,
          subscribedUserData: {
            fname: 1,
            lname: 1,
            email: 1,
            profilePic: 1,
            isBlocked: 1,
          },
        },
      },
    ]);
    return result;
  }

  async getUserTrainersList(
    userId: string,
    { page, limit, search }: GetUserTrainersListQueryDTO
  ): Promise<{
    userTrainersList: UserMyTrainersList[];
    paginationData: PaginationDTO;
  }> {
    const { pageNumber, limitNumber, skip } = paginateReq(page, limit);

    let matchQuery: any = {};

    if (search) {
      matchQuery.$or = [
        { "subscribedTrainerData.fname": { $regex: search, $options: "i" } },
        { "subscribedTrainerData.lname": { $regex: search, $options: "i" } },
        { "subscribedTrainerData.email": { $regex: search, $options: "i" } },
      ];
    }

    const commonPipeline = [
      { $match: { userId: this.parseId(userId) } },
      {
        $lookup: {
          from: "trainers",
          localField: "trainerId",
          foreignField: "_id",
          as: "trainerData",
        },
      },
      {
        $unwind: "$trainerData",
      },
      {
        $lookup: {
          from: "users",
          localField: "trainerData.userId",
          foreignField: "_id",
          as: "subscribedTrainerData",
        },
      },
      { $match: matchQuery },
      { $unwind: "$subscribedTrainerData" },
    ];

    const [totalCount, userTrainersList] = await Promise.all([
      this.model
        .aggregate([...commonPipeline, { $count: "totalCount" }])
        .then((result) => (result.length > 0 ? result[0].totalCount : 0)),
      this.model
        .aggregate([
          ...commonPipeline,
          {
            $project: {
              _id: 1,
              stripeSubscriptionStatus: 1,
              trainerId: 1,
              userId: 1,
              subscribedTrainerData: {
                _id: 1,
                fname: 1,
                lname: 1,
                email: 1,
                profilePic: 1,
                isBlocked: 1,
              },
            },
          },
        ])
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber)
        .exec(),
    ]);
    const paginationData = paginateRes({
      totalCount,
      pageNumber,
      limitNumber,
    });
    return {
      userTrainersList: userTrainersList,
      paginationData,
    };
  }
}
