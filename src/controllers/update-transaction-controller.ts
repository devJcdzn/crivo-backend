import { FastifyRequest, FastifyReply } from "fastify";
import { UpdateTransactionUseCase } from "../use-cases/update-transaction-use-case";
import {
  updateTransactionParamsSchema,
  updateTransactionSchema,
} from "../lib/schemas/update-transaction";
import { isEmptyObject } from "../lib/utils";

export class UpdateTransactionController {
  constructor(private UpdateTransactionUseCase: UpdateTransactionUseCase) {}

  async execute(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.user?.id;
    const { id } = updateTransactionParamsSchema.parse(request.params);
    const updateTransaction = updateTransactionSchema.parse(request.body);

    if (!userId)
      return reply.code(401).send({
        message: "Unauthorized",
        data: null,
      });

    if (isEmptyObject(updateTransaction)) {
      return reply.code(400).send({
        message: "No fields to update",
        data: null,
      });
    }

    const transaction = await this.UpdateTransactionUseCase.execute(
      id,
      updateTransaction,
      userId
    );

    return reply.code(200).send({
      message: "Transação atualizada com sucesso",
      transaction,
    });
  }
}
