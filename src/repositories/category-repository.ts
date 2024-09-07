import { Category } from "../entities/category";
import { prisma } from "../lib/prisma";
import { ICategoryRepository } from "./protocols/category-repository";

export class CategoryRepository implements ICategoryRepository {
  async create(category: Category): Promise<Category | Error> {
    return prisma.$transaction(async (tx) => {
      if (!category.company_id)
        throw new Error("Category don't be created without company");

      const createdCategory = await tx.category.create({
        data: {
          name: category.name,
          company_id: category.company_id,
        },
      });

      return createdCategory;
    });
  }

  async get(userId: string): Promise<Category[] | Error> {
    return prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          company_id: true,
        },
      });

      if (!user || !user.company_id) throw new Error("User not found");

      const categories = await tx.category.findMany({
        where: {
          company_id: user.company_id,
        },
      });

      return categories;
    });
  }
}
