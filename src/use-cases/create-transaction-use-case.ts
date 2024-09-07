import { v4 as uuidv4 } from "uuid";
import { Transaction } from "../entities/transactions";
import { CreateTransactionType } from "../lib/schemas/create-transaction";
import { TransactionRepository } from "../repositories/transaction-repository";

export class CreateTransactionUseCase {
  constructor(private transactionRepository: TransactionRepository) {}

  async execute(
    {
      customer,
      title,
      entry,
      totalAmount,
      installmentsCount,
      category_id,
      created_at,
      notes,
    }: CreateTransactionType,
    userId: string,
    companyId: string
  ) {
    const installmentsAmount =
      installmentsCount > 1
        ? (totalAmount - entry) / (installmentsCount - 1)
        : 0;

    // const installmentsAmount =
    //   installmentsCount > 1 ? (totalAmount - entry) / installmentsCount : 0;

    if (entry < 0 && totalAmount < 0) {
      const transactionToBeCreated = new Transaction(
        uuidv4(),
        customer,
        title,
        totalAmount,
        totalAmount,
        installmentsAmount,
        0,
        userId,
        companyId,
        category_id,
        created_at,
        notes
      );

      const transaction = await this.transactionRepository.create(
        transactionToBeCreated
      );

      return transaction;
    }

    const transactionToBeCreated = new Transaction(
      uuidv4(),
      customer,
      title,
      entry,
      totalAmount,
      installmentsAmount,
      installmentsCount >= 1 ? installmentsCount - 1 : 0,
      userId,
      companyId,
      category_id,
      created_at,
      notes
    );

    const transaction = await this.transactionRepository.create(
      transactionToBeCreated
    );

    return transaction;
  }
}
