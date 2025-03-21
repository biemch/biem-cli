import { z } from 'zod';

export const TemplateSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string(),
	version: z.string(),
	author: z.string(),
	license: z.string(),
	markup: z.string(),
	duration: z.string(),
	fieldList: z.array(
		z.object({
			name: z.string(),
			label: z.string(),
			type: z.string(),
			placeholder: z.string().nullable().optional(),
			mutiple: z.boolean().nullable().optional(),
		}),
	),
	coverId: z.string().optional(),
	workspaceId: z.string().optional(),
	organizationId: z.string().optional(),
	contentTypeId: z.string().optional(),
	createdById: z.string(),
	publishedAt: z.string().optional(),
	createdAt: z.string(),
	updatedAt: z.string(),
	deletedAt: z.string().optional(),
});

export type Template = z.infer<typeof TemplateSchema>;
