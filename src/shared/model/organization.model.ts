import { z } from 'zod';

export const OrganizationSchema = z.object({
	id: z.string(),
	name: z.string(),
	createdById: z.string(),
	createdAt: z.string(),
	updatedAt: z.string(),
	deletedAt: z.string().optional(),
});

export type Organization = z.infer<typeof OrganizationSchema>;
