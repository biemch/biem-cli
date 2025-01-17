import { z } from 'zod';

export const EnvSchema = z.object({
	URL: z.string(),
	EMAIL: z.string(),
	PASSWORD: z.string(),
});

export type Env = z.infer<typeof EnvSchema>;
