import { BookAppointmentDTO } from "../../dtos/booking-dtos";
import { validationError } from "../../../presentation/middlewares/errorMiddleWare";
import {
  AppointmentStatusMessage,
  AuthenticationStatusMessage,
} from "../../../shared/constants/httpResponseStructure";
import { Appointment } from "../../../domain/entities/appointment";
import { IBookingSlotRepository } from "../../../domain/interfaces/IBookingSlotRepository";
import { IAppointmentRepository } from "../../../domain/interfaces/IAppointmentRepository";

export class BookAppointmentUseCase {
  constructor(
    private bookingSlotRepository: IBookingSlotRepository,
    private appointmentRepository: IAppointmentRepository
  ) {}

  public async bookSlotAppointment({
    slotId,
    userId,
  }: BookAppointmentDTO): Promise<Appointment> {
    if (!slotId || !userId) {
      throw new validationError(AuthenticationStatusMessage.IdRequired);
    }

    const bookingSlot = await this.bookingSlotRepository.findSlotById(slotId);

    if (!bookingSlot) {
      throw new validationError(AppointmentStatusMessage.FailedToBookSlot);
    }

    if (bookingSlot.status === "booked" || bookingSlot.status === "completed") {
      throw new validationError(
        AppointmentStatusMessage.SlotCurrentlyUnavailable
      );
    }

    const {
      _id: bookingSlotId,
      trainerId,
      date: appointmentDate,
      time: appointmentTime,
    } = bookingSlot;

    const appointmentData = await this.appointmentRepository.createAppointment({
      bookingSlotId,
      trainerId,
      appointmentDate,
      appointmentTime,
      userId,
    });

    const bookingSlotData =
      await this.bookingSlotRepository.findBookSlotAndChangeStatusTobooked(
        bookingSlot._id.toString()
      );

    if (!appointmentData || !bookingSlotData) {
      throw new validationError(AppointmentStatusMessage.FailedToBookSlot);
    }
    return appointmentData;
  }
}
