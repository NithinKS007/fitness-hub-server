export interface DateFilter {
  [field: string]: { $gte?: Date; $lte?: Date };
}
export interface ApplyInFilter {
  [key: string]: { $in?: string[] };
}
export interface Search {
  $or?: { [key: string]: { $regex: string; $options: string } }[];
}
export interface LookupStage {
  $lookup: {
    from: string;
    localField: string;
    foreignField: string;
    as: string;
  };
}

export interface UnwindStage {
  $unwind: {
    path: string;
    preserveNullAndEmptyArrays: boolean;
  };
}

export type Lookup = [LookupStage, UnwindStage];
