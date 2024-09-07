import { User } from "../../entities/user";

export interface IUserRespository {
  create(userRequest: User): Promise<any>;
  findById(id: string): Promise<User | null>;
  update(
    userId: string,
    updateUser: {
      name?: string;
      companyId?: string;
      role?: string;
    }
  ): Promise<any>;
}
