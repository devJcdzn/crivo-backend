import { Company } from "../../entities/company";

export interface ICompanyRepository {
  create(
    CompanyRequest: Company,
    userId: string,
    members?: string[]
  ): Promise<any>;
}
