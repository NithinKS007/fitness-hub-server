// Base-query DTOs
export interface BaseQueryDTO {
  search: string;
  page: number;
  limit: number;
  filters?: string[];
  fromDate?: Date;
  toDate?: Date;
}
// Trainer-related DTOs
export interface GetTrainersDTO extends BaseQueryDTO {
  isApproved?: boolean;
  isBlocked?: boolean;
  specialization?: string[];
  experience?: string[];
  gender?: string[];
  sort?: string;
}

export interface GetTrainerSubsDTO {
  search: string;
  page: number;
  limit: number;
  filters?: string[];
  trainerId: string;
}

export interface GetUserTrainersListDTO {
  search: string;
  page: number;
  limit: number;
  userId: string;
}

//User-related DTOs
export interface GetUsersDTO {
  search: string;
  page: number;
  limit: number;
  filters?: string[];
}
export interface GetUserSubDTO extends GetUsersDTO {
  userId: string;
}

// Booking/Schedule-related DTOs
export interface GetSlotsDTO {
  page: number;
  limit: number;
  fromDate?: Date;
  toDate?: Date;
  trainerId: string;
  type: string;
}
export interface GetBookingRequestsDTO extends BaseQueryDTO {
  trainerId: string;
}
export interface GetTrainerSchedulesDTO extends BaseQueryDTO {
  trainerId: string;
}
export interface GetUserSchedulesDTO extends BaseQueryDTO {
  userId: string;
}
export interface GetTrainerVideoCallLogDTO extends BaseQueryDTO {
  trainerId: string;
}
export interface GetUserVideoCallLogDTO extends BaseQueryDTO {
  userId: string;
}

//Dashboard-related DTOs
export interface BaseDashBoardDTO {
  period: string;
}
export interface DateRangeDTO {
  startDate: Date;
  endDate: Date;
}
export interface UserDashBoardDTO extends BaseDashBoardDTO {
  userId: string;
  bodyPart: string;
}
export interface GetWeightLiftedByDateDTO {
  userId: string;
  bodyPart: string;
  startDate: Date;
  endDate: Date;
}

//Content-related DTOs
export interface GetVideosDTO extends BaseQueryDTO {
  trainerId: string;
  videoPrivacy?: boolean;
  playlistPrivacy?: boolean;
}

export interface GetPlayListsDTO extends BaseQueryDTO {
  trainerId: string;
}

//Workout-related DTOs
export interface GetWorkoutsDTO extends BaseQueryDTO {
  userId: string;
}

//FinancialLog-related DTOs
export interface GetTransactions extends BaseQueryDTO {}

export interface GetTrainerChatListDTO {
  search: string;
  trainerId: string;
}

export interface GetUserChatListDTO {
  search: string;
  userId: string;
}
