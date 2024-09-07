import { FastifyReply, FastifyRequest } from "fastify";
import { GetTransactionsUseCase } from "../use-cases/get-transactions-use-case";

export class GetTransactionsController {
  constructor(private getTransactionUseCase: GetTransactionsUseCase) {}

  async execute(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.user?.id;

    if (!userId) {
      return reply.code(401).send({
        error: "Não autorizado",
        data: null,
      });
    }

    const transactions = await this.getTransactionUseCase.execute(userId);

    return reply.code(200).send({
      data: transactions,
    });
  }
}
