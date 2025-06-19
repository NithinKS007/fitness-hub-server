import { Model } from "mongoose";
import { PaginationDTO } from "@application/dtos/utility-dtos";
import { IBookingSlotRepository } from "@domain/interfaces/IBookingSlotRepository";
import { AvailableSlotsQueryDTO } from "@application/dtos/query-dtos";
import { BaseRepository } from "@infrastructure/databases/repositories/base.repository";
import { paginateReq, paginateRes } from "@shared/utils/handle-pagination";
import BookingSlotModel from "../models/booking-slot.model";
import { IBookingSlot } from "@domain/entities/booking-slot.entity";

export class BookingSlotRepository
  extends BaseRepository<IBookingSlot>
  implements IBookingSlotRepository
{
  constructor(model: Model<IBookingSlot> = BookingSlotModel) {
    super(model);
  }

  protected resetToUTCStartOfDay() {
    return new Date(new Date().setUTCHours(0, 0, 0, 0));
  }

  async getPendingSlots(
    trainerId: string,
    { page, limit, fromDate, toDate }: AvailableSlotsQueryDTO
  ): Promise<{
    availableSlotsList: IBookingSlot[];
    paginationData: PaginationDTO;
  }> {
    const { pageNumber, limitNumber, skip } = paginateReq(page, limit);
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

    const paginationData = paginateRes({
      totalCount,
      pageNumber,
      limitNumber,
    });
    return {
      availableSlotsList,
      paginationData,
    };
  }

  async getUpcomingSlots(
    trainerId: string,
    { page, limit, fromDate, toDate }: AvailableSlotsQueryDTO
  ): Promise<{
    availableSlotsList: IBookingSlot[];
    paginationData: PaginationDTO;
  }> {
    const { pageNumber, limitNumber, skip } = paginateReq(page, limit);
    const currentDate = this.resetToUTCStartOfDay();
    let matchQuery: any = {
      $gte: currentDate,
    };

    if (fromDate) {
      if (fromDate < currentDate) {
        matchQuery = {
          ...matchQuery,
          $gte: currentDate,
        };
      } else {
        matchQuery = { ...matchQuery, $gte: fromDate };
      }
    }
    if (toDate) {
      if (toDate < currentDate) {
        matchQuery = {
          ...matchQuery,
          $lte: currentDate,
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

    const paginationData = paginateRes({
      totalCount,
      pageNumber,
      limitNumber,
    });
    return {
      availableSlotsList,
      paginationData,
    };
  }

  async getAllPendingSlots(trainerId: string): Promise<IBookingSlot[]> {
    return await this.model.find({
      trainerId: trainerId,
      date: { $gte: this.resetToUTCStartOfDay() },
      status: "pending",
    });
  }
}
