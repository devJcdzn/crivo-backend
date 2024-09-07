import { Category } from "../../entities/category";

export interface ICategoryRepository {
  create(category: Category): Promise<Category | Error>;
  get(userId: string): Promise<Category[] | Error>;
}
