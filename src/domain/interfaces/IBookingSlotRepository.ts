import { GetSlotsDTO } from "@application/dtos/query-dtos";
import { PagedResponse } from "@application/dtos/utility-dtos";
import { BookingSlot } from "@domain/entities/booking-slot.entity";
import { IBaseRepository } from "@domain/interfaces/IBaseRepository";
import { IBookingSlot } from "@infrastructure/databases/models/booking-slot.model";

export interface IBookingSlotRepository
  extends IBaseRepository<IBookingSlot, BookingSlot> {
  getSlots(dtos: GetSlotsDTO): Promise<PagedResponse<BookingSlot>>;
}
