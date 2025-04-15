import mongoose from "mongoose";
import { CreateBookingSlotDTO } from "../../../application/dtos/bookingDTOs";
import { IdDTO, PaginationDTO } from "../../../application/dtos/utilityDTOs";
import { BookingSlot } from "../../../domain/entities/bookingSlotEntity";
import { IBookingSlotRepository } from "../../../domain/interfaces/IBookingSlotRepository";
import bookingSlotModel from "../models/bookingSlot";
import { AvailableSlotsQueryDTO } from "../../../application/dtos/queryDTOs";

const today = new Date();
today.setUTCHours(0, 0, 0, 0);

export class MongoBookingSlotRepository implements IBookingSlotRepository {
  public async addBookingSlot({
    trainerId,
    time,
    date,
  }: CreateBookingSlotDTO): Promise<BookingSlot> {
    const Id = new mongoose.Types.ObjectId(trainerId);
    return await bookingSlotModel.create({ trainerId: Id, time, date: date });
  }

  public async getAvailableSlots(
    trainerId: IdDTO,
    { page, limit, fromDate, toDate }: AvailableSlotsQueryDTO
  ): Promise<{
    availableSlotsList: BookingSlot[];
    paginationData: PaginationDTO;
  }> {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    let matchQuery: any = { $gte: today };

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

    const [totalCount, availableSlotsList] = await Promise.all([
      bookingSlotModel.countDocuments({
        trainerId: trainerId,
        date: matchQuery,
        status: "pending",
      }),
      bookingSlotModel
        .find({ trainerId: trainerId, date: matchQuery, status: "pending" })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber)
        .exec(),
    ]);

    const totalPages = Math.ceil(totalCount / limitNumber);
    return {
      availableSlotsList,
      paginationData: {
        currentPage: pageNumber,
        totalPages: totalPages,
      },
    };
  }

  public async getAvailableSlotsUser(trainerId: IdDTO): Promise<BookingSlot[]> {
    return await bookingSlotModel.find({
      trainerId: trainerId,
      date: { $gte: today },
      status: "pending",
    });
  }

  public async getBookingSlotsOfTrainerFromTodayOnWards(
    trainerId: IdDTO
  ): Promise<BookingSlot[]> {
    return await bookingSlotModel.find({
      trainerId: trainerId,
      $and: [{ date: { $gte: today } }, { status: "pending" }],
    });
  }

  public async findSlotById(bookingSlotId: IdDTO): Promise<BookingSlot | null> {
    return await bookingSlotModel.findById(bookingSlotId);
  }
  public async findBookSlotAndChangeStatusTobooked(
    bookingSlotId: IdDTO
  ): Promise<BookingSlot | null> {
    return await bookingSlotModel.findByIdAndUpdate(
      new mongoose.Types.ObjectId(bookingSlotId),
      { status: "booked" },
      { new: true }
    );
  }
  public async findBookSlotAndChangeStatusToPending(
    bookingSlotId: IdDTO
  ): Promise<BookingSlot | null> {
    return await bookingSlotModel.findByIdAndUpdate(
      new mongoose.Types.ObjectId(bookingSlotId),
      { status: "pending" },
      { new: true }
    );
  }
  public async findBookSlotAndChangeStatusToCompleted(
    bookingSlotId: IdDTO
  ): Promise<BookingSlot | null> {
    return await bookingSlotModel.findByIdAndUpdate(
      new mongoose.Types.ObjectId(bookingSlotId),
      { status: "completed" },
      { new: true }
    );
  }
  public async findByIdAndDeleteSlot(
    bookingSlotId: IdDTO
  ): Promise<BookingSlot | null> {
    return await bookingSlotModel.findByIdAndDelete(
      new mongoose.Types.ObjectId(bookingSlotId)
    );
  }
}
