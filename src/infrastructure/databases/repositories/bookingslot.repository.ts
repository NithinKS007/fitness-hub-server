import mongoose from "mongoose";
import { CreateBookingSlotDTO } from "../../../application/dtos/booking-dtos";
import { PaginationDTO } from "../../../application/dtos/utility-dtos";
import { BookingSlot } from "../../../domain/entities/booking-slot.entities";
import { IBookingSlotRepository } from "../../../domain/interfaces/IBookingSlotRepository";
import bookingSlotModel from "../models/booking.slot";
import { AvailableSlotsQueryDTO } from "../../../application/dtos/query-dtos";

export class BookingSlotRepository implements IBookingSlotRepository {
  async addBookingSlot({
    trainerId,
    time,
    date,
  }: CreateBookingSlotDTO): Promise<BookingSlot> {
    const Id = new mongoose.Types.ObjectId(trainerId);
    return await bookingSlotModel.create({ trainerId: Id, time, date: date });
  }

  async getAvailableSlots(
    trainerId: string,
    { page, limit, fromDate, toDate }: AvailableSlotsQueryDTO
  ): Promise<{
    availableSlotsList: BookingSlot[];
    paginationData: PaginationDTO;
  }> {
    const pageNumber = page || 1;
    const limitNumber = limit || 10;
    const skip = (pageNumber - 1) * limitNumber;

    let matchQuery: any = {};

    if (fromDate) matchQuery.date = { $gte: fromDate };
    if (toDate) matchQuery.date = { ...matchQuery.date, $lte: toDate };

    const [totalCount, availableSlotsList] = await Promise.all([
      bookingSlotModel.countDocuments({
        trainerId: trainerId,
        ...matchQuery,
        status: "pending",
      }),
      bookingSlotModel
        .find({ trainerId: trainerId, ...matchQuery, status: "pending" })
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

  async getUpcomingSlots(
    trainerId: string,
    { page, limit, fromDate, toDate }: AvailableSlotsQueryDTO
  ): Promise<{
    availableSlotsList: BookingSlot[];
    paginationData: PaginationDTO;
  }> {
    const pageNumber = page || 1;
    const limitNumber = limit || 9;
    const skip = (pageNumber - 1) * limitNumber;

    let matchQuery: any = {
      $gte: new Date(new Date().setUTCHours(0, 0, 0, 0)),
    };

    if (fromDate) {
      if (fromDate < new Date(new Date().setUTCHours(0, 0, 0, 0))) {
        matchQuery = {
          ...matchQuery,
          $gte: new Date(new Date().setUTCHours(0, 0, 0, 0)),
        };
      } else {
        matchQuery = { ...matchQuery, $gte: fromDate };
      }
    }
    if (toDate) {
      if (toDate < new Date(new Date().setUTCHours(0, 0, 0, 0))) {
        matchQuery = {
          ...matchQuery,
          $lte: new Date(new Date().setUTCHours(0, 0, 0, 0)),
        };
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

  async getAllAvailableSlots(trainerId: string): Promise<BookingSlot[]> {
    return await bookingSlotModel.find({
      trainerId: trainerId,
      date: { $gte: new Date(new Date().setUTCHours(0, 0, 0, 0)) },
      status: "pending",
    });
  }

  async findSlotById(bookingSlotId: string): Promise<BookingSlot | null> {
    return await bookingSlotModel.findById(bookingSlotId);
  }

  async changeStatus(
    bookingSlotId: string,
    newStatus: "booked" | "pending" | "completed"
  ): Promise<BookingSlot | null> {
    return await bookingSlotModel.findByIdAndUpdate(
      new mongoose.Types.ObjectId(bookingSlotId),
      { status: newStatus },
      { new: true }
    );
  }

  async findByIdAndDeleteSlot(
    bookingSlotId: string
  ): Promise<BookingSlot | null> {
    return await bookingSlotModel.findByIdAndDelete(
      new mongoose.Types.ObjectId(bookingSlotId)
    );
  }
}
