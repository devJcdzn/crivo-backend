import { Category } from "../entities/category";
import { CategoryRepository } from "../repositories/category-repository";

import { v4 as uuidv4 } from "uuid";

export class CreateCategoryUseCase {
  constructor(private categoryRepository: CategoryRepository) {}

  async execute({ name, company_id }: { name: string; company_id: string }) {
    const category = new Category(uuidv4(), name, company_id);

    const newCategory = await this.categoryRepository.create(category);

    return newCategory;
  }
}
