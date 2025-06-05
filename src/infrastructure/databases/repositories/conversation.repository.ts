import mongoose from "mongoose";
import {
  ConversationSubscriptionUpdate,
  CreateConversation,
  FindConversation,
  IncrementUnReadMessageCount,
  UpdateLastMessage,
  UpdateUnReadMessageCount,
} from "../../../application/dtos/conversation-dtos";
import { IConversationRepository } from "../../../domain/interfaces/IConversationRepository";
import ConversationModel from "../models/conversation.model";
import {
  Conversation,
  Ichat,
  TrainerChatList,
  UserChatList,
} from "../../../domain/entities/conversation.entities";
import { GetChatListQueryDTO } from "../../../application/dtos/query-dtos";

export class ConversationRepository implements IConversationRepository {
  async createChatConversation({
    userId,
    trainerId,
    stripeSubscriptionStatus,
  }: CreateConversation): Promise<void> {
    await ConversationModel.create({
      userId: new mongoose.Types.ObjectId(userId),
      trainerId: new mongoose.Types.ObjectId(trainerId),
      stripeSubscriptionStatus: stripeSubscriptionStatus,
    });
  }

  async updateSubscriptionStatus({
    userId,
    trainerId,
    stripeSubscriptionStatus,
  }: ConversationSubscriptionUpdate): Promise<void> {
    await ConversationModel.findOneAndUpdate(
      {
        userId: new mongoose.Types.ObjectId(userId),
        trainerId: new mongoose.Types.ObjectId(trainerId),
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
          userId: new mongoose.Types.ObjectId(userId),
          trainerId: new mongoose.Types.ObjectId(trainerId),
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
  }: UpdateLastMessage): Promise<Conversation | null> {
    return await ConversationModel.findOneAndUpdate(
      {
        $or: [
          {
            userId: new mongoose.Types.ObjectId(userId),
            trainerId: new mongoose.Types.ObjectId(otherUserId),
          },
          {
            userId: new mongoose.Types.ObjectId(otherUserId),
            trainerId: new mongoose.Types.ObjectId(userId),
          },
        ],
      },
      { $set: { lastMessage: new mongoose.Types.ObjectId(lastMessageId) } },
      { new: true }
    )
      .populate<{ lastMessage: Ichat | null }>({
        path: "lastMessage",
        model: "Chat",
      })
      .lean()
      .exec();
  }

  async updateUnReadCount({
    userId,
    otherUserId,
    count,
  }: UpdateUnReadMessageCount): Promise<Conversation | null> {
    const matchResult = await ConversationModel.aggregate([
      {
        $match: {
          $or: [
            {
              userId: new mongoose.Types.ObjectId(userId),
              trainerId: new mongoose.Types.ObjectId(otherUserId),
            },
            {
              userId: new mongoose.Types.ObjectId(otherUserId),
              trainerId: new mongoose.Types.ObjectId(userId),
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
          "lastMessage.receiverId": new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $project: { _id: 1 },
      },
    ]);

    if (!matchResult.length) return null;

    const conversationId = matchResult[0]?._id;

    const updatedConversation = await ConversationModel.findOneAndUpdate(
      { _id: conversationId },
      { $set: { unreadCount: count } },
      { new: true }
    )
      .populate<{ lastMessage: Ichat | null }>({
        path: "lastMessage",
        model: "Chat",
      })
      .lean()
      .exec();

    return updatedConversation;
  }

  async incrementUnReadMessageCount({
    userId,
    otherUserId,
  }: IncrementUnReadMessageCount): Promise<Conversation | null> {
    const updatedDoc = await ConversationModel.findOneAndUpdate(
      {
        $or: [
          {
            userId: new mongoose.Types.ObjectId(userId),
            trainerId: new mongoose.Types.ObjectId(otherUserId),
          },
          {
            userId: new mongoose.Types.ObjectId(otherUserId),
            trainerId: new mongoose.Types.ObjectId(userId),
          },
        ],
      },
      {
        $inc: { unreadCount: 1 },
      },
      { new: true }
    )
      .populate<{ lastMessage: Ichat | null }>({
        path: "lastMessage",
        model: "Chat",
      })
      .lean()
      .exec();
    return updatedDoc;
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
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
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
      { $match: { trainerId: new mongoose.Types.ObjectId(trainerId) } },
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
}
