import { Category } from "./category";
import { Company } from "./company";
import { User } from "./user";

export class Transaction {
  constructor(
    public id: string,

    public customer: string,
    public title: string,

    public currentAmount: number,
    public totalAmount: number,

    public installmentsAmount: number,
    public installmentsCount: number,

    public owner_id: string,
    public company_id: string,
    public category_id: string,

    public created_at?: Date,
    public notes?: string | null,
    public updated_at?: Date,

    public owner?: any,
    public company?: any,
    public category?: any
  ) {}
}
