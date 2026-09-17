import { ITrainer } from "@infrastructure/databases/models/trainer.model";
import { BaseMapper } from "./BaseMapper";
import { IUser } from "@infrastructure/databases/models/user.model";
import { Trainer } from "@domain/entities/trainer.entity";
import { User } from "@domain/entities/user.entity";

export class TrainerMapper extends BaseMapper<
  IUser & { trainerDetails: ITrainer },
  Omit<User, "password" | "createdAt" | "updatedAt"> & {
    trainerDetails: Omit<Trainer, "createdAt" | "updatedAt">;
  }
> {
  mapToDomain(
    data: IUser & { trainerDetails: ITrainer }
  ): Omit<User, "password" | "createdAt" | "updatedAt"> & {
    trainerDetails: Omit<Trainer, "createdAt" | "updatedAt">;
  } {
    return {
      id: this.mapToString(data._id),
      fname: data.fname,
      lname: data.lname,
      email: data.email,
      isBlocked: data.isBlocked,
      role: data.role,
      otpVerified: data.otpVerified,
      googleVerified: data.googleVerified,
      phone: data.phone,
      dateOfBirth: data.dateOfBirth,
      profilePic: data.profilePic,
      age: data.age,
      height: data.height,
      weight: data.weight,
      gender: data.gender,
      bloodGroup: data.bloodGroup,
      medicalConditions: data.medicalConditions,
      otherConcerns: data.otherConcerns,
      trainerDetails: {
        id: this.mapToString(data.trainerDetails._id),
        userId: this.mapToString(data.trainerDetails.userId),
        yearsOfExperience: data.trainerDetails.yearsOfExperience,
        specializations: data.trainerDetails.specializations,
        certifications: data.trainerDetails.certifications,
        isApproved: data.trainerDetails.isApproved,
        aboutMe: data.trainerDetails.aboutMe,
      },
    };
  }
  map(
    data: IUser & { trainerDetails: ITrainer }
  ): Omit<User, "password" | "createdAt" | "updatedAt"> & {
    trainerDetails: Omit<Trainer, "createdAt" | "updatedAt">;
  } {
    return this.toDomain(data, this.mapToDomain.bind(this));
  }
}
