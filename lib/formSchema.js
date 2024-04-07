import { z } from "zod";

export const projectSchema = z.object({
  name: z.string().min(2).max(50),
  github: z.string(),
  description: z.string(),
});
