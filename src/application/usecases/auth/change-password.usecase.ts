import { ChangePasswordDTO } from "@application/dtos/auth-dtos";
import {
  ApplicationStatus,
  AuthStatus,
  PasswordStatus,
} from "@shared/constants/index.constants";
import { IUserRepository } from "@domain/interfaces/IUserRepository";
import { validationError } from "@presentation/middlewares/error.middleware";
import { IEncryptionService } from "@application/interfaces/security/IEncryption.service";

export class ChangePasswordUseCase {
  constructor(
    private userRepository: IUserRepository,
    private encryptionService: IEncryptionService
  ) {}

  async execute({
    userId,
    newPassword,
    password,
  }: ChangePasswordDTO): Promise<void> {
    if (!userId || !newPassword || !password) {
      throw new validationError(ApplicationStatus.AllFieldsAreRequired);
    }
    const userData = await this.userRepository.findById(userId);
    if (!userData) {
      throw new validationError(AuthStatus.InvalidId);
    }
    const isValidPassword = await this.encryptionService.compare(
      password,
      userData.password
    );

    if (!isValidPassword) {
      throw new validationError(PasswordStatus.Incorrect);
    }
    const hashedPassword = await this.encryptionService.hash(newPassword);
    await this.userRepository.update(userId, {
      password: hashedPassword,
    });
  }
}
