import { CreateBookingSlotDTO } from "@application/dtos/booking-dtos";
import { validationError } from "@presentation/middlewares/error.middleware";
import {
  ApplicationStatus,
  SlotStatus,
} from "@shared/constants/index.constants";
import { IBookingSlotRepository } from "@domain/interfaces/IBookingSlotRepository";
import { IBookingSlot } from "@domain/entities/booking-slot.entity";

/**
 * Purpose: Handles the creation of a booking slot for a given date and other slot data.
 * Incoming: { date, ...otherSlotData } - Data required to create a booking slot.
 * Returns: IBookingSlot - The newly created booking slot data.
 * Throws: Error if any required fields are missing or creation fails.
 */

export class CreateBookingSlotUseCase {
  constructor(private bookingSlotRepository: IBookingSlotRepository) {}
  async execute(slotData: CreateBookingSlotDTO): Promise<IBookingSlot> {
    const { date, ...otherSlotData } = slotData;
    if (!slotData) {
      throw new validationError(ApplicationStatus.AllFieldsAreRequired);
    }
    const createdSlotData = await this.bookingSlotRepository.create({
      date: new Date(date),
      ...otherSlotData,
    });
    if (!createdSlotData) {
      throw new validationError(SlotStatus.FailedToCreateBookingSlot);
    }
    return createdSlotData;
  }
}
