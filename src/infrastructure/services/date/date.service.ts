import dayjs from "dayjs";
import { IDateService } from "../../../application/interfaces/date/IDate.service";
import { DateRange } from "../../../application/dtos/service/date.service";

export class DateService implements IDateService {
  getDateRange = (data: DateRange): { startDate: Date; endDate: Date } => {
    let startDate = dayjs().startOf("month").toDate();
    let endDate = dayjs().endOf("month").toDate();
    switch (data) {
      case DateRange.Today:
        startDate = dayjs().startOf("day").toDate();
        endDate = dayjs().endOf("day").toDate();
        break;
      case DateRange.ThisWeek:
        startDate = dayjs().startOf("week").toDate();
        endDate = dayjs().endOf("week").toDate();
        break;
      case DateRange.ThisMonth:
        startDate = dayjs().startOf("month").toDate();
        endDate = dayjs().endOf("month").toDate();
        break;
      case DateRange.ThisYear:
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
