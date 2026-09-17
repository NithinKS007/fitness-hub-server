import { Model } from "mongoose";
import {
  FindConversation,
  IncrementUnReadMessageCount,
  UpdateLastMessage,
} from "@application/dtos/conversation-dtos";
import { IChatRepository } from "@domain/interfaces/IChatRepository";
import { IChat } from "@infrastructure/databases/models/chat.model";
import {
  GetTrainerChatListDTO,
  GetUserChatListDTO,
  GetUserTrainersListDTO,
} from "@application/dtos/query-dtos";
import { BaseRepository } from "@infrastructure/databases/repositories/base.repository";
import { PagedResponse } from "@application/dtos/utility-dtos";
import { paginateReq, paginateRes } from "@shared/utils/handle-pagination";
import { Chat } from "@domain/entities/chat.entity";
import { ChatLastMsg } from "@application/dtos/chat-dtos";
import {
  TRChatListMapper,
  TRChatListUILayer,
  URChatListMapper,
  URChatListUILayer,
  UserMyTRListMapper,
  UserMyTRListUILayer,
} from "@infrastructure/mappers/chat.mapper";
import { MongoHelper } from "../utils/mongo-helper";
import ChatModel from "@infrastructure/databases/models/chat.model";

export class ChatRepository
  extends BaseRepository<IChat, Chat>
  implements IChatRepository
{
  constructor(
    model: Model<IChat> = ChatModel,
    private trainerChatListMapper = new TRChatListMapper(),
    private userChatListMapper = new URChatListMapper(),
    private userMyTRListMapper = new UserMyTRListMapper(),
    private utility: MongoHelper = new MongoHelper()
  ) {
    super(model);
  }

  private projMessage() {
    return {
      "lastMessage._id": 1,
      "lastMessage.senderId": 1,
      "lastMessage.receiverId": 1,
      "lastMessage.message": 1,
      "lastMessage.isRead": 1,
      "lastMessage.createdAt": 1,
      "lastMessage.updatedAt": 1,
    };
  }

  private projChat() {
    return {
      _id: 1,
      userId: 1,
      trainerId: 1,
      unreadCount: 1,
      providerSubStatus: 1,
      createdAt: 1,
      updatedAt: 1,
    };
  }
  async findChat({
    userId,
    trainerId,
  }: FindConversation): Promise<ChatLastMsg | null> {
    const chatLookup = this.utility.lookup({
      from: "messages",
      localField: "lastMessage",
      foreignField: "_id",
      as: "lastMessage",
    });

    const result = await this.model.aggregate([
      {
        $match: {
          userId: this.parseId(userId),
          trainerId: this.parseId(trainerId),
        },
      },
      ...chatLookup,
      {
        $project: {
          userId: 1,
          trainerId: 1,
          lastMessage: 1,
          unreadCount: 1,
          providerSubStatus: 1,
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
  }: UpdateLastMessage): Promise<Chat | null> {
    const result = await this.model
      .findOneAndUpdate(
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
    return result ? this.toDomain(result) : null;
  }

  async findChatWithLastMessage(conversationId: string): Promise<ChatLastMsg> {
    const result = await this.model.aggregate([
      { $match: { _id: this.parseId(conversationId) } },
      {
        $lookup: {
          from: "messages",
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
  ): Promise<ChatLastMsg | null> {
    const result = await this.model.aggregate([
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
          from: "messages",
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
  }: IncrementUnReadMessageCount): Promise<Chat | null> {
    const result = await this.model
      .findOneAndUpdate(
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
    return result ? this.toDomain(result) : null;
  }

  async findUserChatList({
    userId,
    search,
  }: GetUserChatListDTO): Promise<URChatListUILayer[]> {
    const matchQuery = {
      ...this.utility.search({ search }, [
        "trainerData.fname",
        "trainerData.lname",
        "trainerData.email",
      ]),
    };

    const trainerLookup = this.utility.lookup({
      from: "users",
      localField: "trainerId",
      foreignField: "_id",
      as: "trainerData",
    });

    const lastmessageLookup = this.utility.lookup({
      from: "messages",
      localField: "lastMessage",
      foreignField: "_id",
      as: "lastMessage",
    });

    const projFields = {
      ...this.projChat(),
      ...this.projMessage,
      ...this.utility.trainerProj(),
    };

    const result = await this.model.aggregate([
      { $match: { userId: this.parseId(userId) } },
      { $sort: { createdAt: -1 } },
      ...trainerLookup,
      { $match: matchQuery },
      ...lastmessageLookup,
      {
        $project: projFields,
      },
    ]);
    return result.map((chat) => this.userChatListMapper.map(chat));
  }

  async findTrainerChatList(
    dtos: GetTrainerChatListDTO
  ): Promise<TRChatListUILayer[]> {
    const { trainerId, search } = dtos;

    const matchQuery = {
      ...this.utility.search({ search }, [
        "userData.fname",
        "userData.lname",
        "userData.email",
      ]),
    };

    const userLookup = this.utility.lookup({
      from: "users",
      localField: "userId",
      foreignField: "_id",
      as: "userData",
    });

    const lastmessageLookup = this.utility.lookup({
      from: "messages",
      localField: "lastMessage",
      foreignField: "_id",
      as: "lastMessage",
    });

    const projFields = {
      ...this.projChat(),
      ...this.projMessage,
      ...this.utility.userProj(),
    };

    const result = await this.model.aggregate([
      { $match: { trainerId: this.parseId(trainerId) } },
      { $sort: { createdAt: -1 } },
      ...userLookup,
      { $match: matchQuery },
      ...lastmessageLookup,
      {
        $project: projFields,
      },
    ]);
    return result.map((chat) => this.trainerChatListMapper.map(chat));
  }

  async getUserTrainersList(
    dtos: GetUserTrainersListDTO
  ): Promise<PagedResponse<UserMyTRListUILayer>> {
    const { userId, page, limit, search } = dtos;
    const { pageNumber, limitNumber, skip } = paginateReq(page, limit);

    const matchQuery = {
      ...this.utility.search({ search }, [
        "trainerData.fname",
        "trainerData.lname",
        "trainerData.email",
      ]),
    };

    const trainerLookup = this.utility.lookup({
      from: "users",
      localField: "trainerId",
      foreignField: "_id",
      as: "trainerData",
    });

    const commonPipeline = [
      { $match: { userId: this.parseId(userId) } },
      ...trainerLookup,
      { $match: matchQuery },
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
              providerSubStatus: 1,
              trainerId: 1,
              userId: 1,
              trainerData: this.utility.trainerProj(),
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
    const mappedData = userTrainersList.map((trainer) =>
      this.userMyTRListMapper.map(trainer)
    );
    return {
      data: mappedData,
      pagination: paginationData,
    };
  }
}
