import { TransactionRepository } from "../repositories/transaction-repository";

export class GetTransactionUseCase {
  constructor(private transactionRepository: TransactionRepository) {}

  async execute(id: string, userId: string) {
    const transactions = await this.transactionRepository.getUnique(id, userId);

    return transactions;
  }
}
