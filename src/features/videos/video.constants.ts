export const videoVisibility = {
	PUBLIC: "PUBLIC",
	UNLISTED: "UNLISTED",
	PRIVATE: "PRIVATE",
} as const;

export type VideoVisibility =
	(typeof videoVisibility)[keyof typeof videoVisibility];

export const videoVisibilityOptions: VideoVisibility[] = Object.values(
	videoVisibility,
) as VideoVisibility[];
