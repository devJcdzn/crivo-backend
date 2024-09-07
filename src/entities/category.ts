import { Company } from "./company";
import { Transaction } from "./transactions";

export class Category {
  constructor(
    public id: string,
    public name: string,
    public company_id: string,
    public company?: Company,
    public transactions?: Transaction[]
  ) {}
}
