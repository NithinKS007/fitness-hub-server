import { CreateBookingSlotDTO } from "../../application/dtos/bookingDTOs";
import { GetAvailableSlotsDTO } from "../../application/dtos/queryDTOs";
import { IdDTO, PaginationDTO } from "../../application/dtos/utilityDTOs";
import { bookingSlot } from "../entities/bookingSlotEntity";

export interface BookingSlotRepository {
    addBookingSlot(data:CreateBookingSlotDTO):Promise<bookingSlot>
    getAvailableSlots(_id:IdDTO,data:GetAvailableSlotsDTO):Promise<{availableSlotsList:bookingSlot[],paginationData:PaginationDTO}>
    getAvailableSlotsUser(data:IdDTO):Promise<bookingSlot[]>
    findSlotById(data:IdDTO):Promise<bookingSlot | null>
    findBookSlotAndChangeStatusTobooked(data:IdDTO):Promise<bookingSlot | null>
    findBookSlotAndChangeStatusToPending(data:IdDTO):Promise<bookingSlot | null>
    findBookSlotAndChangeStatusToCompleted(data:IdDTO):Promise<bookingSlot | null>
    findByIdAndDeleteSlot(data:IdDTO):Promise<bookingSlot | null>
}