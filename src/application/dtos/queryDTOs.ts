export interface BaseQueryDTO {
  search: string;
  page: string;
  limit: string;
  filters: string[]; 
  fromDate: Date;    
  toDate: Date;      
}
export type GetTrainersQueryDTO = Omit<BaseQueryDTO, "fromDate" | "toDate">;
export type GetTrainersApprovalQueryDTO = Omit<BaseQueryDTO, "filters">;
export type GetUsersQueryDTO = Omit<BaseQueryDTO, "fromDate" | "toDate">;
export type GetTrainerSubscribersQueryDTO = Omit<BaseQueryDTO,"fromDate" | "toDate">
export type GetUserSubscriptionsQueryDTO = Omit<BaseQueryDTO,"fromDate" | "toDate">
export type GetAvailableSlotsDTO =  Omit<BaseQueryDTO, "filters" | "search">;
export type GetBookingRequestsDTO = BaseQueryDTO
export type GetBookingSchedulesDTO = BaseQueryDTO
export type GetVideoCallLogQueryDTO = BaseQueryDTO
export type DashBoardChartFilterDTO = string 
export type DateRangeQueryDTO = {startDate: Date ,endDate: Date}
