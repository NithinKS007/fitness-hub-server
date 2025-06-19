import { Model } from "mongoose";
import {
  GetApprovedTrainerQueryDTO,
  GetTrainersApprovalQueryDTO,
  GetTrainersQueryDTO,
} from "@application/dtos/query-dtos";
import { PaginationDTO } from "@application/dtos/utility-dtos";
import { ITrainerRepository } from "@domain/interfaces/ITrainerRepository";
import { BaseRepository } from "@infrastructure/databases/repositories/base.repository";
import { paginateReq, paginateRes } from "@shared/utils/handle-pagination";
import TrainerModel from "../models/trainer.model";
import { ITrainer } from "@domain/entities/trainer.entity";
import {
  Trainer,
  TrainerWithSubscription,
} from "@application/dtos/trainer-dtos";

export class TrainerRepository
  extends BaseRepository<ITrainer>
  implements ITrainerRepository
{
  constructor(model: Model<ITrainer> = TrainerModel) {
    super(model);
  }

  async getTrainerDetailsById(trainerId: string): Promise<Trainer> {
    const trainerData = await this.model.aggregate([
      {
        $match: {
          _id: this.parseId(trainerId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "trainerDetails",
        },
      },
      { $unwind: "$trainerDetails" },
      {
        $project: {
          fname: "$trainerDetails.fname",
          lname: "$trainerDetails.lname",
          email: "$trainerDetails.email",
          role: "$trainerDetails.role",
          isBlocked: "$trainerDetails.isBlocked",
          otpVerified: "$trainerDetails.otpVerified",
          googleVerified: "$trainerDetails.googleVerified",
          phone: "$trainerDetails.phone",
          dateOfBirth: "$trainerDetails.dateOfBirth",
          profilePic: "$trainerDetails.profilePic",
          age: "$trainerDetails.age",
          height: "$trainerDetails.height",
          weight: "$trainerDetails.weight",
          gender: "$trainerDetails.gender",

          _id: 1,
          userId: 1,
          yearsOfExperience: 1,
          specializations: 1,
          certifications: 1,
          isApproved: 1,
          aboutMe: 1,
          createdAt: 1,
        },
      },
    ]);
    return trainerData[0];
  }

  async getTrainerWithSub(trainerId: string): Promise<TrainerWithSubscription> {
    const result = await this.model.aggregate([
      {
        $match: {
          _id: this.parseId(trainerId),
          isApproved: true,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "trainerDetails",
        },
      },
      { $unwind: "$trainerDetails" },
      {
        $lookup: {
          from: "subscriptions",
          localField: "_id",
          foreignField: "trainerId",
          as: "subscriptionDetails",
        },
      },
      {
        $project: {
          fname: "$trainerDetails.fname",
          lname: "$trainerDetails.lname",
          email: "$trainerDetails.email",
          role: "$trainerDetails.role",
          isBlocked: "$trainerDetails.isBlocked",
          otpVerified: "$trainerDetails.otpVerified",
          googleVerified: "$trainerDetails.googleVerified",
          phone: "$trainerDetails.phone",
          dateOfBirth: "$trainerDetails.dateOfBirth",
          profilePic: "$trainerDetails.profilePic",
          age: "$trainerDetails.age",
          height: "$trainerDetails.height",
          weight: "$trainerDetails.weight",
          gender: "$trainerDetails.gender",

          _id: 1,
          userId: 1,
          yearsOfExperience: 1,
          specializations: 1,
          certifications: 1,
          isApproved: 1,
          aboutMe: 1,
          subscriptionDetails: "$subscriptionDetails",
          createdAt: 1,
        },
      },
    ]);
    return result[0];
  }

  async getTrainerDetailsByUserIdRef(userId: string): Promise<Trainer> {
    const trainerData = await this.model.aggregate([
      {
        $match: {
          userId: this.parseId(userId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "trainerDetails",
        },
      },
      { $unwind: "$trainerDetails" },
      {
        $project: {
          fname: "$trainerDetails.fname",
          lname: "$trainerDetails.lname",
          email: "$trainerDetails.email",
          role: "$trainerDetails.role",
          isBlocked: "$trainerDetails.isBlocked",
          otpVerified: "$trainerDetails.otpVerified",
          googleVerified: "$trainerDetails.googleVerified",
          phone: "$trainerDetails.phone",
          dateOfBirth: "$trainerDetails.dateOfBirth",
          profilePic: "$trainerDetails.profilePic",
          age: "$trainerDetails.age",
          height: "$trainerDetails.height",
          weight: "$trainerDetails.weight",
          gender: "$trainerDetails.gender",

          _id: 1,
          userId: 1,
          yearsOfExperience: 1,
          specializations: 1,
          certifications: 1,
          isApproved: 1,
          aboutMe: 1,
          createdAt: 1,
        },
      },
    ]);
    return trainerData[0];
  }

  async getTrainers({
    page,
    limit,
    search,
    filters,
  }: GetTrainersQueryDTO): Promise<{
    trainersList: Trainer[];
    paginationData: PaginationDTO;
  }> {
    const { pageNumber, limitNumber, skip } = paginateReq(page, limit);

    let matchQuery: any = {};

    if (search) {
      matchQuery.$or = [
        { "trainersList.fname": { $regex: search, $options: "i" } },
        { "trainersList.lname": { $regex: search, $options: "i" } },
        { "trainersList.email": { $regex: search, $options: "i" } },
      ];
    }

    if (filters && filters.length > 0 && !filters.includes("All")) {
      const conditions: any = [];
      if (filters.includes("Block"))
        conditions.push({ "trainersList.isBlocked": true });
      if (filters.includes("Unblock"))
        conditions.push({ "trainersList.isBlocked": false });
      if (filters.includes("verified"))
        conditions.push({
          $or: [
            { "trainersList.otpVerified": true },
            { "trainersList. googleVerified": true },
          ],
        });
      if (filters.includes("Not verified"))
        conditions.push({
          $and: [
            { "trainersList.otpVerified": false },
            { "trainersList.googleVerified": false },
          ],
        });
      if (filters.includes("Approved")) conditions.push({ isApproved: true });
      if (filters.includes("Not Approved"))
        conditions.push({ isApproved: false });
      if (conditions.length > 0) matchQuery.$and = conditions;
    }

    const commonPipeline: any = [
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "trainersList",
        },
      },
      { $match: matchQuery },
      { $unwind: "$trainersList" },
    ];
    const [totalCount, trainersList] = await Promise.all([
      this.model
        .aggregate([...commonPipeline, { $count: "totalCount" }])
        .then((result) => (result.length > 0 ? result[0].totalCount : 0)),
      this.model
        .aggregate([
          ...commonPipeline,
          {
            $project: {
              fname: "$trainersList.fname",
              lname: "$trainersList.lname",
              email: "$trainersList.email",
              role: "$trainersList.role",
              isBlocked: "$trainersList.isBlocked",
              otpVerified: "$trainersList.otpVerified",
              googleVerified: "$trainersList.googleVerified",
              phone: "$trainersList.phone",
              dateOfBirth: "$trainersList.dateOfBirth",
              profilePic: "$trainersList.profilePic",
              age: "$trainersList.age",
              height: "$trainersList.height",
              weight: "$trainersList.weight",
              gender: "$trainersList.gender",
              _id: 1,
              userId: 1,
              yearsOfExperience: 1,
              specializations: 1,
              certifications: 1,
              isApproved: 1,
              aboutMe: 1,
              createdAt: 1,
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
      trainersList,
      paginationData,
    };
  }

  async getApprovedTrainers({
    page,
    limit,
    search,
    specialization,
    experience,
    gender,
    sort,
  }: GetApprovedTrainerQueryDTO): Promise<{
    trainersList: Trainer[];
    paginationData: PaginationDTO;
  }> {
    const { pageNumber, limitNumber, skip } = paginateReq(page, limit);

    let matchQuery: any = {};
    let sortQuery: any = {};

    if (sort === "aA - zz") {
      sortQuery = { "trainersList.fname": 1 };
    } else if (sort === "zz - aa") {
      sortQuery = { "trainersList.fname": -1 };
    } else {
      sortQuery = { createdAt: -1 };
    }

    if (search) {
      matchQuery.$or = [
        { "trainersList.fname": { $regex: search, $options: "i" } },
        { "trainersList.lname": { $regex: search, $options: "i" } },
        { "trainersList.email": { $regex: search, $options: "i" } },
      ];
    }

    if (specialization?.length > 0) {
      matchQuery.specializations = { $in: specialization };
    }

    if (experience?.length > 0) {
      const experienceConditions: any = [];
      experience.forEach((ex: string) => {
        if (ex === "1-3") {
          experienceConditions.push({
            yearsOfExperience: { $gte: "1", $lte: "3" },
          });
        }

        if (ex === "3-5") {
          experienceConditions.push({
            yearsOfExperience: { $gte: "3", $lte: "5" },
          });
        }
        if (ex === "Greater than 5") {
          experienceConditions.push({ yearsOfExperience: { $gt: "5" } });
        }
        if (ex === "Less than 1") {
          experienceConditions.push({ yearsOfExperience: { $lt: "1" } });
        }
      });
      if (experienceConditions.length > 0) {
        matchQuery.$or = experienceConditions;
      }
    }

    if (gender?.length > 0) {
      const gender: any = [];
      gender.forEach((gen: string) => {
        if (gen === "Male") {
          gender.push("male");
        } else if (gen === "Female") {
          gender.push("female");
        } else {
          gender.push("male", "female");
        }
      });
      if (gender.length > 0) {
        matchQuery["trainersList.gender"] = { $in: gender };
      }
    }

    const commonPipeline = [
      { $match: { isApproved: true } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "trainersList",
        },
      },
      { $unwind: "$trainersList" },
      { $match: { "trainersList.isBlocked": false } },
      { $match: matchQuery },
    ];

    const [totalCount, trainersList] = await Promise.all([
      this.model
        .aggregate([...commonPipeline, { $count: "totalCount" }])
        .then((result) => (result.length > 0 ? result[0].totalCount : 0)),
      this.model
        .aggregate([
          ...commonPipeline,
          { $sort: sortQuery },
          {
            $project: {
              fname: "$trainersList.fname",
              lname: "$trainersList.lname",
              email: "$trainersList.email",
              role: "$trainersList.role",
              isBlocked: "$trainersList.isBlocked",
              otpVerified: "$trainersList.otpVerified",
              googleVerified: "$trainersList.googleVerified",
              phone: "$trainersList.phone",
              dateOfBirth: "$trainersList.dateOfBirth",
              profilePic: "$trainersList.profilePic",
              age: "$trainersList.age",
              height: "$trainersList.height",
              weight: "$trainersList.weight",
              gender: "$trainersList.gender",

              _id: 1,
              userId: 1,
              yearsOfExperience: 1,
              specializations: 1,
              certifications: 1,
              isApproved: 1,
              aboutMe: 1,
              createdAt: 1,
            },
          },
        ])
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
      trainersList,
      paginationData,
    };
  }

  async getVerifyPendingList({
    page,
    limit,
    fromDate,
    toDate,
    search,
  }: GetTrainersApprovalQueryDTO): Promise<{
    trainersList: Trainer[];
    paginationData: PaginationDTO;
  }> {
    const { pageNumber, limitNumber, skip } = paginateReq(page, limit);
    let matchQuery: any = { isApproved: false };
    if (search) {
      matchQuery.$or = [
        { "trainersList.fname": { $regex: search, $options: "i" } },
        { "trainersList.lname": { $regex: search, $options: "i" } },
        { "trainersList.email": { $regex: search, $options: "i" } },
      ];
    }

    if (fromDate && toDate) {
      matchQuery.createdAt = { $gte: fromDate, $lte: toDate };
    } else {
      if (fromDate) {
        matchQuery.createdAt = { $gte: fromDate };
      }
      if (toDate) {
        matchQuery.createdAt = { $lte: toDate };
      }
    }

    const commonPipeline = [
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "trainersList",
        },
      },
      { $match: matchQuery },
      { $unwind: "$trainersList" },
    ];

    const [totalCount, trainersList] = await Promise.all([
      this.model
        .aggregate([...commonPipeline, { $count: "totalCount" }])
        .then((result) => (result.length > 0 ? result[0].totalCount : 0)),
      this.model
        .aggregate([
          ...commonPipeline,
          {
            $project: {
              fname: "$trainersList.fname",
              lname: "$trainersList.lname",
              email: "$trainersList.email",
              role: "$trainersList.role",
              isBlocked: "$trainersList.isBlocked",
              otpVerified: "$trainersList.otpVerified",
              googleVerified: "$trainersList.googleVerified",
              phone: "$trainersList.phone",
              dateOfBirth: "$trainersList.dateOfBirth",
              profilePic: "$trainersList.profilePic",
              age: "$trainersList.age",
              height: "$trainersList.height",
              weight: "$trainersList.weight",
              gender: "$trainersList.gender",

              _id: 1,
              userId: 1,
              yearsOfExperience: 1,
              specializations: 1,
              certifications: 1,
              isApproved: 1,
              aboutMe: 1,
              createdAt: 1,
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
      trainersList,
      paginationData,
    };
  }

  async countPendingTrainerApprovals(): Promise<number> {
    return await this.model.countDocuments({ isApproved: false });
  }
}
