export interface CreateUserDTO {
  fname: string;
  lname: string;
  email: string;
  password: string;
}

export interface CreateGoogleUserDTO {
  fname?: string;
  lname?: string;
  email?: string;
  profilePic?: string;
}

export interface UpdateUserDetailsDTO {
  _id: string;
  fname: string;
  lname: string;
  phone: string;
  profilePic: string;
  dateOfBirth: string;
  gender: "male" | "female";
  age: string;
  height: string;
  weight: string;
  bloodGroup?: string;
  medicalConditions?: string;
  otherConcerns?: string;
}
