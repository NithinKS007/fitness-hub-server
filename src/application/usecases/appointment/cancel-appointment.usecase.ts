import { validationError } from "@presentation/middlewares/error.middleware";
import {
  ApplicationStatus,
  AppointmentStatus,
} from "@shared/constants/index.constants";
import { IAppointmentRepository } from "@domain/interfaces/IAppointmentRepository";
import { IBookingSlotRepository } from "@domain/interfaces/IBookingSlotRepository";
import { BookingSlotStatus, HandleBookingDTO } from "@application/dtos/booking-dtos";
import { Appointment } from "@domain/entities/appointment.entity";
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "@di/types-repositories";
import { ICancelAppointmentUC } from "@application/interfaces/usecases/IAppointmentUC";
import { Action } from "@application/dtos/utility-dtos";

/*  
    Purpose: Cancel an existing appointment and update the booking slot status to "pending"
    Incoming: { appointmentId } (ID of the appointment to be canceled)
    Returns: { cancelledAppointment } (The canceled appointment with updated status)
    Throws: Error if appointment cancellation fails or updating slot status fails
*/

@injectable()
export class CancelAppointmentUseCase implements ICancelAppointmentUC {
  constructor(
    @inject(TYPES_REPOSITORIES.BookingSlotRepository)
    private bookingSlotRepository: IBookingSlotRepository,
    @inject(TYPES_REPOSITORIES.AppointmentRepository)
    private appointmentRepository: IAppointmentRepository
  ) {}

  async execute({ appointmentId, action }: HandleBookingDTO): Promise<Appointment> {
    if (!appointmentId) {
      throw new validationError(ApplicationStatus.AllFieldsAreRequired);
    }
    
    if (![Action.Cancelled].includes(action)) {
      throw new validationError(AppointmentStatus.InvalidAction);
    }

    const cancelledAppointment = await this.appointmentRepository.update(
      appointmentId,
      { status: action }
    );

    if (!cancelledAppointment) {
      throw new validationError(AppointmentStatus.FailedToCancel);
    }

    const changeStatusPending = await this.bookingSlotRepository.update(
      cancelledAppointment.bookingSlotId,
      { status: BookingSlotStatus.PENDING }
    );

    if (!changeStatusPending) {
      throw new validationError(AppointmentStatus.FailedToCancel);
    }
    return cancelledAppointment;
  }
}
