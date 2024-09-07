import { Transaction } from "../entities/transactions";
import { UpdateTransactionType } from "../lib/schemas/update-transaction";
import { TransactionRepository } from "../repositories/transaction-repository";

export class UpdateTransactionUseCase {
  constructor(private transactionRepository: TransactionRepository) {}

  async execute(
    id: string,
    updateTransaction: UpdateTransactionType,
    userId: string
  ) {
    const transaction = await this.transactionRepository.getUnique(id, userId);

    if (!transaction) throw new Error("Transaction not founded");

    const {
      customer,
      title,
      entry,
      totalAmount,
      installmentsCount,
      category_id,
      notes,
    } = updateTransaction;

    const installmentsAmount =
      installmentsCount && installmentsCount > 1 && totalAmount
        ? (totalAmount - (entry || 0)) / (installmentsCount - 1)
        : 0;

    const transactionToBeUpdated = new Transaction(
      transaction.id,
      customer || transaction.customer,
      title || transaction.title,
      entry || transaction.currentAmount,
      totalAmount || transaction.totalAmount,
      installmentsAmount || transaction.installmentsAmount,
      (installmentsCount && installmentsCount >= 1
        ? installmentsCount - 1
        : 0) || transaction.installmentsCount,
      transaction.owner_id,
      transaction.company_id,
      category_id || transaction.category_id,
      transaction.created_at,
      notes || transaction.notes
    );

    // Atualizar a transação no repositório
    const updatedTransaction = await this.transactionRepository.update(
      id,
      transactionToBeUpdated,
      userId
    );

    return updatedTransaction;
  }
}
