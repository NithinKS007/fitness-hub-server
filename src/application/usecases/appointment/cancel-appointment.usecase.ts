import { validationError } from "../../../presentation/middlewares/error.middleware";
import {
  ApplicationStatus,
  AppointmentStatus,
  BookingSlotStatus,
} from "../../../shared/constants/index.constants";
import { Appointment } from "../../../domain/entities/appointment.entities";
import { IAppointmentRepository } from "../../../domain/interfaces/IAppointmentRepository";
import { IBookingSlotRepository } from "../../../domain/interfaces/IBookingSlotRepository";

/*  
    Purpose: Cancel an existing appointment and update the booking slot status to "pending"
    Incoming: { appointmentId } (ID of the appointment to be canceled)
    Returns: { cancelledAppointment } (The canceled appointment with updated status)
    Throws: Error if appointment cancellation fails or updating slot status fails
*/

export class CancelAppointmentUseCase {
  constructor(
    private bookingSlotRepository: IBookingSlotRepository,
    private appointmentRepository: IAppointmentRepository
  ) {}
  async execute(appointmentId: string): Promise<Appointment> {
    if (!appointmentId) {
      throw new validationError(ApplicationStatus.AllFieldsAreRequired);
    }
    const cancelledAppointment =
      await this.appointmentRepository.cancelAppointmentSchedule(appointmentId);

    if (!cancelledAppointment) {
      throw new validationError(
        AppointmentStatus.FailedToCancelAppointmentStatus
      );
    }
    const changeStatusPending = await this.bookingSlotRepository.changeStatus(
      cancelledAppointment.bookingSlotId.toString(),
      BookingSlotStatus.PENDING
    );
    if (!changeStatusPending) {
      throw new validationError(
        AppointmentStatus.FailedToCancelAppointmentStatus
      );
    }
    return cancelledAppointment;
  }
}
