import mongoose from "mongoose";
import { CreateBookingSlot, IdDTO } from "../../../application/dtos";
import { bookingSlot } from "../../../domain/entities/bookingSlotEntity";
import { BookingSlotRepository } from "../../../domain/interfaces/bookingSlotRepository";
import bookingSlotModel from "../models/bookingSlot";

const today = new Date(); 
today.setUTCHours(0, 0, 0, 0)

export class MongoBookingSlotRepository implements BookingSlotRepository {
  public async addBookingSlot(data: CreateBookingSlot): Promise<bookingSlot> {
    const {trainerId,time,date} = data
    const Id = new mongoose.Types.ObjectId(trainerId)
    const slotData =  await bookingSlotModel.create({trainerId:Id,time,date:date})
    return slotData
  }

  public async getAvailableSlots(data: IdDTO): Promise<bookingSlot[]> {

    return await bookingSlotModel.find({trainerId:data, date: { $gte: today},status:"pending"})
  }
  public async getBookingSlotsOfTrainerFromTodayOnWards(data: IdDTO): Promise<bookingSlot[]> {
    return await bookingSlotModel.find({trainerId:data, $and :[{date: { $gte: today }},{status:"pending"}]})
  }

  public async findSlotById(data:IdDTO):Promise<bookingSlot | null> {
    return await bookingSlotModel.findById(data)
  }
  public async findBookSlotAndChangeStatusTobooked(data:IdDTO):Promise<bookingSlot | null> {
    return await bookingSlotModel.findByIdAndUpdate(new mongoose.Types.ObjectId(data),{status:"booked"},{new:true})
  }
  public async findBookSlotAndChangeStatusToPending(data:IdDTO):Promise<bookingSlot | null> {
    console.log("for cancel booking")
    return await bookingSlotModel.findByIdAndUpdate(new mongoose.Types.ObjectId(data),{status:"pending"},{new:true})
  }
  public async findBookSlotAndChangeStatusToCompleted(data:IdDTO):Promise<bookingSlot | null> {
    return await bookingSlotModel.findByIdAndUpdate(new mongoose.Types.ObjectId(data),{status:"completed"},{new:true})
  }
  public async findByIdAndDeleteSlot(data:IdDTO):Promise<bookingSlot | null> {
    return await bookingSlotModel.findByIdAndDelete(new mongoose.Types.ObjectId(data))
  }
  
}
