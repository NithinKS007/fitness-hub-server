import dayjs from "dayjs";
import { DashBoardChartFilterDTO } from "../../../application/dtos/query-dtos";
import { IDateService } from "../../../application/interfaces/date/IDate.service";

export class DateService implements IDateService {
  getDateRange = (
    data: DashBoardChartFilterDTO
  ): { startDate: Date; endDate: Date } => {
    let startDate = dayjs().startOf("month").toDate();
    let endDate = dayjs().endOf("month").toDate();
    switch (data) {
      case "Today":
        startDate = dayjs().startOf("day").toDate();
        endDate = dayjs().endOf("day").toDate();
        break;
      case "This week":
        startDate = dayjs().startOf("week").toDate();
        endDate = dayjs().endOf("week").toDate();
        break;
      case "This month":
        startDate = dayjs().startOf("month").toDate();
        endDate = dayjs().endOf("month").toDate();
        break;
      case "This year":
        startDate = dayjs().startOf("year").toDate();
        endDate = dayjs().endOf("year").toDate();
        break;
      default:
        break;
    }

    return { startDate, endDate };
  };

  parseDate = (date: string): Date => {
    return dayjs(date).toDate();
  };
}
