export type IdDTO = string;
export type RoleDTO = "user" | "admin" | "trainer";
export interface PaginationDTO {
  totalPages: number;
  currentPage: number;
}
