import { z } from "zod";

export const deleteTransactionSchema = z.object({
  transactionId: z.string().uuid(),
});

export type DeleteTranscationSchema = z.infer<typeof deleteTransactionSchema>;
