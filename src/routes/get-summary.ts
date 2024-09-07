import { FastifyInstance } from "fastify";
import { SummaryRepository } from "../repositories/summary-repository";
import { GetSummaryController } from "../controllers/get-summary-controller";
import { authenticate } from "../middleware";

export async function getSummary(app: FastifyInstance) {
  const summaryRepository = new SummaryRepository();
  const getSummaryController = new GetSummaryController(summaryRepository);

  app.get("/summary", { preHandler: [authenticate] }, (request, reply) =>
    getSummaryController.execute(request, reply)
  );
}
