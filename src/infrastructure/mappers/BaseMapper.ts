import { ObjectId } from "mongoose";

export class BaseMapper<T, D> {
  toDomain(data: T, transformFn: (data: T) => D): D {
    return transformFn(data);
  }

  mapToString(data: ObjectId): string {
    return data.toString();
  }

  mapToISODateString(data: Date): string {
    return new Date(data).toISOString().split("T")[0]
  }
}
