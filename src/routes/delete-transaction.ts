import { FastifyInstance } from "fastify";
import { TransactionRepository } from "../repositories/transaction-repository";
import { DeleteTransactionUseCase } from "../use-cases/delete-transaction-use-case";
import { DeleteTransactionController } from "../controllers/delete-transaction-controller";
import { authenticate } from "../middleware";

export async function deleteTransaction(app: FastifyInstance) {
  const transactionRepository = new TransactionRepository();
  const deleteTransactionUseCase = new DeleteTransactionUseCase(
    transactionRepository
  );
  const deleteTransactionController = new DeleteTransactionController(
    deleteTransactionUseCase
  );

  app.delete(
    "/transactions/:id",
    { preHandler: [authenticate] },
    (request, reply) => deleteTransactionController.execute(request, reply)
  );
}
