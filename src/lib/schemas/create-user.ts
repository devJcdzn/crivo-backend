import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string(),
  credential: z.string(),
  role: z.enum(["USER", "ADMIN", "OWNER"]).optional(),
  company_id: z.string().uuid().optional(),
});

export type CreateUserType = z.infer<typeof createUserSchema>;
