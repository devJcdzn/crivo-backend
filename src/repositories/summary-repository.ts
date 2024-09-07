import { prisma } from "../lib/prisma";
import { calculatePercentageChange, fillMissingDays } from "../lib/utils";
import { ISummaryRepository } from "./protocols/summary-repository";
import { subDays, parse, differenceInDays } from "date-fns";

export class SummaryRepository implements ISummaryRepository {
  async getSumary(
    userId: string,
    from?: string | undefined,
    to?: string | undefined
  ): Promise<any> {
    return prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
          name: true,
          company: {
            include: {
              members: {
                select: {
                  name: true,
                  role: true,
                  transactions: {
                    select: {
                      currentAmount: true,
                    },
                  },
                },
              },
            },
          },
          transactions: true,
        },
      });

      if (!user) {
        throw new Error("User not found or unauthorized.");
      }

      const topMembers = user?.company?.members
        .map((member) => {
          const totalTransactionValue = member.transactions.reduce(
            (acc, transaction) => acc + transaction.currentAmount,
            0
          );

          return {
            ...member,
            totalTransactionValue,
          };
        })
        .sort((a, b) => b.totalTransactionValue - a.totalTransactionValue)
        .slice(0, 3);

      const defaultTo = new Date();
      const defaultFrom = subDays(defaultTo, 30);

      const startDate = from
        ? parse(from, "yyyy-MM-dd", new Date())
        : defaultFrom;
      const endDate = to ? parse(to, "yyyy-MM-dd", new Date()) : defaultTo;

      const periodLenght = differenceInDays(endDate, startDate) + 1;
      const lastPeriodStart = subDays(startDate, periodLenght);
      const lastPeriodEnd = subDays(endDate, periodLenght);

      const currentPeriod = await this.fetchFinancialData(
        user.company?.id!,
        startDate,
        endDate
      );
      const lastPeriod = await this.fetchFinancialData(
        user.company?.id!,
        lastPeriodStart,
        lastPeriodEnd
      );

      const incomePercentage = calculatePercentageChange(
        currentPeriod.income,
        lastPeriod.income
      );
      const expensesPercentage = calculatePercentageChange(
        currentPeriod.expenses,
        lastPeriod.expenses
      );
      const remainingPercentage = calculatePercentageChange(
        currentPeriod.remaining,
        lastPeriod.remaining
      );
      const toReceivePercentage = calculatePercentageChange(
        currentPeriod.toReceive,
        lastPeriod.toReceive
      );

      const expensesCategories = await prisma.transactions.groupBy({
        by: ["category_id"],
        _sum: {
          totalAmount: true,
        },
        where: {
          company_id: user.company?.id,
          totalAmount: {
            lt: 0,
          },
          created_at: {
            gte: startDate,
            lte: endDate,
          },
        },
        orderBy: {
          _sum: {
            totalAmount: "desc",
          },
        },
      });

      const formattedCategory = await Promise.all(
        expensesCategories.map(async (item) => {
          if (!item.category_id) {
            return {
              name: "Sem Categoria",
              value: Math.abs(item._sum.totalAmount || 0),
            };
          }

          const category = await prisma.category.findUnique({
            where: { id: item.category_id },
            select: { name: true },
          });

          const categoryName = category?.name ?? "Unknown";
          const amount = Math.abs(item._sum.totalAmount || 0);

          return {
            name: categoryName,
            value: amount,
          };
        })
      );

      const topCategories = formattedCategory.slice(0, 3);
      const otherCategories = formattedCategory.slice(3);
      const otherSum = otherCategories.reduce(
        (sum, current) => sum + current.value,
        0
      );

      const finalCategories = topCategories;
      if (otherCategories.length > 0) {
        finalCategories.push({
          name: "Outros",
          value: otherSum,
        });
      }

      const incomeDays = await tx.transactions.groupBy({
        by: ["created_at"],
        _sum: {
          currentAmount: true,
        },
        where: {
          company_id: user.company?.id,
          currentAmount: {
            gt: 0,
          },
          created_at: {
            gte: startDate,
            lte: endDate,
          },
        },
        orderBy: {
          created_at: "asc",
        },
      });

      console.log("Income Days:", incomeDays);

      const expensesDays = await tx.transactions.groupBy({
        by: ["created_at"],
        _sum: {
          currentAmount: true,
        },
        where: {
          company_id: user.company?.id,
          currentAmount: {
            lt: 0,
          },
          created_at: {
            gte: startDate,
            lte: endDate,
          },
        },
        orderBy: {
          created_at: "asc",
        },
      });

      console.log("Expenses Days:", expensesDays);

      interface DayAggregation {
        date: Date;
        income: number;
        expenses: number;
      }

      const combinedDays: { [key: string]: DayAggregation } = {};

      incomeDays.forEach((item) => {
        const date = item.created_at.toISOString().split("T")[0];
        if (!combinedDays[date]) {
          combinedDays[date] = { date: new Date(date), income: 0, expenses: 0 };
        }
        combinedDays[date].income += item._sum.currentAmount || 0;
      });

      expensesDays.forEach((item) => {
        const date = item.created_at.toISOString().split("T")[0];
        if (!combinedDays[date]) {
          combinedDays[date] = { date: new Date(date), income: 0, expenses: 0 };
        }
        combinedDays[date].expenses += Math.abs(item._sum.currentAmount || 0);
      });

      const resultActiveDays = Object.values(combinedDays);

      console.log("Result Active Days:", resultActiveDays);

      // Função para preencher os dias faltantes
      const days = fillMissingDays(resultActiveDays, startDate, endDate);

      console.log("Days After Fill:", days);

      const totalBalance = await prisma.transactions.aggregate({
        _sum: {
          currentAmount: true,
        },
        where: {
          company_id: user.company?.id,
        },
      });

      return {
        remaingAmount: currentPeriod.remaining,
        remainingPercentage: remainingPercentage.toFixed(2),
        incomeAmount: currentPeriod.income,
        incomePercentage: incomePercentage.toFixed(2),
        expensesAmount: currentPeriod.expenses,
        expensesPercentage: expensesPercentage.toFixed(2),
        toReceive: currentPeriod.toReceive,
        toReceivePercentage: toReceivePercentage.toFixed(2),
        totalBalance: totalBalance._sum.currentAmount || 0,
        members: topMembers,
        categories: finalCategories,
        days,
      };
    });
  }

  private async fetchFinancialData(
    companyId: string,
    startDate: Date,
    endDate: Date
  ) {
    const income = await prisma.transactions.aggregate({
      _sum: {
        currentAmount: true,
      },
      where: {
        totalAmount: {
          gte: 0,
        },
        company_id: companyId,
        created_at: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const expenses = await prisma.transactions.aggregate({
      _sum: {
        totalAmount: true,
      },
      where: {
        totalAmount: {
          lt: 0,
        },
        company_id: companyId,
        created_at: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const remaining = await prisma.transactions.aggregate({
      _sum: {
        currentAmount: true,
      },
      where: {
        company_id: companyId,
        created_at: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const toReceive = await prisma.transactions.aggregate({
      _sum: {
        currentAmount: true,
        totalAmount: true,
      },
      where: {
        company_id: companyId,
        totalAmount: {
          gte: 0,
        },
        created_at: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    return {
      income: income._sum.currentAmount || 0,
      expenses: expenses._sum.totalAmount || 0,
      remaining: remaining._sum.currentAmount || 0,
      toReceive:
        (toReceive._sum.totalAmount || 0) -
          (toReceive._sum.currentAmount || 0) || 0,
    };
  }
}
