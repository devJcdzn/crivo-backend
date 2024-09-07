import { FastifyInstance } from "fastify";
import { CreateUserController } from "../controllers/create-user-controller";
import { UserRepository } from "../repositories/user-repository";
import { CreateUserUseCase } from "../use-cases/create-user-use-case";

export async function createUser(app: FastifyInstance) {
  const userRepository = new UserRepository();
  const createUserUseCase = new CreateUserUseCase(userRepository);
  const createUserController = new CreateUserController(createUserUseCase);

  app.post("/users", (request, reply) =>
    createUserController.execute(request, reply)
  );
}
