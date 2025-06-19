import { ChangePasswordDTO } from "@application/dtos/auth-dtos";
import {
  ApplicationStatus,
  AuthStatus,
  PasswordStatus,
} from "@shared/constants/index.constants";
import { IUserRepository } from "@domain/interfaces/IUserRepository";
import { validationError } from "@presentation/middlewares/error.middleware";
import { IEncryptionService } from "@application/interfaces/security/IEncryption.service";
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "di/types-repositories";
import { TYPES_SERVICES } from "di/types-services";

@injectable()
export class ChangePasswordUseCase {
  constructor(
    @inject(TYPES_REPOSITORIES.UserRepository)
    private userRepository: IUserRepository,
    @inject(TYPES_SERVICES.EncryptionService)
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
