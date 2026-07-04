import { z } from 'zod';

export const ProductSchema = z.object({
	id: z.string().uuid().optional(),
	name: z.string().min(2, 'Furniture name must be at least 2 characters'),
	description: z.string().min(10, 'Description must be at least 10 characters'),
	material: z.string().min(2, 'Material name is required (e.g. Oak, Bouclé, Marble)'),
	price: z.number().positive('Price must be a positive number representing luxury items'),
	colorPalette: z.array(z.string()).min(1, 'At least one luxury color accent must be provided'),
	materialOrigin: z.string().optional(),
	craftingTime: z.string().optional(),
	seamDetail: z.string().optional()
});

export type Product = z.infer<typeof ProductSchema>;
