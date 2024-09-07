import { FastifyInstance } from "fastify";
import { TransactionRepository } from "../repositories/transaction-repository";
import { AutoUpdateTransactionUseCase } from "../use-cases/auto-update-transaction-use-case";
import { AutoUpdateTransactionController } from "../controllers/auto-update-transaction-controller";
import { authenticate } from "../middleware";
import { UpdateTransactionUseCase } from "../use-cases/update-transaction-use-case";
import { UpdateTransactionController } from "../controllers/update-transaction-controller";

export async function updateTransaction(app: FastifyInstance) {
  const transactionRepository = new TransactionRepository();

  const autoUpdateTransactionUseCase = new AutoUpdateTransactionUseCase(
    transactionRepository
  );
  const autoUpdateTransactionController = new AutoUpdateTransactionController(
    autoUpdateTransactionUseCase
  );

  const updateTransactionUseCase = new UpdateTransactionUseCase(
    transactionRepository
  );
  const updateTransactionController = new UpdateTransactionController(
    updateTransactionUseCase
  );

  app.put(
    "/transactions/auto-update/:id",
    { preHandler: [authenticate] },
    (request, reply) => autoUpdateTransactionController.execute(request, reply)
  );

  app.put(
    "/transactions/:id",
    { preHandler: [authenticate] },
    (request, reply) => updateTransactionController.execute(request, reply)
  );
}
