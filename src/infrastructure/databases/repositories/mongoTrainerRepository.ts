import mongoose from "mongoose";
import {
  CreateTrainerSpecificDTO,
  IdDTO,
  TrainerSpecificDTO,
  trainerVerification,
} from "../../../application/dtos";
import {
  Trainer,
  TrainerSpecific,
} from "../../../domain/entities/trainerEntity";
import { TrainerWithSubscription } from "../../../domain/entities/trainerWithSubscription";
import { TrainerRepository } from "../../../domain/interfaces/trainerRepository";
import TrainerModel from "../models/trainerModel";

export class MonogTrainerRepository implements TrainerRepository {

  public async create( data: CreateTrainerSpecificDTO ): Promise<TrainerSpecific> {
    return (await TrainerModel.create(data)).toObject();
  }
  
  public async updateTrainerSpecificData( data: TrainerSpecificDTO): Promise<TrainerSpecific | null> {
    let updated: any = {};
    const { certifications, specializations, aboutMe, yearsOfExperience, _id } =
      data;

    if (certifications && certifications.length > 0) {
      updated.$push = { certifications: { $each: certifications } };
    }
    if (specializations && specializations.length > 0) {
      updated.$push = {
        ...updated.$push,
        specializations: { $each: specializations },
      };
    }
    if (aboutMe) {
      updated.aboutMe = aboutMe;
    }
    if (yearsOfExperience) {
      updated.yearsOfExperience = yearsOfExperience;
    }

    return await TrainerModel.findByIdAndUpdate(_id, updated, { new: true });
  }

  public async getTrainers(): Promise<Trainer[]> {
    return await TrainerModel.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "trainersList",
        },
      },
      { $unwind: "$trainersList" },
      {
        $project: {
          trainerCollectionOriginalId: "$_id",
          _id: "$trainersList._id",
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
          trainerCollectionOriginalId: "$_id",
          _id: "$trainerDetails._id",
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
    public async approveRejectTrainerVerification(data: trainerVerification): Promise<Trainer | null> {
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

  public async  getApprovedTrainers(searchFilterQuery:any): Promise<Trainer[]> {

    console.log("search query received",searchFilterQuery)

    let matchQuery :any = {}

    if(searchFilterQuery){
      if(searchFilterQuery.Search){
        matchQuery.$or = [
           {"trainersList.fname":{$regex:searchFilterQuery.Search,$options:"i"}},
           {"trainersList.lname":{$regex:searchFilterQuery.Search,$options:"i"}},
           {"trainersList.email":{$regex:searchFilterQuery.Search,$options:"i"}}
        ]
     }

      if(searchFilterQuery?.Specialization?.length > 0){
         matchQuery.$in = [
           {specializations:searchFilterQuery.Specialization}
         ]
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
              if(ex===" Less than 1"){
                experienceConditions.push({ yearsOfExperience: { $lt: "1" } });
              }
               
          })
            matchQuery.$or = experienceConditions
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
      {$match:{"trainersList.isBlocked":false}},
      {$match:matchQuery},
      {
        $project: {
          trainerCollectionOriginalId: "$_id",
          _id: "$trainersList._id",
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

  public async getApprovedTrainerDetailsWithSub(data:IdDTO):Promise<TrainerWithSubscription>{
    const result = await TrainerModel.aggregate([
      { 
        $match: { 
          userId: new mongoose.Types.ObjectId(data),
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
          localField: "trainerDetails._id", 
          foreignField: "trainerId",  
          as: "subscriptionDetails", 
        },
      }, 
      {
        $project: {
          trainerCollectionOriginalId: "$_id",
          _id: "$trainerDetails._id",
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

  public async getApprovalPendingList():Promise<Trainer[]>{
    const trainersList = await TrainerModel.aggregate([
    {$match:{isApproved:false}},
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "trainersList",
        },
      },
      { $unwind: "$trainersList" },
      {
        $project: {
          trainerCollectionOriginalId: "$_id",
          _id: "$trainersList._id",
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
          yearsOfExperience: 1,
          specializations: 1,
          certifications: 1,
          isApproved:1,
          aboutMe: 1,
          createdAt:1,
        },
      },
    ]).sort({ createdAt: -1 });

    console.log("mmuunn",trainersList)
    return trainersList
  }
}
