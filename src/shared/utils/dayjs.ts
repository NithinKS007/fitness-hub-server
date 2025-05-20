import dayjs from "dayjs";
import { DashBoardChartFilterDTO } from "../../application/dtos/query-dtos";

const getDateRange = (
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

const parseDateRange = (fromDate?: Date, toDate?: Date) => {
  return {
    parsedFromDate: fromDate ? dayjs(fromDate).toDate() : undefined,
    parsedToDate: toDate ? dayjs(toDate).toDate() : undefined,
  };
}



export { getDateRange, parseDateRange };
