import {
  CertificationsDTO,
  changePasswordDTO,
  CreateGoogleUserDTO,
  CreateUserDTO,
  FindEmailDTO,
  IdDTO,
  Role,
  SpecializationsDTO,
  trainerVerification,
  updateBlockStatus,
  UpdatePassword,
  UpdateUserDetails,
} from "../../../application/dtos";
import { User } from "../../../domain/entities/userEntity";
import { UserRepository } from "../../../domain/interfaces/userRepository";
import userModel from "../models/userModel";

export class MongoUserRepository implements UserRepository {
  public async createUser(data: CreateUserDTO): Promise<User> {
    const userData = await userModel.create(data);
    return userData.toObject();
  }

  public async findUserByEmail(data: FindEmailDTO): Promise<User | null> {
    const { email } = data;
    return await userModel.findOne({ email });
  }
  public async updateUserVerificationStatus(
    data: FindEmailDTO
  ): Promise<User | null> {
    const { email } = data;
    return await userModel.findOneAndUpdate({ email }, { otpVerified: true });
  }
  public async forgotPassword(data: UpdatePassword): Promise<User | null> {
    const { email, password } = data;
    return await userModel.findOneAndUpdate({ email }, { password: password });
  }
  public async createGoogleUser(data: CreateGoogleUserDTO): Promise<User> {
    return await userModel.create(data);
  }
  public async getUsers(data: Role): Promise<User[]> {
    return await userModel.find({ role: data }).sort({ createdAt: -1 });
  }
  public async updateBlockStatus(
    data: updateBlockStatus
  ): Promise<User | null> {
    const { _id, isBlocked } = data;
    return await userModel.findByIdAndUpdate(
      _id,
      { isBlocked: isBlocked },
      { new: true }
    );
  }
  public async trainerVerification(
    data: trainerVerification
  ): Promise<User | null> {
    const { _id, action } = data;
    if (action === "approved") {
      return await userModel.findByIdAndUpdate(
        _id,
        { isApproved: true },
        { new: true }
      );
    }
    if (action === "rejected") {
      return await userModel.findByIdAndDelete(_id);
    }
    return null;
  }
  public async updateUserProfile(
    data: UpdateUserDetails
  ): Promise<User | null> {
    const {
      _id,
      fname,
      lname,
      phone,
      profilePic,
      dateOfBirth,
      yearsOfExperience,
      aboutMe,
      gender,
      age,
      height,
      weight,
      bloodGroup,
      medicalConditions,
      otherConcerns,
    } = data;

    return await userModel.findByIdAndUpdate(
      _id,
      {
        $set: {
          fname,
          lname,
          phone,
          profilePic,
          dateOfBirth,
          gender,
          age,
          height,
          weight,
          bloodGroup,
          medicalConditions,
          otherConcerns,
          yearsOfExperience,
          aboutMe,
        },
      },
      { new: true }
    );
  }
  public async updateCertifications(
    data: CertificationsDTO
  ): Promise<User | null> {
    const { _id, certifications } = data;
    return await userModel.findByIdAndUpdate(
      _id,
      { $push: { certifications: { $each: certifications } } },
      { new: true }
    );
  }
  public async updateSpecializations(
    data: SpecializationsDTO
  ): Promise<User | null> {
    const { _id, specifications } = data;
    return await userModel.findByIdAndUpdate(
      _id,
      { $push: { specializations: { $each: specifications } } },
      { new: true }
    );
  }
  public async findUserById(data: IdDTO): Promise<User | null> {
    return await userModel.findById(data);
  }
  public async changePassword(data: changePasswordDTO): Promise<User | null> {
    const { _id, newPassword } = data;
    return await userModel.findByIdAndUpdate(_id, { password: newPassword });
  }
}
