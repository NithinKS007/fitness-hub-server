import {
  BookAppointmentDTO,
  BookingSlotStatus,
} from "@application/dtos/booking-dtos";
import { validationError } from "@presentation/middlewares/error.middleware";
import {
  AppointmentStatus,
  AuthStatus,
} from "@shared/constants/index.constants";
import { IBookingSlotRepository } from "@domain/interfaces/IBookingSlotRepository";
import { IAppointmentRepository } from "@domain/interfaces/IAppointmentRepository";
import { IAppointment } from "@domain/entities/appointment.entity";
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "di/types-repositories";

/*  
    Purpose: Book an appointment by reserving a slot and creating an appointment record
    Incoming: { slotId, userId } (ID of the booking slot and ID of the user)
    Returns: { appointmentData } (The newly created appointment)
    Throws: Error if slot is unavailable, missing parameters, or appointment creation fails
*/

@injectable()
export class BookAppointmentUseCase {
  constructor(
    @inject(TYPES_REPOSITORIES.BookingSlotRepository)
    private bookingSlotRepository: IBookingSlotRepository,
    @inject(TYPES_REPOSITORIES.AppointmentRepository)
    private appointmentRepository: IAppointmentRepository
  ) {}
  async execute({ slotId, userId }: BookAppointmentDTO): Promise<IAppointment> {
    if (!slotId || !userId) {
      throw new validationError(AuthStatus.IdRequired);
    }
    const bookingSlot = await this.bookingSlotRepository.findById(slotId);
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
      this.appointmentRepository.create(appointmentToCreate),
      this.bookingSlotRepository.update(bookingSlotId.toString(), {
        status: BookingSlotStatus.BOOKED,
      }),
    ]);
    if (!appointmentData || !bookingSlotData) {
      throw new validationError(AppointmentStatus.FailedToBookSlot);
    }
    return appointmentData;
  }
}
