import { FastifyReply, FastifyRequest } from "fastify";
import { UserRepository } from "../repositories/user-repository";
import { getUserSchema } from "../lib/schemas/get-user-schema";

export class GetUserController {
  constructor(private userRepository: UserRepository) {}

  async execute(request: FastifyRequest, reply: FastifyReply) {
    const { id } = getUserSchema.parse(request.params);
    const userId = request.user?.id;

    if (!userId) {
      return reply.code(401).send({
        error: "Não autorizado",
        data: null,
      });
    }
    // if (!id) {
    //   return reply.code(400).send({
    //     error: "Missing Id",
    //     data: null,
    //   });
    // }

    const user = await this.userRepository.findById(id || userId);

    return reply.code(200).send({
      user,
    });
  }
}
