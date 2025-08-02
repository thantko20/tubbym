export type Video = {
	id: string;
	title: string;
	description: string | null;
	url: string;
	thumbnailUrl: string | null;
	duration: number; // in seconds
	uploadDate: Date | null;
	views: number;
	likes: number;
	dislikes: number;
	uploaderId: string | null;
	uploaderName: string | null;
};
