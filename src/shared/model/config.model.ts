import { z } from 'zod';

export const ConfigSchema = z.object({
	name: z.string(),
	description: z.string(),
	version: z.string(),
	cover: z.string(),
	template: z.object({
		fieldList: z.array(
			z.object({
				name: z.string(),
				label: z.string(),
				type: z.string(),
				placeholder: z.string().nullable().optional(),
				mutiple: z.boolean().nullable().optional(),
			}),
		),
		defaults: z.record(
			z.union([z.string(), z.number(), z.boolean()]),
		),
	}),
});

export type Config = z.infer<typeof ConfigSchema>;
