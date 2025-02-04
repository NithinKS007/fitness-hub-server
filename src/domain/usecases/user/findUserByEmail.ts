import { UserRepository } from "../../interfaces/userRepository";
import { User } from "../../entities/userEntity";
import { FindEmailDTO } from "../../../application/dtos";

export class FindUserByEmailUseCase{
    constructor(private userRepository:UserRepository){}
    public async execute(data:FindEmailDTO):Promise<User | null> {
        return await this.userRepository.findUserByEmail({email:data.email})
    }
}