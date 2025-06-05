export interface PaginationDTO {
  totalPages: number;
  currentPage: number;
}

export enum Action {
  Approved = "approved",
  Rejected = "rejected",
}
