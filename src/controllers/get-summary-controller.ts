import { FastifyRequest, FastifyReply } from "fastify";
import { SummaryRepository } from "../repositories/summary-repository";

export class GetSummaryController {
  constructor(private summaryRepository: SummaryRepository) {}

  async execute(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.user?.id;

    if (!userId) {
      return reply.code(401).send({
        message: "Não autorizado!",
      });
    }

    const summary = await this.summaryRepository.getSumary(userId);

    return summary;
  }
}
