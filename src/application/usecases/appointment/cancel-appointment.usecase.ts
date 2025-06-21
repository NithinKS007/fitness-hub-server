import { validationError } from "@presentation/middlewares/error.middleware";
import {
  ApplicationStatus,
  AppointmentStatus,
} from "@shared/constants/index.constants";
import { IAppointmentRepository } from "@domain/interfaces/IAppointmentRepository";
import { IBookingSlotRepository } from "@domain/interfaces/IBookingSlotRepository";
import { BookingSlotStatus } from "@application/dtos/booking-dtos";
import { IAppointment } from "@domain/entities/appointment.entity";
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "@di/types-repositories";

/*  
    Purpose: Cancel an existing appointment and update the booking slot status to "pending"
    Incoming: { appointmentId } (ID of the appointment to be canceled)
    Returns: { cancelledAppointment } (The canceled appointment with updated status)
    Throws: Error if appointment cancellation fails or updating slot status fails
*/

@injectable()
export class CancelAppointmentUseCase {
  constructor(
    @inject(TYPES_REPOSITORIES.BookingSlotRepository)
    private bookingSlotRepository: IBookingSlotRepository,
    @inject(TYPES_REPOSITORIES.AppointmentRepository)
    private appointmentRepository: IAppointmentRepository
  ) {}
  
  async execute(appointmentId: string): Promise<IAppointment> {
    if (!appointmentId) {
      throw new validationError(ApplicationStatus.AllFieldsAreRequired);
    }
    const cancelledAppointment = await this.appointmentRepository.update(
      appointmentId,
      { status: "cancelled" }
    );

    if (!cancelledAppointment) {
      throw new validationError(
        AppointmentStatus.FailedToCancelAppointmentStatus
      );
    }
    const changeStatusPending = await this.bookingSlotRepository.update(
      cancelledAppointment.bookingSlotId.toString(),
      { status: BookingSlotStatus.PENDING }
    );
    if (!changeStatusPending) {
      throw new validationError(
        AppointmentStatus.FailedToCancelAppointmentStatus
      );
    }
    return cancelledAppointment;
  }
}
