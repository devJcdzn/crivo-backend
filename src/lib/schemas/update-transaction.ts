import z, { number } from "zod";

export const updateTransactionSchema = z.object({
  customer: z.string().optional(),
  title: z.string().optional(),
  entry: z.coerce.number().optional(),
  totalAmount: z.coerce.number().optional(),
  installmentsCount: z.coerce.number().optional(),
  category_id: z.string().optional(),
  notes: z.string().optional(),
});

export const updateTransactionParamsSchema = z.object({
  id: z.string(),
});

export type UpdateTransactionType = z.infer<typeof updateTransactionSchema>;
