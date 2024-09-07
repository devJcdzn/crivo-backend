import { FastifyRequest, FastifyReply } from "fastify";
import { CreateCompanyUseCase } from "../use-cases/create-company-use-case";
import { createCompanySchema } from "../lib/schemas/create-company";

export class CreateCompanyController {
  constructor(private createCompanyUseCase: CreateCompanyUseCase) {}

  async execute(request: FastifyRequest, reply: FastifyReply) {
    const { name, members } = createCompanySchema.parse(request.body);
    const userId = request.user?.id;

    if (!userId) {
      return reply.code(401).send({
        message: "Não autorizado",
      });
    }

    if (!name) {
      return reply.code(400).send({
        message: "Campos não preenchidos",
      });
    }

    try {
      const user = await this.createCompanyUseCase.execute({
        name,
        userId,
        members,
      });

      return reply.code(201).send({
        message: "Conta criada com sucesso",
        data: user.id,
      });
    } catch (err) {
      console.log(err);
      return reply.code(500).send({
        message: "Erro ao criar conta",
        data: (err as Error).message,
      });
    }
  }
}
