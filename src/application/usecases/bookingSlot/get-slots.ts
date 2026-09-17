import { PaginationDTO } from "@application/dtos/utility-dtos";
import { InternalServerError } from "@presentation/middlewares/error.middleware";
import { SlotStatus } from "@shared/constants/index.constants";
import { IBookingSlotRepository } from "@domain/interfaces/IBookingSlotRepository";
import { GetSlotsDTO } from "@application/dtos/query-dtos";
import { BookingSlot } from "@domain/entities/booking-slot.entity";
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "@di/types-repositories";
import { IGetSlotsUC } from "@application/interfaces/usecases/ISlotUC";

/**
 * Purpose: Handles the retrieval of pending booking slots with pagination and filtering based on the given query.
 * Incoming: { trainerId, query (page, limit, fromDate, toDate) } - Trainer ID and query parameters for pagination and filtering.
 * Returns: Object with availableSlotsList (array of IBookingSlot) and paginationData (pagination DTO).
 * Throws: Error if the trainer ID is missing or slot data cannot be retrieved.
 */

@injectable()
export class GetSlotsUseCase implements IGetSlotsUC {
  constructor(
    @inject(TYPES_REPOSITORIES.BookingSlotRepository)
    private bookingSlotRepository: IBookingSlotRepository
  ) {}

  async execute(dtos: GetSlotsDTO): Promise<{
    availableSlotsList: BookingSlot[];
    paginationData: PaginationDTO;
  }> {
    const { data: availableSlotsList, pagination: paginationData } =
      await this.bookingSlotRepository.getSlots(dtos);

    if (!availableSlotsList) {
      throw new InternalServerError(SlotStatus.FailedToGetSlots);
    }
    return { availableSlotsList, paginationData };
  }
}
