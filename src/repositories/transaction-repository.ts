import { Transaction } from "../entities/transactions";
import { prisma } from "../lib/prisma";
import { UpdateTransactionType } from "../lib/schemas/update-transaction";
import { ITransactionRepository } from "./protocols/transaction-repository";

export class TransactionRepository implements ITransactionRepository {
  async create(transactionRequest: Transaction): Promise<any> {
    const transaction = await prisma.transactions.create({
      data: transactionRequest,
    });

    return transaction;
  }

  async get(userId: string): Promise<Transaction[]> {
    return prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          company_id: true,
        },
      });

      if (!user?.company_id) throw new Error("Não autorizado");

      const transactions = await tx.transactions.findMany({
        where: {
          company_id: user.company_id,
        },
        include: {
          category: {
            select: {
              name: true,
            },
          },
        },
      });

      return transactions;
    });
  }

  async getUnique(id: string, userId: string): Promise<Transaction> {
    return prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!user) throw new Error("User not found.");

      const transaction = await tx.transactions.findUnique({
        where: {
          id,
        },
      });

      if (!transaction) throw new Error("Transaction not found");

      return transaction;
    });
  }

  async autoDebit(
    id: string,
    transaction: Transaction,
    userId: string
  ): Promise<Transaction | Error> {
    return prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          company_id: true,
        },
      });

      if (!user || !user.company_id) throw new Error("User not found");

      const updatedTransaction = await tx.transactions.update({
        where: {
          id,
        },
        data: transaction,
      });

      return updatedTransaction;
    });
  }

  async update(
    id: string,
    transaction: Transaction,
    userId: string
  ): Promise<Transaction | Error> {
    return prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          company_id: true,
        },
      });

      if (!user || !user.company_id) throw new Error("User not found.");

      const updatdeTransaction = await tx.transactions.update({
        where: {
          id,
        },
        data: transaction,
      });

      return updatdeTransaction;
    });
  }

  async delete(id: string, userId: string): Promise<Transaction | Error> {
    return prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!user || !user.company_id) throw new Error("User not found.");

      const transactionToBeDeleted = await tx.transactions.delete({
        where: {
          id,
        },
      });

      return transactionToBeDeleted;
    });
  }
}
