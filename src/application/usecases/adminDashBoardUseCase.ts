import { UserSubscriptionPlanRepository } from "../../domain/interfaces/userSubscriptionRepository";
import { AdminDashBoardStats } from "../../domain/entities/trainerEntity";
import { UserRepository } from "../../domain/interfaces/userRepository";
import { TrainerRepository } from "../../domain/interfaces/trainerRepository";

export class AdminDashBoardUseCase {
    constructor(
        private userSubscriptionPlanRepository: UserSubscriptionPlanRepository,
        private userRepository: UserRepository,
        private trainerRepository: TrainerRepository
    ) {}

    public async getAdminDashBoardData(): Promise<AdminDashBoardStats> {
        const [totalUsersCount, totalTrainersCount, pendingTrainerApprovalCount] = await Promise.all([
            this.getTotalUsersCount(),
            this.getTotalTrainersCount(),
            this.getPendingTrainerApprovalsCount()
        ]);

        return {
            pendingTrainerApprovalCount,
            totalTrainersCount,
            totalUsersCount
        };
    }

    private async getTotalUsersCount(): Promise<number> {
        return await this.userRepository.countDocs("user");
    }

    private async getTotalTrainersCount(): Promise<number> {
        return await this.userRepository.countDocs("trainer");
    }

    private async getPendingTrainerApprovalsCount(): Promise<number> {
        return await this.trainerRepository.countPendingTrainerApprovals();
    }
}
