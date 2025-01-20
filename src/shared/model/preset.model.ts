import { z } from 'zod';

export const PresetSchema = z.object({
	id: z.string().nonempty(),
	name: z.string().nonempty(),
	description: z.string().nonempty(),
});

export type Preset = z.infer<typeof PresetSchema>;
