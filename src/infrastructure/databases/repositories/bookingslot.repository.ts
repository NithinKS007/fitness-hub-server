import { Model } from "mongoose";
import { PaginationDTO } from "../../../application/dtos/utility-dtos";
import { BookingSlot } from "../../../domain/entities/booking-slot.entities";
import { IBookingSlotRepository } from "../../../domain/interfaces/IBookingSlotRepository";
import BookingSlotModel, { IBookingSlot } from "../models/booking.slot";
import { AvailableSlotsQueryDTO } from "../../../application/dtos/query-dtos";
import { BaseRepository } from "./base.repository";

export class BookingSlotRepository
  extends BaseRepository<IBookingSlot>
  implements IBookingSlotRepository
{
  constructor(model: Model<IBookingSlot> = BookingSlotModel) {
    super(model);
  }
  async getPendingSlots(
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
      this.model.countDocuments({
        trainerId: trainerId,
        ...matchQuery,
        status: "pending",
      }),
      this.model
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
      this.model.countDocuments({
        trainerId: trainerId,
        date: matchQuery,
        status: "pending",
      }),
      this.model
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

  async getAllPendingSlots(trainerId: string): Promise<BookingSlot[]> {
    return await this.model.find({
      trainerId: trainerId,
      date: { $gte: new Date(new Date().setUTCHours(0, 0, 0, 0)) },
      status: "pending",
    });
  }
}
