import { Company } from "../entities/company";
import { CompanyRepository } from "../repositories/company-repository";
import { v4 as uuidv4 } from "uuid";

interface CreateCompanyRequest {
  name: string;
  userId: string;
  members?: string[];
}

export class CreateCompanyUseCase {
  constructor(private companyRepository: CompanyRepository) {}

  async execute({ name, userId, members }: CreateCompanyRequest) {
    const company = new Company(uuidv4(), name);

    await this.companyRepository.create(company, userId, members);

    return company;
  }
}
