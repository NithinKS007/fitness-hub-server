export interface Trainer {
  id: string;
  userId: string;
  yearsOfExperience: string;
  specializations: string[];
  certifications: { fileName: string; url: string }[];
  isApproved: boolean;
  aboutMe?: string;
  createdAt: Date;
  updatedAt: Date;
}
