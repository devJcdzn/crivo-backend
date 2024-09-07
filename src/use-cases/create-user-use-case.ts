import { User } from "../entities/user";
import { v4 as uuidv4 } from "uuid";
import { UserRepository } from "../repositories/user-repository";

interface CreateUserRequest {
  name: string;
  credential: string;
}

export class CreateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({ name, credential }: CreateUserRequest) {
    try {
      const user = new User(uuidv4(), name, credential, null);

      await this.userRepository.create(user);

      return user;
    } catch (err) {
      console.log(err);
      throw new Error((err as Error).message);
    }
  }
}
