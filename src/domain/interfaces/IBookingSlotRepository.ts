import { AvailableSlotsQueryDTO } from "@application/dtos/query-dtos";
import { PaginationDTO } from "@application/dtos/utility-dtos";
import { IBookingSlot } from "@domain/entities/booking-slot.entity";
import { IBaseRepository } from "@domain/interfaces/IBaseRepository";

export interface IBookingSlotRepository extends IBaseRepository<IBookingSlot> {
  getPendingSlots(
    trainerId: string,
    availableSlotQueryData: AvailableSlotsQueryDTO
  ): Promise<{
    availableSlotsList: IBookingSlot[];
    paginationData: PaginationDTO;
  }>;
  getAllPendingSlots(trainerId: string): Promise<IBookingSlot[]>;
  getUpcomingSlots(
    trainerId: string,
    availableSlotQueryData: AvailableSlotsQueryDTO
  ): Promise<{
    availableSlotsList: IBookingSlot[];
    paginationData: PaginationDTO;
  }>;
}
