import { Transaction } from "../entities/transactions";
import { TransactionRepository } from "../repositories/transaction-repository";

export class AutoUpdateTransactionUseCase {
  constructor(private transactionRepository: TransactionRepository) {}

  async execute({ id, userId }: { id: string; userId: string }) {
    const transaction = await this.transactionRepository.getUnique(id, userId);
    const currentAmount =
      transaction.currentAmount + transaction.installmentsAmount;

    if (transaction.installmentsCount === 0) {
      throw new Error("Transação já quitada.");
    }

    const transacitonToBeUpdated: Transaction = {
      ...transaction,
      currentAmount,
      installmentsCount:
        transaction.installmentsCount > 1
          ? transaction.installmentsCount - 1
          : 0,
      installmentsAmount:
        currentAmount === transaction.totalAmount
          ? 0
          : transaction.installmentsAmount,
    };

    const transactionUpdated = await this.transactionRepository.autoDebit(
      id,
      transacitonToBeUpdated,
      userId
    );

    return transactionUpdated;
  }
}
