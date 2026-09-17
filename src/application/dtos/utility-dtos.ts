export interface PaginationDTO {
  totalPages: number;
  currentPage: number;
}

export enum Action {
  Approved = "approved",
  Rejected = "rejected",
  Cancelled = "cancelled"
}

export interface PagedResponse<T> {
  data: T[];
  pagination: PaginationDTO;
}
