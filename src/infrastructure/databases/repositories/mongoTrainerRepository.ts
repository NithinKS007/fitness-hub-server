import mongoose from "mongoose";
import { IdDTO } from "../../../application/dtos/utilityDTOs";
import { CreateTrainerCollectionDTO, TrainerDTO } from "../../../application/dtos/trainerDTOs";
import { GetTrainersApprovalQueryDTO, GetTrainersQueryDTO } from "../../../application/dtos/queryDTOs";
import { PaginationDTO } from "../../../application/dtos/utilityDTOs";
import { TrainerVerificationDTO } from "../../../application/dtos/trainerDTOs";

import {
  Trainer,
  TrainerSpecific,
} from "../../../domain/entities/trainerEntity";
import { TrainerWithSubscription } from "../../../domain/entities/trainerWithSubscription";
import { TrainerRepository } from "../../../domain/interfaces/trainerRepository";
import TrainerModel from "../models/trainerModel";

export class MongoTrainerRepository implements TrainerRepository {

  public async create( data: CreateTrainerCollectionDTO ): Promise<TrainerSpecific> {
    return (await TrainerModel.create(data)).toObject();
  }
  
  public async updateTrainerSpecificData( data: TrainerDTO): Promise<TrainerSpecific | null> {
    let updated: any = {};
    const { certifications, specializations, aboutMe, yearsOfExperience, _id } = data;

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
    const result =  await TrainerModel.findOneAndUpdate(new mongoose.Types.ObjectId(_id),updated, { new: true }).lean()
    return result
  }

  public async getTrainerDetailsById(data: IdDTO): Promise<Trainer> {

    const trainerData = await TrainerModel.aggregate([
      { 
        $match: { 
          _id: new mongoose.Types.ObjectId(data)
        } 
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
          userId:1,
          yearsOfExperience: 1,
          specializations: 1,
          certifications: 1,
          isApproved: 1,
          aboutMe: 1,
          createdAt:1,
        },
      },
    ]);
    return trainerData[0]
  }
  
  public async getApprovedTrainerDetailsWithSub(data:IdDTO):Promise<TrainerWithSubscription>{
    const result = await TrainerModel.aggregate([
      { 
        $match: { 
          _id: new mongoose.Types.ObjectId(data),
          isApproved:true
        } 
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
          userId:1,
          yearsOfExperience: 1,
          specializations: 1,
          certifications: 1,
          isApproved:1,
          aboutMe: 1,
          subscriptionDetails: "$subscriptionDetails",
          createdAt:1,
        },
      },
    ]);
    return result[0]
  }

  public async approveRejectTrainerVerification(data: TrainerVerificationDTO): Promise<Trainer | null> {
    const { _id, action } = data;
    if (action === "approved") {
      return await TrainerModel.findByIdAndUpdate(
        _id,
        { isApproved: true },
        { new: true }
      )
    }
    if (action === "rejected") {
      return await TrainerModel.findByIdAndDelete(_id)
    }
    return null;
  }

  public async getTrainerDetailsByUserIdRef(data: IdDTO): Promise<Trainer> {
    const trainerData = await TrainerModel.aggregate([
      { 
        $match: { 
          userId: new mongoose.Types.ObjectId(data)
        } 
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
          userId:1,
          yearsOfExperience: 1,
          specializations: 1,
          certifications: 1,
          isApproved: 1,
          aboutMe: 1,
          createdAt:1,
        },
      },
    ]);
    return trainerData[0]
  }

  public async getTrainers(data:GetTrainersQueryDTO): Promise<{trainersList:Trainer[],paginationData:PaginationDTO}> {

    const { page,limit,search,filters } = data
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    const skip = (pageNumber - 1) * limitNumber;
    
    let matchQuery:any = {}

    if(data){
       if(search){
          matchQuery.$or = [
            {"trainersList.fname":{$regex:search,$options:"i"}},
            {"trainersList.lname":{$regex:search,$options:"i"}},
            {"trainersList.email":{$regex:search,$options:"i"}}
          ]
       }

       if(filters && filters.length > 0 && !filters.includes("All")){
          const conditions:any = []
          if (filters.includes("Block")) conditions.push({"trainersList.isBlocked":true})
          if (filters.includes("Unblock")) conditions.push({"trainersList.isBlocked": false });
          if (filters.includes("verified")) conditions.push({ $or: [{ "trainersList.otpVerified": true }, {"trainersList. googleVerified": true }] });
          if (filters.includes("Not verified")) conditions.push({ $and:[{ "trainersList.otpVerified": false},{"trainersList.googleVerified": false }]});
          if (filters.includes("Approved")) conditions.push({ isApproved: true });
          if (filters.includes("Not Approved")) conditions.push({ isApproved: false });
          if (conditions.length > 0) matchQuery.$and = conditions;
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
        .exec()
    ]);

    const totalPages = Math.ceil(totalCount / limitNumber);
    return {
      trainersList,
      paginationData: {
        currentPage: pageNumber,
        totalPages:totalPages,
      },
    };
  }

  public async  getApprovedTrainers(searchFilterQuery:any): Promise<Trainer[]> {

    let matchQuery :any = {}

    if(searchFilterQuery){
      if(searchFilterQuery.Search){
        matchQuery.$or = [
           {"trainersList.fname":{$regex:searchFilterQuery.Search,$options:"i"}},
           {"trainersList.lname":{$regex:searchFilterQuery.Search,$options:"i"}},
           {"trainersList.email":{$regex:searchFilterQuery.Search,$options:"i"}}
        ]
     }

     if (searchFilterQuery?.Specialization?.length > 0) {
      matchQuery.specializations = { $in: searchFilterQuery.Specialization };
     }
      
      if(searchFilterQuery?.Experience?.length > 0) {
             const experienceConditions:any = [];
          searchFilterQuery.Experience.forEach((ex:any)=>{
              if(ex==="1-3"){
                experienceConditions.push({ yearsOfExperience: { $gte: "1", $lte: "3" } });
              }

              if(ex==="3-5"){
                experienceConditions.push({ yearsOfExperience: { $gte: "3", $lte: "5" } });
              }
              if(ex==="Greater than 5"){
                experienceConditions.push({ yearsOfExperience: { $gt: "5" } });
              }
              if(ex==="Less than 1"){
                experienceConditions.push({ yearsOfExperience: { $lt: "1" } });
              }
               
          })
          if (experienceConditions.length > 0) {
            matchQuery.$or = experienceConditions;
          }
      }

      if(searchFilterQuery?.Gender?.length > 0){
         const gender:any = []
         searchFilterQuery.Gender.forEach((gen:string)=>{
            if(gen==="Male"){
              gender.push("male"); 
            } else if(gen==="Female"){
              gender.push("female")
            } else {
              gender.push("male", "female");
            }
         })
         console.log(gender);  
         if (gender.length > 0) {
          matchQuery["trainersList.gender"] = { $in: gender }; 
        }
      }

    }
    return await TrainerModel.aggregate([
      {$match:{isApproved:true}},
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "trainersList",
        },
      },
      { $unwind: "$trainersList" },
      { $match: {"trainersList.isBlocked":false}},
      { $match: matchQuery},
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
          userId:1,
          yearsOfExperience: 1,
          specializations: 1,
          certifications: 1,
          isApproved:1,
          aboutMe: 1,
          createdAt:1,
        },
      },
      
    ]).sort({ createdAt: -1 });
  }

  public async getApprovalPendingList(data:GetTrainersApprovalQueryDTO):Promise<{trainersList:Trainer[],paginationData:PaginationDTO}>{

    const { page,limit,search,fromDate,toDate } = data
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    const skip = (pageNumber - 1) * limitNumber;
    let matchQuery: any = { isApproved: false }

    if(data){
      if(search){
        matchQuery.$or = [
          {"trainersList.fname":{$regex:search,$options:"i"}},
          {"trainersList.lname":{$regex:search,$options:"i"}},
          {"trainersList.email":{$regex:search,$options:"i"}}
        ]
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
      
    }

     const [ totalCount, trainersList] = await Promise.all([
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
      ]).then((result) => (result.length > 0 ? result[0].totalCount : 0))
      ,TrainerModel.aggregate([
      
          {
            $lookup: {
              from: "users",
              localField: "userId",
              foreignField: "_id",
              as: "trainersList",
            },
          },
          { $match:matchQuery},
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
              userId:1,
              yearsOfExperience: 1,
              specializations: 1,
              certifications: 1,
              isApproved:1,
              aboutMe: 1,
              createdAt:1,
            },
          },
        ]).sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber)
        .exec()
    
     ]) 
     const totalPages = Math.ceil(totalCount / limitNumber)

     console.log("trainers pending list",trainersList)
      return {
        trainersList,
        paginationData: {
          currentPage: pageNumber,
          totalPages: totalPages
        }
      }
  }

  public async countPendingTrainerApprovals(): Promise<number> {
    return await TrainerModel.countDocuments({isApproved:false})
  }
}
