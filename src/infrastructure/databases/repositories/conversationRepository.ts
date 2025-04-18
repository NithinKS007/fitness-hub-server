import mongoose from "mongoose";
import {
  ConversationSubscriptionUpdate,
  CreateConversation,
  FindConversation,
  IncrementUnReadMessageCount,
  UpdateLastMessage,
  UpdateUnReadMessageCount,
} from "../../../application/dtos/conversationDTO";
import { IConversationRepository } from "../../../domain/interfaces/IConversationRepository";
import conversationModel from "../models/conversation";
import {
  Conversation,
  Ichat,
  TrainerChatList,
  UserChatList,
} from "../../../domain/entities/conversationEntity";
import { IdDTO } from "../../../application/dtos/utilityDTOs";

export class MongoConversationRepository implements IConversationRepository {
  public async createChatConversation({
    userId,
    trainerId,
    stripeSubscriptionStatus,
  }: CreateConversation): Promise<void> {
    await conversationModel.create({
      userId: new mongoose.Types.ObjectId(userId),
      trainerId: new mongoose.Types.ObjectId(trainerId),
      stripeSubscriptionStatus: stripeSubscriptionStatus,
    });
  }

  public async updateSubscriptionStatus({
    userId,
    trainerId,
    stripeSubscriptionStatus,
  }: ConversationSubscriptionUpdate): Promise<void> {
    await conversationModel.findOneAndUpdate(
      {
        userId: new mongoose.Types.ObjectId(userId),
        trainerId: new mongoose.Types.ObjectId(trainerId),
      },
      { stripeSubscriptionStatus },
      { new: true }
    );
  }

  public async findConversation({
    userId,
    trainerId,
  }: FindConversation): Promise<Conversation | null> {
    return await conversationModel
      .findOne({
        userId: new mongoose.Types.ObjectId(userId),
        trainerId: new mongoose.Types.ObjectId(trainerId),
      })
      .populate<{ lastMessage: Ichat | null }>({
        path: "lastMessage",
        model: "Chat",
      })
      .lean()
      .exec();
  }

  public async updateLastMessage({
    userId,
    otherUserId,
    lastMessageId,
  }: UpdateLastMessage): Promise<Conversation | null> {

    console.log("message id for updating",lastMessageId)
    return await conversationModel
      .findOneAndUpdate(
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

  public async updateUnReadMessageCount({
    userId,
    otherUserId,
    count,
  }: UpdateUnReadMessageCount): Promise<Conversation | null> {
    return await conversationModel
      .findOneAndUpdate(
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
          $set: { unreadCount: count },
        },
        { new: true }
      )
      .populate<{ lastMessage: Ichat | null }>({
        path: "lastMessage",
        model: "Chat",
      })
      .lean()
      .exec();
  }

  public async incrementUnReadMessageCount({
    userId,
    otherUserId,
  }: IncrementUnReadMessageCount): Promise<Conversation | null> {
    const updatedDoc = await conversationModel
      .findOneAndUpdate(
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

  public async findUserChatList(userId: IdDTO): Promise<UserChatList[]> {
    const result = await conversationModel.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $sort: { updatedAt: -1 } },
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
  public async findTrainerChatList(
    trainerId: IdDTO
  ): Promise<TrainerChatList[]> {
    const result = await conversationModel.aggregate([
      { $match: { trainerId: new mongoose.Types.ObjectId(trainerId) } },
      { $sort: { updatedAt: -1 } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "subscribedUserData",
        },
      },
      { $unwind: "$subscribedUserData" },
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
