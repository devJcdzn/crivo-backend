import { FastifyRequest, FastifyReply } from "fastify";
import { CreateTransactionUseCase } from "../use-cases/create-transaction-use-case";
import { createTransactionSchema } from "../lib/schemas/create-transaction";

export class CreateTransactionController {
  constructor(private createTransactionUseCase: CreateTransactionUseCase) {}

  async execute(request: FastifyRequest, reply: FastifyReply) {
    const {
      customer,
      entry,
      installmentsCount,
      title,
      totalAmount,
      category_id,
      created_at,
      notes,
    } = createTransactionSchema.parse(request.body);
    const userId = request.user?.id;
    const companyId = request.user?.company_id;

    if (!userId || !companyId) {
      return reply.code(401).send({
        message: "Não autorizado.",
      });
    }

    const transaction = await this.createTransactionUseCase.execute(
      {
        customer,
        title,
        entry,
        totalAmount,
        installmentsCount,
        category_id,
        created_at,
        notes,
      },
      userId,
      companyId
    );

    return reply.code(201).send({
      message: "Transação criada com sucesso",
      data: transaction,
    });
  }
}
