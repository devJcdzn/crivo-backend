import { FastifyReply, FastifyRequest } from "fastify";
import { GetCategoriesUseCase } from "../use-cases/get-categories-use-case";

export class GetCategoriesController {
  constructor(private getCategoriesUseCase: GetCategoriesUseCase) {}

  async execute(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.user?.id;

    if (!userId) {
      return reply.code(401).send({
        error: "Não autorizado",
        data: null,
      });
    }

    const categories = await this.getCategoriesUseCase.execute(userId);

    return reply.code(200).send({
      data: categories,
    });
  }
}
