export interface IDateService {
  getDateRange(data: string): { startDate: Date; endDate: Date };
  parseDate(date: string): Date;
}
