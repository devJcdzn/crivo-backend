import { TransactionRepository } from "../repositories/transaction-repository";

export class GetTransactionsUseCase {
  constructor(private transactionRepository: TransactionRepository) {}

  async execute(userId: string) {
    const transactions = await this.transactionRepository.get(userId);

    return transactions;
  }
}
