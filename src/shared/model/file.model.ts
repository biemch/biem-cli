import { z } from 'zod';

export const FileSchema = z.object({
	id: z.string(),
	fileKey: z.string(),
	fileName: z.string(),
	extension: z.string().optional(),
	size: z.number(),
	hash: z.string(),
	mimeType: z.string().optional(),
	createdAt: z.string(),
	updatedAt: z.string(),
	deletedAt: z.string().optional(),
});

export type File = z.infer<typeof FileSchema>;
