import { GetSlotsDTO } from "@application/dtos/query-dtos";
import { PagedResponse } from "@application/dtos/utility-dtos";
import { BookingSlot } from "@domain/entities/booking-slot.entity";
import { IBaseRepository } from "@domain/interfaces/IBaseRepository";

export interface IBookingSlotRepository
  extends IBaseRepository<BookingSlot> {
  getSlots(dtos: GetSlotsDTO): Promise<PagedResponse<BookingSlot>>;
}
