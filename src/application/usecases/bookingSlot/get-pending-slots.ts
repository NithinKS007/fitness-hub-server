import { PaginationDTO } from "../../dtos/utility-dtos";
import { validationError } from "../../../presentation/middlewares/error.middleware";
import {
  AuthStatus,
  SlotStatus,
} from "../../../shared/constants/index.constants";
import { BookingSlot } from "../../../domain/entities/booking-slot.entities";
import { IBookingSlotRepository } from "../../../domain/interfaces/IBookingSlotRepository";
import { AvailableSlotsQueryDTO } from "../../dtos/query-dtos";

export class GetPendingSlotsUseCase {
  constructor(private bookingSlotRepository: IBookingSlotRepository) {}
  async execute(
    trainerId: string,
    { page, limit, fromDate, toDate }: AvailableSlotsQueryDTO
  ): Promise<{
    availableSlotsList: BookingSlot[];
    paginationData: PaginationDTO;
  }> {
    if (!trainerId) {
      throw new validationError(AuthStatus.IdRequired);
    }
    const query = { page, limit, fromDate, toDate };
    const { availableSlotsList, paginationData } =
      await this.bookingSlotRepository.getPendingSlots(trainerId, query);

    if (!availableSlotsList) {
      throw new validationError(SlotStatus.FailedToGetAvailableSlotData);
    }
    return { availableSlotsList, paginationData };
  }
}
