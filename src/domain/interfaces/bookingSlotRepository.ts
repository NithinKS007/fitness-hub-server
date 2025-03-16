import { CreateBookingSlot, IdDTO } from "../../application/dtos";
import { bookingSlot } from "../entities/bookingSlotEntity";

export interface BookingSlotRepository {
    addBookingSlot(data:CreateBookingSlot):Promise<bookingSlot>
    getAvailableSlots(data:IdDTO):Promise<bookingSlot[]>
    findSlotById(data:IdDTO):Promise<bookingSlot | null>
    findBookSlotAndChangeStatusTobooked(data:IdDTO):Promise<bookingSlot | null>
    findBookSlotAndChangeStatusToPending(data:IdDTO):Promise<bookingSlot | null>
    findBookSlotAndChangeStatusToCompleted(data:IdDTO):Promise<bookingSlot | null>
    findByIdAndDeleteSlot(data:IdDTO):Promise<bookingSlot | null>
}