import { z } from "zod";

export const createTransactionSchema = z.object({
  customer: z.string(),
  title: z.string(),
  notes: z.string().optional(),
  entry: z.coerce.number(),
  totalAmount: z.coerce.number(),
  installmentsCount: z.coerce.number(),
  category_id: z.string(),
  created_at: z.coerce.date().optional(),
});

export type CreateTransactionType = z.infer<typeof createTransactionSchema>;
