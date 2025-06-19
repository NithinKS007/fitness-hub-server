import {
  BookingStatus,
  HandleBookingDTO,
} from "@application/dtos/booking-dtos";
import { validationError } from "@presentation/middlewares/error.middleware";
import {
  ApplicationStatus,
  AppointmentStatus,
} from "@shared/constants/index.constants";
import { IBookingSlotRepository } from "@domain/interfaces/IBookingSlotRepository";
import { IAppointmentRepository } from "@domain/interfaces/IAppointmentRepository";
import { Action } from "@application/dtos/utility-dtos";
import { IAppointment } from "@domain/entities/appointment.entity";
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "di/types-repositories";

/*  
    Purpose: Approve or reject a booking request, and update the booking slot and appointment status accordingly
    Incoming: { appointmentId, bookingSlotId, action } (Appointment ID, Booking Slot ID, and action to approve/reject)
    Returns: { appointmentData } (Updated appointment data after approval/rejection)
    Throws: Error if any required fields are missing, booking slot not found, or updating appointment/slot fails
*/

@injectable()
export class HandleBookingApprovalUseCase {
  constructor(
    @inject(TYPES_REPOSITORIES.BookingSlotRepository)
    private bookingSlotRepository: IBookingSlotRepository,
    @inject(TYPES_REPOSITORIES.AppointmentRepository)
    private appointmentRepository: IAppointmentRepository
  ) {}

  async execute({
    appointmentId,
    bookingSlotId,
    action,
  }: HandleBookingDTO): Promise<IAppointment> {
    if (!appointmentId || !bookingSlotId || !action) {
      throw new validationError(ApplicationStatus.AllFieldsAreRequired);
    }
    const bookingSlotData = await this.bookingSlotRepository.findById(
      bookingSlotId
    );
    if (!bookingSlotData) {
      throw new validationError(AppointmentStatus.BookingSlotNotFound);
    }
    const status =
      action === Action.Approved
        ? BookingStatus.Completed
        : BookingStatus.Pending;

    await this.bookingSlotRepository.update(bookingSlotId, { status });
    const appointmentData = await this.appointmentRepository.update(
      appointmentId,
      {
        status: action,
      }
    );

    if (!appointmentData) {
      throw new validationError(
        AppointmentStatus.FailedToApproveRejectBookingStatus
      );
    }
    return appointmentData;
  }
}
