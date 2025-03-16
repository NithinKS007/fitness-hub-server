import mongoose from "mongoose";
import { approveRejectBookingRequest, CreateAppointment, IdDTO } from "../../../application/dtos";
import { appointment, AppointmentRequestsTrainer, AppointmentRequestsUser } from "../../../domain/entities/appointmentEntity";
import { AppointmentRepository } from "../../../domain/interfaces/appointmentRepository";
import appointmentModel from "../models/appointmentModel";
const today = new Date(); 
today.setUTCHours(0, 0, 0, 0)

export class MongoAppointmentRepository implements AppointmentRepository{
    public async createAppointment(data: CreateAppointment): Promise<appointment> {
        return await appointmentModel.create(data)
    }
    public async getBookingAppointmentRequests(data: IdDTO): Promise<AppointmentRequestsTrainer[]> {
        const result = await appointmentModel.aggregate([
            { 
              $match: { 
                trainerId:new mongoose.Types.ObjectId(data),
                status: "pending",
                appointmentDate: { $gte: today}
              }
            },
            { $lookup:{from:"users",localField:"userId",foreignField:"_id",as:"userData" }},
            { $unwind: { path: "$userData", preserveNullAndEmptyArrays: true } },  
            { $lookup:{from:"bookingslots",localField:"bookingSlotId",foreignField:"_id",as:"bookingSlotData" }},
            { $unwind: { path: "$bookingSlotData", preserveNullAndEmptyArrays: true } },
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
          ])
        return result
    }
    public async approveOrRejectAppointment(data: approveRejectBookingRequest): Promise<appointment | null> {
      const {appointmentId,action} = data
      return await appointmentModel.findByIdAndUpdate(appointmentId, { status: action }, { new: true });
    }
    public async getAppointMentSchedulesForTrainer(data: IdDTO): Promise<AppointmentRequestsTrainer[]> {
      const result = await appointmentModel.aggregate([
          { 
            $match: { 
              trainerId:new mongoose.Types.ObjectId(data),
              status: "approved",
              appointmentDate: { $gte: today}
            }
          },
          { $lookup:{from:"users",localField:"userId",foreignField:"_id",as:"userData" }},
          { $unwind: { path: "$userData", preserveNullAndEmptyArrays: true } },  
          { $lookup:{from:"bookingslots",localField:"bookingSlotId",foreignField:"_id",as:"bookingSlotData" }},
          { $unwind: { path: "$bookingSlotData", preserveNullAndEmptyArrays: true } },
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
        ])
      return result
  }
    public async getAppointMentSchedulesUser(data: IdDTO): Promise<AppointmentRequestsUser[]> {
      const result = await appointmentModel.aggregate([
          { 
            $match: { 
              userId:new mongoose.Types.ObjectId(data),
              status: "approved",
              appointmentDate: { $gte: today}
            }
          },
          { $lookup:{from:"trainers",localField:"trainerId",foreignField:"_id",as:"trainerCollectionData" }},
          { $unwind: { path: "$trainerCollectionData", preserveNullAndEmptyArrays: true } },  
          { $lookup:{from:"users",localField:"trainerCollectionData.userId",foreignField:"_id",as:"trainerData" }},
          { $unwind: { path: "$trainerData", preserveNullAndEmptyArrays: true } },  
          { $lookup:{from:"bookingslots",localField:"bookingSlotId",foreignField:"_id",as:"bookingSlotData" }},
          { $unwind: { path: "$bookingSlotData", preserveNullAndEmptyArrays: true } },
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
        ])
      return result
  }


  public async cancelAppointmentSchedule(data: IdDTO): Promise<appointment | null> {
    console.log("for cancel appointment")
    return await appointmentModel.findByIdAndUpdate(new mongoose.Types.ObjectId(data), { status: "cancelled" }, { new: true });
  }


}