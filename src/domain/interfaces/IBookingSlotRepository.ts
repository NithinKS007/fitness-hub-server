import { AvailableSlotsQueryDTO } from "@application/dtos/query-dtos";
import { PaginationDTO } from "@application/dtos/utility-dtos";
import { BookingSlot } from "@domain/entities/booking-slot.entity";
import { IBaseRepository } from "@domain/interfaces/IBaseRepository";
import { IBookingSlot } from "@infrastructure/databases/models/booking-slot.model";

export interface IBookingSlotRepository
  extends IBaseRepository<IBookingSlot, BookingSlot> {
  getPendingSlots(dtos: AvailableSlotsQueryDTO): Promise<{
    availableSlotsList: BookingSlot[];
    paginationData: PaginationDTO;
  }>;
  getUpcomingSlots(dtos: AvailableSlotsQueryDTO): Promise<{
    availableSlotsList: BookingSlot[];
    paginationData: PaginationDTO;
  }>;
}
