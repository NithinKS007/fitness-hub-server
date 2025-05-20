export interface CreateTrainerDTO {
  fname: string;
  lname: string;
  email: string;
  password: string;
  dateOfBirth: string;
  phone: string;
  specializations: string[];
  certificate: string;
  yearsOfExperience: string;
}

export interface UpdateTrainerDetailsDTO {
  trainerId: string;
  fname: string;
  lname: string;
  phone: string;
  profilePic: string;
  dateOfBirth: string;
  aboutMe: string;
  gender: "male" | "female";
  age: string;
  height: string;
  weight: string;
  userId: string;
  yearsOfExperience: string;
  certifications: { url: string; fileName: string }[];
  specializations: string[];
}

export interface TrainerDTO {
  trainerId: string;
  yearsOfExperience: string;
  specializations: string[];
  certifications: { fileName: string; url: string }[];
  aboutMe?: string;
}

export interface CreateTrainerCollectionDTO {
  yearsOfExperience: string;
}

export interface SpecializationsDTO {
  _id: string;
  specializations: string[];
}

export interface TrainerVerificationDTO {
  trainerId: string;
  action: "approved" | "rejected";
}

export interface CertificationsDTO {
  _id: string;
  certifications: { url: string; fileName: string }[];
}
