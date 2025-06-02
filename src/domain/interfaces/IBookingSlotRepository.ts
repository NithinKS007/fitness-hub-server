import { CreateBookingSlotDTO } from "../../application/dtos/booking-dtos";
import { AvailableSlotsQueryDTO } from "../../application/dtos/query-dtos";
import { PaginationDTO } from "../../application/dtos/utility-dtos";
import { BookingSlot } from "../entities/booking-slot.entities";

export interface IBookingSlotRepository {
  addBookingSlot(slotData: CreateBookingSlotDTO): Promise<BookingSlot>;
  getAvailableSlots(
    trainerId: string,
    availableSlotQueryData: AvailableSlotsQueryDTO
  ): Promise<{
    availableSlotsList: BookingSlot[];
    paginationData: PaginationDTO;
  }>;
  getAllAvailableSlots(trainerId: string): Promise<BookingSlot[]>;
  getUpcomingSlots(
    trainerId: string,
    availableSlotQueryData: AvailableSlotsQueryDTO
  ): Promise<{
    availableSlotsList: BookingSlot[];
    paginationData: PaginationDTO;
  }>;
  findSlotById(bookingSlotId: string): Promise<BookingSlot | null>;
  changeStatus(
    bookingSlotId: string,
    newStatus: "completed" | "pending" | "booked"
  ): Promise<BookingSlot | null>;
  findByIdAndDeleteSlot(bookingSlotId: string): Promise<BookingSlot | null>;
}
