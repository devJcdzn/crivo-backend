import { FastifyInstance } from "fastify";
import { CreateCompanyController } from "../controllers/create-company-controller";
import { CompanyRepository } from "../repositories/company-repository";
import { CreateCompanyUseCase } from "../use-cases/create-company-use-case";

import { authenticate } from "../middleware";

export async function createCompany(app: FastifyInstance) {
  const companyRepository = new CompanyRepository();
  const createCompanyUseCase = new CreateCompanyUseCase(companyRepository);
  const createCompanyController = new CreateCompanyController(
    createCompanyUseCase
  );

  app.post("/companies", { preHandler: [authenticate] }, (request, reply) =>
    createCompanyController.execute(request, reply)
  );
}
