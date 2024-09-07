import { Transaction } from "../../entities/transactions";
import { UpdateTransactionType } from "../../lib/schemas/update-transaction";

export interface ITransactionRepository {
  create(transactionRequest: Transaction): Promise<any>;
  get(userId: string): Promise<Transaction[]>;
  getUnique(id: string, userId: string): Promise<Transaction | Error>;
  autoDebit(
    id: string,
    transaction: Transaction,
    userId: string
  ): Promise<Transaction | Error>;
  update(
    id: string,
    transaction: Transaction,
    userId: string
  ): Promise<Transaction | Error>;
  delete(id: string, userId: string): Promise<Transaction | Error>;
}
