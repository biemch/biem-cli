import { z } from 'zod';

export const EnvSchema = z.object({
	URL: z.string().url().nonempty(),
	EMAIL: z.string().email().nonempty(),
	PASSWORD: z.string().min(8).nonempty(),
});

export type Env = z.infer<typeof EnvSchema>;
