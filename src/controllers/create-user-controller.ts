import { FastifyRequest, FastifyReply } from "fastify";
import { createUserSchema } from "../lib/schemas/create-user";
import { CreateUserUseCase } from "../use-cases/create-user-use-case";

export class CreateUserController {
  constructor(private createUserUseCase: CreateUserUseCase) {}

  async execute(request: FastifyRequest, reply: FastifyReply) {
    const { name, credential } = createUserSchema.parse(request.body);

    if (!name || !credential) {
      return reply.code(400).send({
        message: "Campos não preenchidos",
      });
    }

    try {
      const user = await this.createUserUseCase.execute({ name, credential });

      return reply.code(201).send({
        message: "Usuário criado com sucesso",
        data: user.id,
      });
    } catch (err) {
      console.log(err);
      return reply.code(500).send({
        message: "Erro ap criar usuário",
        data: (err as Error).message,
      });
    }
  }
}
