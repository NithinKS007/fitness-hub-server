import { HandleBookingRequestDTO } from "../../dtos/booking-dtos";
import { IdDTO } from "../../dtos/utility-dtos";
import { validationError } from "../../../presentation/middlewares/errorMiddleWare";
import {
  AppointmentStatus,
  AuthStatus,
} from "../../../shared/constants/index-constants";
import { Appointment } from "../../../domain/entities/appointment";
import { IBookingSlotRepository } from "../../../domain/interfaces/IBookingSlotRepository";
import { IAppointmentRepository } from "../../../domain/interfaces/IAppointmentRepository";

export class UpdateAppointmentUseCase {
  constructor(
    private bookingSlotRepository: IBookingSlotRepository,
    private appointmentRepository: IAppointmentRepository
  ) {}

  public async approveOrRejectBooking({
    appointmentId,
    bookingSlotId,
    action,
  }: HandleBookingRequestDTO): Promise<Appointment> {
    if (!appointmentId || !bookingSlotId || !action) {
      throw new validationError(
        AuthStatus.AllFieldsAreRequired
      );
    }
    const bookingSlotData = await this.bookingSlotRepository.findSlotById(
      bookingSlotId
    );

    if (!bookingSlotData) {
      throw new validationError(AppointmentStatus.BookingSlotNotFound);
    }

    if (action === "approved") {
      await this.bookingSlotRepository.findBookSlotAndChangeStatusToCompleted(
        bookingSlotId
      );
    } else {
      await this.bookingSlotRepository.findBookSlotAndChangeStatusToPending(
        bookingSlotId
      );
    }
    const appointmentData =
      await this.appointmentRepository.approveOrRejectAppointment({
        appointmentId,
        action,
        bookingSlotId,
      });

    if (!appointmentData) {
      throw new validationError(
        AppointmentStatus.FailedToApproveRejectBookingStatus
      );
    }
    return appointmentData;
  }

  public async cancelAppointment(appointmentId: IdDTO): Promise<Appointment> {
    if (!appointmentId) {
      throw new validationError(
        AuthStatus.AllFieldsAreRequired
      );
    }
    const cancelledAppointment =
      await this.appointmentRepository.cancelAppointmentSchedule(appointmentId);

    if (!cancelledAppointment) {
      throw new validationError(
        AppointmentStatus.FailedToCancelAppointmentStatus
      );
    }

    const makingbookingSlotAvailableAgain =
      await this.bookingSlotRepository.findBookSlotAndChangeStatusToPending(
        cancelledAppointment.bookingSlotId.toString()
      );
    if (!makingbookingSlotAvailableAgain) {
      throw new validationError(
        AppointmentStatus.FailedToCancelAppointmentStatus
      );
    }

    return cancelledAppointment;
  }
}
