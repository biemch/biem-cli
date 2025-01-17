import { z } from 'zod';

export const WorkspaceSchema = z.object({
	id: z.string(),
	name: z.string(),
	organizationId: z.string(),
	createdById: z.string(),
	createdAt: z.string(),
	updatedAt: z.string(),
	deletedAt: z.string().optional(),
});

export type Workspace = z.infer<typeof WorkspaceSchema>;
