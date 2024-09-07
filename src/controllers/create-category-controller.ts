import { FastifyReply, FastifyRequest } from "fastify";
import { CreateCategoryUseCase } from "../use-cases/create-category-use-case";
import { createCategorySchema } from "../lib/schemas/create-category-schema";

export class CreateCategoryController {
  constructor(private createCategoryUseCase: CreateCategoryUseCase) {}

  async execute(request: FastifyRequest, reply: FastifyReply) {
    const companyId = request.user?.company_id;
    const { name } = createCategorySchema.parse(request.body);

    if (!companyId) return reply.code(401).send("Unauthorized");

    const category = await this.createCategoryUseCase.execute({
      name,
      company_id: companyId,
    });

    return reply.code(201).send({
      message: "Categoria criada com sucesso",
      category,
    });
  }
}
