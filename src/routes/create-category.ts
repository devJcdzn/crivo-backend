import { FastifyInstance } from "fastify";

import { authenticate } from "../middleware";
import { CategoryRepository } from "../repositories/category-repository";
import { CreateCategoryUseCase } from "../use-cases/create-category-use-case";
import { CreateCategoryController } from "../controllers/create-category-controller";

export async function createCategory(app: FastifyInstance) {
  const categoryRepository = new CategoryRepository();
  const createCategoryUseCase = new CreateCategoryUseCase(categoryRepository);
  const createCategoryController = new CreateCategoryController(
    createCategoryUseCase
  );

  app.post("/category", { preHandler: [authenticate] }, (request, reply) =>
    createCategoryController.execute(request, reply)
  );
}
