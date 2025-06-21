import { PasswordResetDTO } from "@application/dtos/auth-dtos";
import { AuthStatus, PasswordStatus } from "@shared/constants/index.constants";
import { IUserRepository } from "@domain/interfaces/IUserRepository";
import { IPasswordResetRepository } from "@domain/interfaces/IPasswordResetTokenRepository";
import { validationError } from "@presentation/middlewares/error.middleware";
import { IEncryptionService } from "@application/interfaces/security/IEncryption.service";
import { IHashService } from "@application/interfaces/security/IHash.service";
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "@di/types-repositories";
import { TYPES_SERVICES } from "@di/types-services";

@injectable()
export class ForgotPasswordUseCase {
  constructor(
    @inject(TYPES_REPOSITORIES.UserRepository)
    private userRepository: IUserRepository,
    @inject(TYPES_REPOSITORIES.PasswordResetRepository)
    private passwordResetRepository: IPasswordResetRepository,
    @inject(TYPES_SERVICES.EncryptionService)
    private encryptionService: IEncryptionService,
    @inject(TYPES_SERVICES.HashService) private hashService: IHashService
  ) {}

  async execute({ resetToken, password }: PasswordResetDTO): Promise<void> {
    const token = await this.hashService.hash(resetToken);
    const tokenData = await this.passwordResetRepository.findOne({
      resetToken: token,
    });

    if (!tokenData) {
      throw new validationError(PasswordStatus.LinkExpired);
    }
    const { email } = tokenData;
    const userData = await this.userRepository.findOne({ email });
    if (!userData) {
      throw new validationError(AuthStatus.EmailNotFound);
    }
    if (password) {
      const hashedPassword = await this.encryptionService.hash(password);
      await this.userRepository.forgotPassword({
        email,
        password: hashedPassword,
      });
    }
  }
}
