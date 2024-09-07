import { z } from "zod";

export const createCompanySchema = z.object({
  name: z.string(),
  members: z.array(z.string()).optional(),
});

export type CreateComanyType = z.infer<typeof createCompanySchema>;
