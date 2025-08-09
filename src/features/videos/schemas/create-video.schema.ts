import { z } from "zod";
import { videoVisibilityOptions } from "../video.constants";

export const createVideoSchema = z.object({
	title: z.string().min(1, "Title is required"),
	description: z.string().optional(),
	visibility: z.enum(videoVisibilityOptions),
});

export type CreateVideoSchema = z.infer<typeof createVideoSchema>;
