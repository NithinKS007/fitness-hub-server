import { FilterQuery, Model } from "mongoose";
import { PagedResponse } from "@application/dtos/utility-dtos";
import { IBookingSlotRepository } from "@domain/interfaces/IBookingSlotRepository";
import { GetSlotsDTO } from "@application/dtos/query-dtos";
import { BaseRepository } from "@infrastructure/databases/repositories/base.repository";
import { paginateReq, paginateRes } from "@shared/utils/handle-pagination";
import BookingSlotModel, { IBookingSlot } from "../models/booking-slot.model";
import { BookingSlot } from "@domain/entities/booking-slot.entity";
import { MongoHelper } from "../utils/mongo-helper";

export class BookingSlotRepository
  extends BaseRepository<IBookingSlot, BookingSlot>
  implements IBookingSlotRepository
{
  constructor(
    model: Model<IBookingSlot> = BookingSlotModel,
    private utility: MongoHelper = new MongoHelper()
  ) {
    super(model);
  }

  async getSlots(dtos: GetSlotsDTO): Promise<PagedResponse<BookingSlot>> {
    const { trainerId, page, limit, fromDate, toDate, type } = dtos;
    const { pageNumber, limitNumber, skip } = paginateReq(page, limit);
    const currentDate = new Date(new Date().setUTCHours(0, 0, 0, 0));
    let matchQuery:FilterQuery<IBookingSlot> = {
      trainerId: trainerId,
      status: "pending",
      ...this.utility.dateFilter({ fromDate, toDate }, "date"),
    };

    switch (type) {
      case "upcoming":
        matchQuery.date =
          fromDate && fromDate < currentDate
            ? { ...matchQuery, $gte: currentDate }
            : { ...matchQuery, $gte: fromDate };
        matchQuery.date =
          toDate && toDate < currentDate
            ? { ...matchQuery, $lte: currentDate }
            : { ...matchQuery, $lte: toDate };
        break;

      default:
        break;
    }

    const [totalCount, availableSlotsList] = await Promise.all([
      this.model.countDocuments(matchQuery),
      this.model
        .find(matchQuery)
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

    const mappedData = availableSlotsList.map((slot) => this.toDomain(slot));
    return {
      data: mappedData,
      pagination: paginationData,
    };
  }
}
