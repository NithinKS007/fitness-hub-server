import { validationError } from "../../../presentation/middlewares/error.middleware";
import {
  ApplicationStatus,
  AppointmentStatus,
} from "../../../shared/constants/index.constants";
import { Appointment } from "../../../domain/entities/appointment.entities";
import { IAppointmentRepository } from "../../../domain/interfaces/IAppointmentRepository";

/*  
    Purpose: Retrieve an appointment by its ID
    Incoming: { appointmentId } (ID of the appointment to retrieve)
    Returns: { appointmentData } (Appointment details if found)
    Throws: Error if appointment ID is missing or appointment is not found
*/

export class GetAppointmentByIdUseCase {
  constructor(private appointmentRepository: IAppointmentRepository) {}
  async execute(appointmentId: string): Promise<Appointment | null> {
    if (!appointmentId) {
      throw new validationError(ApplicationStatus.AllFieldsAreRequired);
    }
    const appointmentData = await this.appointmentRepository.getAppointmentById(
      appointmentId
    );
    if (!appointmentData) {
      throw new validationError(AppointmentStatus.FailedToFindAppointment);
    }
    return appointmentData;
  }
}
