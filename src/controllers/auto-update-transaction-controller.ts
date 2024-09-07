import { FastifyRequest, FastifyReply } from "fastify";
import { AutoUpdateTransactionUseCase } from "../use-cases/auto-update-transaction-use-case";
import { autoUpdateSchema } from "../lib/schemas/auto-update-schema";

export class AutoUpdateTransactionController {
  constructor(
    private autoUpdateTransactionUseCase: AutoUpdateTransactionUseCase
  ) {}

  async execute(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.user?.id;
    const { id } = autoUpdateSchema.parse(request.params);

    if (!userId)
      return reply.code(401).send({
        message: "Unauthorized",
        data: null,
      });

    const transaction = await this.autoUpdateTransactionUseCase.execute({
      id,
      userId,
    });

    return reply.code(200).send({
      message: "Transação atualizada com sucesso",
      transaction,
    });
  }
}
