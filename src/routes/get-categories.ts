import { FastifyInstance } from "fastify";
import { CategoryRepository } from "../repositories/category-repository";
import { GetCategoriesUseCase } from "../use-cases/get-categories-use-case";
import { GetCategoriesController } from "../controllers/get-categories-controller";
import { authenticate } from "../middleware";

export async function getCategories(app: FastifyInstance) {
  const categoryRepository = new CategoryRepository();
  const categoriesUseCase = new GetCategoriesUseCase(categoryRepository);
  const getCategoriesController = new GetCategoriesController(
    categoriesUseCase
  );

  app.get("/category", { preHandler: [authenticate] }, (request, reply) =>
    getCategoriesController.execute(request, reply)
  );
}
