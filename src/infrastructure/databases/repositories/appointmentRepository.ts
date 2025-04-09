import mongoose from "mongoose";
import { HandleBookingRequestDTO,CreateAppointmentDTO } from "../../../application/dtos/bookingDTOs";
import { IdDTO, PaginationDTO } from "../../../application/dtos/utilityDTOs";
import { Appointment, AppointmentRequestsTrainer, AppointmentRequestsUser } from "../../../domain/entities/appointmentEntity";
import { AppointmentRepository } from "../../../domain/interfaces/appointmentRepository";
import appointmentModel from "../models/appointmentModel";
import { GetBookingRequestsDTO, GetBookingSchedulesDTO } from "../../../application/dtos/queryDTOs";
const today = new Date(); 
today.setUTCHours(0, 0, 0, 0)

export class MongoAppointmentRepository implements AppointmentRepository{
    public async createAppointment(data: CreateAppointmentDTO): Promise<Appointment> {
        return await appointmentModel.create(data)
    }
    public async getBookingAppointmentRequests(_id:IdDTO,data:GetBookingRequestsDTO): Promise<{bookingRequestsList:AppointmentRequestsTrainer[],paginationData:PaginationDTO}> {
        const { page,limit,search,fromDate,toDate,filters} = data
        const pageNumber = parseInt(page, 10) || 1;
        const limitNumber = parseInt(limit, 10) || 10;
        const skip = (pageNumber - 1) * limitNumber;
        let matchQuery: any = {}

        if(data){
          if(search){
            matchQuery.$or = [
              {"userData.fname":{$regex:search,$options:"i"}},
              {"userData.lname":{$regex:search,$options:"i"}},
              {"userData.email":{$regex:search,$options:"i"}}
            ]
          }
          if(filters && filters.length > 0) {
            matchQuery.appointmentTime = {$in:filters}
          }

          if (fromDate && toDate) {
            matchQuery.appointmentDate = { $gte: fromDate, $lte: toDate };
          } else if (fromDate) {
            matchQuery.appointmentDate = { $gte: fromDate }
          } else if (toDate) {
            matchQuery.appointmentDate = { $lte: toDate };
          }
         
        }
        const [ totalCount, bookingRequestsList] = await Promise.all([appointmentModel.aggregate([
          { 
          $match: { 
            trainerId:new mongoose.Types.ObjectId(_id),
            status: "pending",
            appointmentDate: { $gte: today}
          }
        },
        { $lookup:{from:"users",localField:"userId",foreignField:"_id",as:"userData" }},
        { $unwind: { path: "$userData", preserveNullAndEmptyArrays: true } },  
        { $lookup:{from:"bookingslots",localField:"bookingSlotId",foreignField:"_id",as:"bookingSlotData" }},
        { $unwind: { path: "$bookingSlotData", preserveNullAndEmptyArrays: true } },
        { $match:matchQuery},
        { $count: "totalCount" },
      ]).then((result) => (result.length > 0 ? result[0].totalCount : 0)),
         appointmentModel.aggregate([
          { 
            $match: { 
              trainerId:new mongoose.Types.ObjectId(_id),
              status: "pending",
              appointmentDate: { $gte: today}
            }
          },
          { $lookup:{from:"users",localField:"userId",foreignField:"_id",as:"userData" }},
          { $unwind: { path: "$userData", preserveNullAndEmptyArrays: true } },  
          { $lookup:{from:"bookingslots",localField:"bookingSlotId",foreignField:"_id",as:"bookingSlotData" }},
          { $unwind: { path: "$bookingSlotData", preserveNullAndEmptyArrays: true } },
          { $match:matchQuery},
          { $project:{
              _id:1,
              appointmentDate: 1,
              appointmentTime: 1,
              trainerId:1,
              status:1,
              createdAt:1,
        
              "userData._id": 1,
              "userData.fname": 1,
              "userData.lname": 1,
              "userData.email": 1,
              "userData.phone": 1,
              "userData.profilePic": 1,

              "bookingSlotData.createdAt":1,
              "bookingSlotData._id":1

          }}
        ]).sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber)
        .exec()
      ])
        
        const totalPages = Math.ceil(totalCount / limitNumber)
         return {
          bookingRequestsList,
           paginationData: {
             currentPage: pageNumber,
             totalPages: totalPages
           }
         }
    }
    public async approveOrRejectAppointment(data: HandleBookingRequestDTO): Promise<Appointment | null> {
      const {appointmentId,action} = data
      return await appointmentModel.findByIdAndUpdate(appointmentId, { status: action }, { new: true });
    }
    public async getTrainerBookingSchedules(_id:IdDTO,data:GetBookingSchedulesDTO): Promise<{trainerBookingSchedulesList: AppointmentRequestsTrainer[],paginationData:PaginationDTO}> {

      console.log("query data",data,_id)

      const { page,limit,search,fromDate,toDate,filters} = data
      const pageNumber = parseInt(page, 10) || 1;
      const limitNumber = parseInt(limit, 10) || 10;
      const skip = (pageNumber - 1) * limitNumber;

      let matchQuery: any = {}
      if(data){
        if(search){
          matchQuery.$or = [
            {"userData.fname":{$regex:search,$options:"i"}},
            {"userData.lname":{$regex:search,$options:"i"}},
            {"userData.email":{$regex:search,$options:"i"}}
          ]
        }
        if(filters && filters.length > 0) {
          matchQuery.appointmentTime = {$in:filters}
        }

        if (fromDate && toDate) {
          matchQuery.appointmentDate = { $gte: fromDate, $lte: toDate };
        } else if (fromDate) {
          matchQuery.appointmentDate = { $gte: fromDate }
        } else if (toDate) {
          matchQuery.appointmentDate = { $lte: toDate };
        }
       
      }
      const [ totalCount, trainerBookingSchedulesList] = await Promise.all([
        appointmentModel.aggregate([
          {  
        $match: { 
          trainerId:new mongoose.Types.ObjectId(_id),
          status: "approved",
          appointmentDate: { $gte: today}
        }
      },
      { $lookup:{from:"users",localField:"userId",foreignField:"_id",as:"userData" }},
      { $unwind: { path: "$userData", preserveNullAndEmptyArrays: true } },  
      { $lookup:{from:"bookingslots",localField:"bookingSlotId",foreignField:"_id",as:"bookingSlotData" }},
      { $unwind: { path: "$bookingSlotData", preserveNullAndEmptyArrays: true } },
      { $match:matchQuery},
      { $count: "totalCount" },
    ]).then((result) => (result.length > 0 ? result[0].totalCount : 0)),
      appointmentModel.aggregate([
        { 
          $match: { 
            trainerId:new mongoose.Types.ObjectId(_id),
            status: "approved",
            appointmentDate: { $gte: today}
          }
        },
        { $lookup:{from:"users",localField:"userId",foreignField:"_id",as:"userData" }},
        { $unwind: { path: "$userData", preserveNullAndEmptyArrays: true } },  
        { $lookup:{from:"bookingslots",localField:"bookingSlotId",foreignField:"_id",as:"bookingSlotData" }},
        { $unwind: { path: "$bookingSlotData", preserveNullAndEmptyArrays: true } },
        { $match:matchQuery},
        { $project:{
            _id:1,
            appointmentDate: 1,
            appointmentTime: 1,
            trainerId:1,
            status:1,
            createdAt:1,
      
            "userData._id": 1,
            "userData.fname": 1,
            "userData.lname": 1,
            "userData.email": 1,
            "userData.phone": 1,
            "userData.profilePic": 1,

            "bookingSlotData.createdAt":1,
            "bookingSlotData._id":1

        }}
      ]).sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber)
      .exec()
    
    ])
    const totalPages = Math.ceil(totalCount / limitNumber)

    console.log("booking for sending",trainerBookingSchedulesList)
      return { 
        trainerBookingSchedulesList,
        paginationData: {
          currentPage: pageNumber,
          totalPages: totalPages
        }}
  }
    public async getUserBookingSchedules(_id:IdDTO,data:GetBookingSchedulesDTO): Promise<{appointmentList:AppointmentRequestsUser[],paginationData:PaginationDTO}> {
      const { page,limit,search,fromDate,toDate,filters} = data
      const pageNumber = parseInt(page, 10) || 1;
      const limitNumber = parseInt(limit, 10) || 10;
      const skip = (pageNumber - 1) * limitNumber;
      let matchQuery: any = {}

      if(data){
        if(search){
          matchQuery.$or = [
            {"trainerData.fname":{$regex:search,$options:"i"}},
            {"trainerData.lname":{$regex:search,$options:"i"}},
            {"trainerData.email":{$regex:search,$options:"i"}}
          ]
        }
        if(filters && filters.length > 0) {
          matchQuery.appointmentTime = {$in:filters}
        }

        if (fromDate && toDate) {
          matchQuery.appointmentDate = { $gte: fromDate, $lte: toDate };
        } else if (fromDate) {
          matchQuery.appointmentDate = { $gte: fromDate }
        } else if (toDate) {
          matchQuery.appointmentDate = { $lte: toDate };
        }
       
      }

      const [ totalCount, appointmentList] = await Promise.all([
        appointmentModel.aggregate([
          { 
            $match: { 
              userId:new mongoose.Types.ObjectId(_id),
              appointmentDate: { $gte: today}
            }
          },
          { $lookup:{from:"trainers",localField:"trainerId",foreignField:"_id",as:"trainerCollectionData" }},
          { $unwind: { path: "$trainerCollectionData", preserveNullAndEmptyArrays: true } },  
          { $lookup:{from:"users",localField:"trainerCollectionData.userId",foreignField:"_id",as:"trainerData" }},
          { $unwind: { path: "$trainerData", preserveNullAndEmptyArrays: true } },  
          { $lookup:{from:"bookingslots",localField:"bookingSlotId",foreignField:"_id",as:"bookingSlotData" }},
          { $unwind: { path: "$bookingSlotData", preserveNullAndEmptyArrays: true } },
          { $match:matchQuery},
          { $count: "totalCount" },
        ]).then((result) => (result.length > 0 ? result[0].totalCount : 0))
        ,appointmentModel.aggregate([
        { 
          $match: { 
            userId:new mongoose.Types.ObjectId(_id),
            appointmentDate: { $gte: today}
          }
        },
        { $lookup:{from:"trainers",localField:"trainerId",foreignField:"_id",as:"trainerCollectionData" }},
        { $unwind: { path: "$trainerCollectionData", preserveNullAndEmptyArrays: true } },  
        { $lookup:{from:"users",localField:"trainerCollectionData.userId",foreignField:"_id",as:"trainerData" }},
        { $unwind: { path: "$trainerData", preserveNullAndEmptyArrays: true } },  
        { $lookup:{from:"bookingslots",localField:"bookingSlotId",foreignField:"_id",as:"bookingSlotData" }},
        { $unwind: { path: "$bookingSlotData", preserveNullAndEmptyArrays: true } },
        { $match:matchQuery},
        { $project:{
            _id:1,
            appointmentDate: 1,
            appointmentTime: 1,
            trainerId:1,
            status:1,
            createdAt:1,
      
            "trainerData._id":"$trainerCollectionData._id",
            "trainerData.fname": 1,
            "trainerData.lname": 1,
            "trainerData.email": 1,
            "trainerData.phone": 1,
            "trainerData.profilePic": 1,

            "bookingSlotData.createdAt":1,
            "bookingSlotData._id":1

        }}
        
        ]).sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber)
        .exec()
      ])
        
       
      const totalPages = Math.ceil(totalCount / limitNumber)
      return {
        appointmentList:appointmentList,
        paginationData: {
          currentPage: pageNumber,
          totalPages: totalPages
        }
      }
  }


  public async cancelAppointmentSchedule(data: IdDTO): Promise<Appointment | null> {
    console.log("for cancel appointment")
    return await appointmentModel.findByIdAndUpdate(new mongoose.Types.ObjectId(data), { status: "cancelled" }, { new: true });
  }

  public async  getAppointmentById(data:IdDTO):Promise<Appointment | null> {
    return await appointmentModel.findOne(new mongoose.Types.ObjectId(data));
  }

}