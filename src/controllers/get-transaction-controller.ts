import { FastifyReply, FastifyRequest } from "fastify";
import { GetTransactionUseCase } from "../use-cases/get-transaction-use-case";
import { getTransactionSchema } from "../lib/schemas/get-transactions";

export class GetTransactionController {
  constructor(private getTransactionUseCase: GetTransactionUseCase) {}

  async execute(request: FastifyRequest, reply: FastifyReply) {
    const { id } = getTransactionSchema.parse(request.params);
    const userId = request.user?.id;

    if (!userId) {
      return reply.code(401).send({
        error: "Não autorizado",
        data: null,
      });
    }

    const transactions = await this.getTransactionUseCase.execute(id, userId);

    return reply.code(200).send({
      data: transactions,
    });
  }
}
