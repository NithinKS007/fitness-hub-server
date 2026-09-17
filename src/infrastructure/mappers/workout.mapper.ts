import { BaseMapper } from "./BaseMapper";

export interface WeightLiftedByDateUILayer {
  date: string;
  totalWeight: number;
}

export interface WeightLiftedByDateDBLayer {
  _id: Date;
  totalWeight: number;
}

export class WeightLiftedByDateMapper extends BaseMapper<
  WeightLiftedByDateDBLayer,
  WeightLiftedByDateUILayer
> {
  mapToDomain(data: WeightLiftedByDateDBLayer): WeightLiftedByDateUILayer {
    return {
      date: this.mapToISODateString(data._id),
      totalWeight: data.totalWeight,
    };
  }
  map(data: WeightLiftedByDateDBLayer): WeightLiftedByDateUILayer {
    return this.toDomain(data, this.mapToDomain.bind(this));
  }
}
