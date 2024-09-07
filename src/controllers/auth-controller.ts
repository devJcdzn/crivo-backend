import { FastifyRequest, FastifyReply } from "fastify";
import { AuthRepository } from "../repositories/auth-repository";
import { authSchema } from "../lib/schemas/auth-schema";

export class AuthControler {
  constructor(private authRepository: AuthRepository) {}

  async execute(request: FastifyRequest, reply: FastifyReply) {
    const { credential } = authSchema.parse(request.body);

    try {
      const { token, user } = await this.authRepository.login(credential);

      return reply.code(200).send({
        user,
        token,
      });
    } catch (err) {
      console.log(err);
      return reply.code(500);
    }
  }
}
