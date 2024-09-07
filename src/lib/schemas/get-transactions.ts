import z from "zod";

export const getTransactionSchema = z.object({
  id: z.string().uuid(),
});
