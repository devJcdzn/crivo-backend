import { prisma } from "../lib/prisma";
import jwt from "jsonwebtoken";

export class AuthRepository {
  private SECRET: string = process.env.SECRET!;

  async login(credential: string) {
    const user = await prisma.user.findUnique({
      where: {
        credential,
      },
    });

    if (!user) {
      throw new Error("Credencial inválida");
    }

    const token = jwt.sign(
      { userId: user.id, companyId: user.company_id },
      this.SECRET
    );

    return { user, token };
  }

  verifyToken(token: string) {
    try {
      return jwt.verify(token, this.SECRET);
    } catch (err) {
      throw new Error("Invalid token");
    }
  }
}
