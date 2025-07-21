import { CreateBookingSlotDTO } from "@application/dtos/booking-dtos";
import {
  InternalServerError,
  validationError,
} from "@presentation/middlewares/error.middleware";
import {
  ApplicationStatus,
  SlotStatus,
} from "@shared/constants/index.constants";
import { IBookingSlotRepository } from "@domain/interfaces/IBookingSlotRepository";
import { BookingSlot } from "@domain/entities/booking-slot.entity";
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "@di/types-repositories";
import { ICreateBookingSlotUC } from "@application/interfaces/usecases/ISlotUC";

/**
 * Purpose: Handles the creation of a booking slot for a given date and other slot data.
 * Incoming: { date, ...otherSlotData } - Data required to create a booking slot.
 * Returns: IBookingSlot - The newly created booking slot data.
 * Throws: Error if any required fields are missing or creation fails.
 */

@injectable()
export class CreateBookingSlotUseCase implements ICreateBookingSlotUC {
  constructor(
    @inject(TYPES_REPOSITORIES.BookingSlotRepository)
    private bookingSlotRepository: IBookingSlotRepository
  ) {}

  async execute(slotData: CreateBookingSlotDTO): Promise<BookingSlot> {
    const { date, ...otherSlotData } = slotData;
    if (!slotData) {
      throw new validationError(ApplicationStatus.AllFieldsAreRequired);
    }
    const createdSlotData = await this.bookingSlotRepository.create({
      date: new Date(date),
      ...otherSlotData,
    });
    if (!createdSlotData) {
      throw new InternalServerError(SlotStatus.CreateFailed);
    }
    return createdSlotData;
  }
}
