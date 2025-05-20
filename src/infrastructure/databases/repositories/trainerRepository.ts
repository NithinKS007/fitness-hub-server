import mongoose from "mongoose";
import { IdDTO } from "../../../application/dtos/utility-dtos";
import {
  CreateTrainerCollectionDTO,
  TrainerDTO,
} from "../../../application/dtos/trainer-dtos";
import {
  GetApprovedTrainerQueryDTO,
  GetTrainersApprovalQueryDTO,
  GetTrainersQueryDTO,
} from "../../../application/dtos/query-dtos";
import { PaginationDTO } from "../../../application/dtos/utility-dtos";
import { TrainerVerificationDTO } from "../../../application/dtos/trainer-dtos";

import {
  Trainer,
  TrainerSpecific,
} from "../../../domain/entities/trainer";
import { TrainerWithSubscription } from "../../../domain/entities/trainerWithSubscription";
import { ITrainerRepository } from "../../../domain/interfaces/ITrainerRepository";
import TrainerModel from "../models/trainerModel";

export class MongoTrainerRepository implements ITrainerRepository {
  public async create(
    createTrainer: CreateTrainerCollectionDTO
  ): Promise<TrainerSpecific> {
    return (await TrainerModel.create(createTrainer)).toObject();
  }

  public async updateTrainerSpecificData({
    certifications,
    specializations,
    aboutMe,
    yearsOfExperience,
    trainerId,
  }: TrainerDTO): Promise<TrainerSpecific | null> {
    let updated: any = {};
    if (certifications && certifications.length > 0) {
      updated.certifications = certifications;
    }
    if (specializations && specializations.length > 0) {
      updated.specializations = specializations;
    }
    if (aboutMe) {
      updated.aboutMe = aboutMe;
    }
    if (yearsOfExperience) {
      updated.yearsOfExperience = yearsOfExperience;
    }
    return await TrainerModel.findOneAndUpdate(
      new mongoose.Types.ObjectId(trainerId),
      updated,
      { new: true }
    ).lean();
  }

  public async getTrainerDetailsById(trainerId: IdDTO): Promise<Trainer> {
    const trainerData = await TrainerModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(trainerId),
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

  public async getApprovedTrainerDetailsWithSub(
    trainerId: IdDTO
  ): Promise<TrainerWithSubscription> {
    const result = await TrainerModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(trainerId),
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

  public async approveRejectTrainerVerification({
    trainerId,
    action,
  }: TrainerVerificationDTO): Promise<Trainer | null> {
    if (action === "approved") {
      return await TrainerModel.findByIdAndUpdate(
        trainerId,
        { isApproved: true },
        { new: true }
      );
    }
    if (action === "rejected") {
      return await TrainerModel.findByIdAndDelete(trainerId);
    }
    return null;
  }

  public async getTrainerDetailsByUserIdRef(userId: IdDTO): Promise<Trainer> {
    const trainerData = await TrainerModel.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
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

  public async getTrainers({
    page,
    limit,
    search,
    filters,
  }: GetTrainersQueryDTO): Promise<{
    trainersList: Trainer[];
    paginationData: PaginationDTO;
  }> {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    const skip = (pageNumber - 1) * limitNumber;

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

    const [totalCount, trainersList] = await Promise.all([
      TrainerModel.aggregate([
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
        { $count: "totalCount" },
      ]).then((result) => (result.length > 0 ? result[0].totalCount : 0)),
      TrainerModel.aggregate([
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

    const totalPages = Math.ceil(totalCount / limitNumber);
    return {
      trainersList,
      paginationData: {
        currentPage: pageNumber,
        totalPages: totalPages,
      },
    };
  }

  public async getApprovedTrainers({
    page,
    limit,
    Search,
    Specialization,
    Experience,
    Gender,
    Sort,
  }: GetApprovedTrainerQueryDTO): Promise<{
    trainersList: Trainer[];
    paginationData: PaginationDTO;
  }> {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    let matchQuery: any = {};
    let sortQuery: any = {};

    if (Sort === "aA - zz") {
      sortQuery = { "trainersList.fname": 1 };
    } else if (Sort === "zz - aa") {
      sortQuery = { "trainersList.fname": -1 };
    } else {
      sortQuery = { createdAt: -1 };
    }

    if (Search) {
      matchQuery.$or = [
        { "trainersList.fname": { $regex: Search, $options: "i" } },
        { "trainersList.lname": { $regex: Search, $options: "i" } },
        { "trainersList.email": { $regex: Search, $options: "i" } },
      ];
    }

    if (Specialization?.length > 0) {
      matchQuery.specializations = { $in: Specialization };
    }

    if (Experience?.length > 0) {
      const experienceConditions: any = [];
      Experience.forEach((ex: string) => {
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

    if (Gender?.length > 0) {
      const gender: any = [];
      Gender.forEach((gen: string) => {
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

    const [totalCount, trainersList] = await Promise.all([
      TrainerModel.aggregate([
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
        { $count: "totalCount" },
      ]).then((result) => (result.length > 0 ? result[0].totalCount : 0)),
      TrainerModel.aggregate([
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

    const totalPages = Math.ceil(totalCount / limitNumber);

    return {
      trainersList,
      paginationData: {
        currentPage: pageNumber,
        totalPages: totalPages,
      },
    };
  }

  public async getApprovalPendingList({
    page,
    limit,
    fromDate,
    toDate,
    search,
  }: GetTrainersApprovalQueryDTO): Promise<{
    trainersList: Trainer[];
    paginationData: PaginationDTO;
  }> {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    const skip = (pageNumber - 1) * limitNumber;
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

    const [totalCount, trainersList] = await Promise.all([
      TrainerModel.aggregate([
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
        { $count: "totalCount" },
      ]).then((result) => (result.length > 0 ? result[0].totalCount : 0)),
      TrainerModel.aggregate([
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
    const totalPages = Math.ceil(totalCount / limitNumber);
    return {
      trainersList,
      paginationData: {
        currentPage: pageNumber,
        totalPages: totalPages,
      },
    };
  }

  public async countPendingTrainerApprovals(): Promise<number> {
    return await TrainerModel.countDocuments({ isApproved: false });
  }
}
