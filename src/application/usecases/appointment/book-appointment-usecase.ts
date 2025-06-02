import { BookAppointmentDTO } from "../../dtos/booking-dtos";
import { validationError } from "../../../presentation/middlewares/error.middleware";
import {
  AppointmentStatus,
  AuthStatus,
  BookingSlotStatus,
} from "../../../shared/constants/index.constants";
import { Appointment } from "../../../domain/entities/appointment.entities";
import { IBookingSlotRepository } from "../../../domain/interfaces/IBookingSlotRepository";
import { IAppointmentRepository } from "../../../domain/interfaces/IAppointmentRepository";

/*  
    Purpose: Book an appointment by reserving a slot and creating an appointment record
    Incoming: { slotId, userId } (ID of the booking slot and ID of the user)
    Returns: { appointmentData } (The newly created appointment)
    Throws: Error if slot is unavailable, missing parameters, or appointment creation fails
*/

export class BookAppointmentUseCase {
  constructor(
    private bookingSlotRepository: IBookingSlotRepository,
    private appointmentRepository: IAppointmentRepository
  ) {}
  async execute({ slotId, userId }: BookAppointmentDTO): Promise<Appointment> {
    if (!slotId || !userId) {
      throw new validationError(AuthStatus.IdRequired);
    }
    const bookingSlot = await this.bookingSlotRepository.findSlotById(slotId);
    if (!bookingSlot) {
      throw new validationError(AppointmentStatus.FailedToBookSlot);
    }
    const {
      _id: bookingSlotId,
      trainerId,
      date: appointmentDate,
      time: appointmentTime,
      status,
    } = bookingSlot;
    if (
      status === BookingSlotStatus.BOOKED ||
      status === BookingSlotStatus.COMPLETED
    ) {
      throw new validationError(AppointmentStatus.SlotCurrentlyUnavailable);
    }
    const appointmentToCreate = {
      bookingSlotId,
      trainerId,
      appointmentDate,
      appointmentTime,
      userId,
    };
    const [appointmentData, bookingSlotData] = await Promise.all([
      this.appointmentRepository.createAppointment(appointmentToCreate),
      this.bookingSlotRepository.changeStatus(
        bookingSlotId.toString(),
        BookingSlotStatus.BOOKED
      ),
    ]);
    if (!appointmentData || !bookingSlotData) {
      throw new validationError(AppointmentStatus.FailedToBookSlot);
    }
    return appointmentData;
  }
}
