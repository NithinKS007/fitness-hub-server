import { PaginationDTO } from "@application/dtos/utility-dtos";
import { InternalServerError, validationError } from "@presentation/middlewares/error.middleware";
import { AuthStatus, SlotStatus } from "@shared/constants/index.constants";
import { IBookingSlotRepository } from "@domain/interfaces/IBookingSlotRepository";
import { AvailableSlotsQueryDTO } from "@application/dtos/query-dtos";
import { BookingSlot } from "@domain/entities/booking-slot.entity";
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "@di/types-repositories";
import { IGetUpComingSlotsUC } from "@application/interfaces/usecases/ISlotUC";

/**
 * Purpose: Handles the retrieval of upcoming booking slots with pagination and filtering based on the given query.
 * Incoming: { trainerId, query (page, limit, fromDate, toDate) } - Trainer ID and query parameters for 
 * pagination and filtering.
 * Returns: Object with availableSlotsList (array of IBookingSlot) and paginationData (pagination DTO).
 * Throws: Error if the trainer ID is missing or slot data cannot be retrieved.
 */

@injectable()
export class GetUpComingSlotsUseCase implements IGetUpComingSlotsUC {
  constructor(
    @inject(TYPES_REPOSITORIES.BookingSlotRepository)
    private bookingSlotRepository: IBookingSlotRepository
  ) {}

  async execute(
    { trainerId, page, limit, fromDate, toDate }: AvailableSlotsQueryDTO
  ): Promise<{
    availableSlotsList: BookingSlot[];
    paginationData: PaginationDTO;
  }> {
    if (!trainerId) {
      throw new validationError(AuthStatus.IdRequired);
    }
    const query = { page, limit, fromDate, toDate, trainerId };
    const { availableSlotsList, paginationData } =
      await this.bookingSlotRepository.getUpcomingSlots(query);

    if (!availableSlotsList) {
      throw new InternalServerError(SlotStatus.FailedToGetAvailableSlotData);
    }
    return { availableSlotsList, paginationData };
  }
}
