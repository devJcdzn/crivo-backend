import { Transaction } from "./transactions";
import { Category } from "./category";
import { User } from "@prisma/client";

export class Company {
  constructor(
    public id: string,
    public name: string,
    public members?: any,
    public transactions?: any,
    public category?: any,
    public created_at?: Date,
    public updated_at?: Date
  ) {}
}
