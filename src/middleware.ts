import { FastifyRequest, FastifyReply } from "fastify";

import { prisma } from "./lib/prisma";
import { AuthRepository } from "./repositories/auth-repository";

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return reply.code(401).send({
      error: "Missing or Invalid token.",
      message: null,
      data: null,
    });
  }

  const authServices = new AuthRepository();

  const token = authHeader.split(" ")[1];
  const decoded = authServices.verifyToken(token) as { userId: string };

  const userExists = await prisma.user.findUnique({
    where: {
      id: decoded.userId,
    },
  });

  if (!userExists) {
    return reply.code(404).send({
      error: "User not found",
      message: null,
      data: null,
    });
  }

  request.user = userExists;
}
