import z from "zod";

export const autoUpdateSchema = z.object({
  id: z.string(),
});

export type AutoUpdateType = z.infer<typeof autoUpdateSchema>;
