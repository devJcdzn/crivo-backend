import { FastifyInstance } from "fastify";
import { authenticate } from "../middleware";
import { GetUserController } from "../controllers/get-user-controller";
import { UserRepository } from "../repositories/user-repository";

export async function getUsers(app: FastifyInstance) {
  const userRepository = new UserRepository();
  const getUserController = new GetUserController(userRepository);
  app.get("/users/:id", { preHandler: [authenticate] }, (request, reply) =>
    getUserController.execute(request, reply)
  );
}
