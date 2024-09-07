import { FastifyReply, FastifyRequest } from "fastify";
import { DeleteTransactionUseCase } from "../use-cases/delete-transaction-use-case";
import { deleteTransactionSchema } from "../lib/schemas/delete-transaction";

export class DeleteTransactionController {
  constructor(private deleteTransactionUseCase: DeleteTransactionUseCase) {}

  async execute(request: FastifyRequest, reply: FastifyReply) {
    const { id } = deleteTransactionSchema.parse(request.params);
    const userId = request.user?.id;

    if (!id || !userId)
      return reply.code(401).send({
        message: "Não autorizado",
      });

    const transactionDeleted = await this.deleteTransactionUseCase.execute({
      id,
      userId,
    });

    return reply.code(200).send({
      message: "Transação deletada com sucesso.",
      data: transactionDeleted,
    });
  }
}
