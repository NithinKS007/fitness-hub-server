import { AvailableSlotsQueryDTO } from "../../application/dtos/query-dtos";
import { PaginationDTO } from "../../application/dtos/utility-dtos";
import { IBookingSlot } from "../../infrastructure/databases/models/booking.slot";
import { BookingSlot } from "../entities/booking-slot.entities";
import { IBaseRepository } from "./IBaseRepository";

export interface IBookingSlotRepository extends IBaseRepository<IBookingSlot> {
  getPendingSlots(
    trainerId: string,
    availableSlotQueryData: AvailableSlotsQueryDTO
  ): Promise<{
    availableSlotsList: BookingSlot[];
    paginationData: PaginationDTO;
  }>;
  getAllPendingSlots(trainerId: string): Promise<BookingSlot[]>;
  getUpcomingSlots(
    trainerId: string,
    availableSlotQueryData: AvailableSlotsQueryDTO
  ): Promise<{
    availableSlotsList: BookingSlot[];
    paginationData: PaginationDTO;
  }>;
}
