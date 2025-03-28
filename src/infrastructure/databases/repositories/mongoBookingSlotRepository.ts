import mongoose from "mongoose";
import { CreateBookingSlotDTO } from "../../../application/dtos/bookingDTOs";
import { IdDTO, PaginationDTO } from "../../../application/dtos/utilityDTOs";
import { bookingSlot } from "../../../domain/entities/bookingSlotEntity";
import { BookingSlotRepository } from "../../../domain/interfaces/bookingSlotRepository";
import bookingSlotModel from "../models/bookingSlot";
import { GetAvailableSlotsDTO } from "../../../application/dtos/queryDTOs";

const today = new Date(); 
today.setUTCHours(0, 0, 0, 0)

export class MongoBookingSlotRepository implements BookingSlotRepository {
  public async addBookingSlot(data: CreateBookingSlotDTO): Promise<bookingSlot> {
    const {trainerId,time,date} = data
    const Id = new mongoose.Types.ObjectId(trainerId)
    const slotData =  await bookingSlotModel.create({trainerId:Id,time,date:date})
    return slotData
  }

  public async getAvailableSlots(_id:IdDTO,data:GetAvailableSlotsDTO): Promise<{availableSlotsList:bookingSlot[],paginationData:PaginationDTO}> {
    const { page,limit,fromDate,toDate } = data
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    const skip = (pageNumber - 1) * limitNumber;
    
    let matchQuery:any =  { $gte: today}

    if (fromDate) {
      if (fromDate < today) {
          matchQuery = { ...matchQuery, $gte: today };  
      } else {
          matchQuery = { ...matchQuery, $gte: fromDate };  
      }
    }
    if (toDate) {
        if (toDate < today) {
            matchQuery = { ...matchQuery, $lte: today };  
        } else {
            matchQuery = { ...matchQuery, $lte: toDate };  
        }
    }

   const [totalCount,availableSlotsList] = await Promise.all([
      bookingSlotModel.countDocuments({trainerId:_id,date:matchQuery,status:"pending"})
    , bookingSlotModel.find({trainerId:_id,date:matchQuery,status:"pending"}).sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNumber)
    .exec()
  ])
  
  const totalPages = Math.ceil(totalCount / limitNumber)
  return {
    availableSlotsList,
    paginationData: {
      currentPage: pageNumber,
      totalPages: totalPages
     }
    }
  }

  public async getAvailableSlotsUser(data: IdDTO): Promise<bookingSlot[]> {

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
