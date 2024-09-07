import { TransactionRepository } from "../repositories/transaction-repository";

export class DeleteTransactionUseCase {
  constructor(private transactionRepository: TransactionRepository) {}

  async execute({ id, userId }: { id: string; userId: string }) {
    const transactionToBeDeleted = await this.transactionRepository.delete(
      id,
      userId
    );

    return transactionToBeDeleted;
  }
}
