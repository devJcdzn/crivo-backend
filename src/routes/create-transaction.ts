import { FastifyInstance } from "fastify";
import { CreateTransactionController } from "../controllers/create-transaction-controller";
import { authenticate } from "../middleware";
import { TransactionRepository } from "../repositories/transaction-repository";
import { CreateTransactionUseCase } from "../use-cases/create-transaction-use-case";

export async function createTransactions(app: FastifyInstance) {
  const transactionRepository = new TransactionRepository();
  const createTransactionUseCase = new CreateTransactionUseCase(
    transactionRepository
  );
  const createTransactionController = new CreateTransactionController(
    createTransactionUseCase
  );

  app.post("/transactions", { preHandler: [authenticate] }, (request, reply) =>
    createTransactionController.execute(request, reply)
  );
}
