import { CreateBookingSlotDTO } from "../../application/dtos/bookingDTOs";
import { AvailableSlotsQueryDTO } from "../../application/dtos/queryDTOs";
import { IdDTO, PaginationDTO } from "../../application/dtos/utilityDTOs";
import { BookingSlot } from "../entities/bookingSlot";

export interface IBookingSlotRepository {
  addBookingSlot(slotData: CreateBookingSlotDTO): Promise<BookingSlot>;
  getAvailableSlots(
    trainerId: IdDTO,
    availableSlotQueryData: AvailableSlotsQueryDTO
  ): Promise<{
    availableSlotsList: BookingSlot[];
    paginationData: PaginationDTO;
  }>;
  getAllAvailableSlotsFromToday(trainerId: IdDTO): Promise<BookingSlot[]>;
  getAvailableSlotsFromToday(
    trainerId: IdDTO,
    availableSlotQueryData: AvailableSlotsQueryDTO
  ): Promise<{
    availableSlotsList: BookingSlot[];
    paginationData: PaginationDTO;
  }>;
  findSlotById(bookingSlotId: IdDTO): Promise<BookingSlot | null>;
  findBookSlotAndChangeStatusTobooked(
    bookingSlotId: IdDTO
  ): Promise<BookingSlot | null>;
  findBookSlotAndChangeStatusToPending(
    bookingSlotId: IdDTO
  ): Promise<BookingSlot | null>;
  findBookSlotAndChangeStatusToCompleted(
    bookingSlotId: IdDTO
  ): Promise<BookingSlot | null>;
  findByIdAndDeleteSlot(bookingSlotId: IdDTO): Promise<BookingSlot | null>;
}
