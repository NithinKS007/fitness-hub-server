import { ParsedQs } from "qs";
import { DateService } from "../../infrastructure/services/date/date.service";

const dateService = new DateService();
export const parseQueryParams = (query: ParsedQs) => {
  const filters: string[] = Array.isArray(query.filters)
    ? query.filters.filter((filter) => typeof filter === "string")
    : typeof query.filters === "string"
    ? [query.filters]
    : [];

  const fromDate =
    query.fromDate && typeof query.fromDate === "string"
      ? dateService.parseDate(query.fromDate)
      : undefined;

  const toDate =
    query.toDate && typeof query.toDate === "string"
      ? dateService.parseDate(query.toDate)
      : undefined;
  const search =
    query.search && typeof query.search === "string" ? query.search : "";
  const page =
    query.page && typeof query.page === "string"
      ? Number(query.page)
      : Number(1);
  const limit =
    query.limit && typeof query.limit === "string"
      ? Number(query.limit)
      : Number(10);

  const specialization: string[] = Array.isArray(query.specialization)
    ? query.specialization.filter((filter) => typeof filter === "string")
    : typeof query.specialization === "string"
    ? [query.specialization]
    : [];

  const experience: string[] = Array.isArray(query.experience)
    ? query.experience.filter((filter) => typeof filter === "string")
    : typeof query.experience === "string"
    ? [query.experience]
    : [];

  const gender: string[] = Array.isArray(query.gender)
    ? query.gender.filter((filter) => typeof filter === "string")
    : typeof query.gender === "string"
    ? [query.gender]
    : [];

  const sort: string =
    query.sort && typeof query.sort === "string" ? query.sort : "";

  const period: string =
    typeof query.period === "string"
      ? query.period
      : typeof query.period === "object" &&
        query.period !== null &&
        "period" in query.period &&
        typeof query.period["period"] === "string"
      ? query.period["period"]
      : "";

  const bodyPart: string =
    query.bodyPart && typeof query.bodyPart === "string" ? query.bodyPart : "";

  return {
    search,
    page,
    limit,
    filters,
    fromDate,
    toDate,
    specialization,
    experience,
    gender,
    sort,
    period,
    bodyPart,
  };
};
