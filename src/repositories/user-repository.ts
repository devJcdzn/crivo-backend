import { User } from "../entities/user";
import { prisma } from "../lib/prisma";
import { IUserRespository } from "./protocols/user-repository";

export class UserRepository implements IUserRespository {
  async create(userRequest: User): Promise<void> {
    try {
      await prisma.user.create({
        data: userRequest,
      });
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
      });

      return user;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }

  async update(
    userId: string,
    updateUser: {
      name?: string | undefined;
      companyId?: string | undefined;
      role?: string | undefined;
    }
  ): Promise<any> {
    try {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updateUser,
      });

      return updatedUser;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }
}
