import { PaginationDTO } from "@application/dtos/utility-dtos";
import { validationError } from "@presentation/middlewares/error.middleware";
import { AuthStatus, SlotStatus } from "@shared/constants/index.constants";
import { IBookingSlotRepository } from "@domain/interfaces/IBookingSlotRepository";
import { AvailableSlotsQueryDTO } from "@application/dtos/query-dtos";
import { IBookingSlot } from "@domain/entities/booking-slot.entity";

/**
 * Purpose: Handles the retrieval of upcoming booking slots with pagination and filtering based on the given query.
 * Incoming: { trainerId, query (page, limit, fromDate, toDate) } - Trainer ID and query parameters for pagination and filtering.
 * Returns: Object with availableSlotsList (array of IBookingSlot) and paginationData (pagination DTO).
 * Throws: Error if the trainer ID is missing or slot data cannot be retrieved.
 */

export class GetUpComingSlotsUseCase {
  constructor(private bookingSlotRepository: IBookingSlotRepository) {}
  async execute(
    trainerId: string,
    { page, limit, fromDate, toDate }: AvailableSlotsQueryDTO
  ): Promise<{
    availableSlotsList: IBookingSlot[];
    paginationData: PaginationDTO;
  }> {
    if (!trainerId) {
      throw new validationError(AuthStatus.IdRequired);
    }
    const query = { page, limit, fromDate, toDate };
    const { availableSlotsList, paginationData } =
      await this.bookingSlotRepository.getUpcomingSlots(trainerId, query);

    if (!availableSlotsList) {
      throw new validationError(SlotStatus.FailedToGetAvailableSlotData);
    }
    return { availableSlotsList, paginationData };
  }
}
