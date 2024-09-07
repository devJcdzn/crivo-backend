import { CategoryRepository } from "../repositories/category-repository";

export class GetCategoriesUseCase {
  constructor(private categoryRepository: CategoryRepository) {}

  async execute(userId: string) {
    const categories = await this.categoryRepository.get(userId);

    return categories;
  }
}
