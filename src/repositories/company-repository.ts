import { Company } from "../entities/company";
import { prisma } from "../lib/prisma";
import { ICompanyRepository } from "./protocols/company-repository";

export class CompanyRepository implements ICompanyRepository {
  async create(
    companyRequest: Company,
    userId: string,
    members?: string[]
  ): Promise<any> {
    return await prisma.$transaction(async (tx) => {
      const company = await tx.company.create({
        data: companyRequest,
      });

      await tx.user.update({
        where: {
          id: userId,
        },
        data: {
          company_id: company.id,
          role: "OWNER",
        },
      });

      if (members && members.length > 0) {
        // await this.addMembers(members, company.id);
        const usersToBeCreated = members.map((member, index) => ({
          name: `Membro-${index + 1}`,
          credential: member,
          company_id: company.id,
          role: "USER",
        }));

        const users = await tx.user.createMany({
          data: usersToBeCreated,
        });
      }

      return company;
    });
  }
}
