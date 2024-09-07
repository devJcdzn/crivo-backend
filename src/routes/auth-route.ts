import { FastifyInstance } from "fastify";
import { AuthControler } from "../controllers/auth-controller";
import { AuthRepository } from "../repositories/auth-repository";

export async function authRoute(app: FastifyInstance) {
  const authRepository = new AuthRepository();
  const authController = new AuthControler(authRepository);

  app.post("/auth", (request, reply) => authController.execute(request, reply));
}
