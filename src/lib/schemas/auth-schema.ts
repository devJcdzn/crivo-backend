import { z } from "zod";

export const authSchema = z.object({
  credential: z.string().min(10),
});

export type authType = z.infer<typeof authSchema>;
