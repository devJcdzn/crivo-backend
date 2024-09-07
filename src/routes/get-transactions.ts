import { FastifyInstance } from "fastify";
import { authenticate } from "../middleware";
import { TransactionRepository } from "../repositories/transaction-repository";
import { GetTransactionsController } from "../controllers/get-transactions-controller";
import { GetTransactionsUseCase } from "../use-cases/get-transactions-use-case";
import { GetTransactionUseCase } from "../use-cases/get-transaction-use-case";
import { GetTransactionController } from "../controllers/get-transaction-controller";

export async function getTransactions(app: FastifyInstance) {
  const transactionRepository = new TransactionRepository();
  const transactionsUseCase = new GetTransactionsUseCase(transactionRepository);
  const getTransactionsController = new GetTransactionsController(
    transactionsUseCase
  );

  const transactionUseCase = new GetTransactionUseCase(transactionRepository);
  const getTransactionController = new GetTransactionController(
    transactionUseCase
  );

  app.get("/transactions", { preHandler: [authenticate] }, (request, reply) =>
    getTransactionsController.execute(request, reply)
  );

  app.get(
    "/transactions/:id",
    { preHandler: [authenticate] },
    (request, reply) => getTransactionController.execute(request, reply)
  );
}
