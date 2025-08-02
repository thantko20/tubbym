import { Prisma } from "generated/prisma/client";
// import { Prisma } from "generated/prisma";
import { prisma } from "@/lib/prisma";
import type { Video } from "./types";

// Dummy video data for development/testing
export const getDummyVideos = (): Video[] => [
	{
		id: "1",
		uploaderId: "user_1",
		uploaderName: "Alice",
		title: "Sample Video 1",
		description: "This is a sample video description.",
		url: "https://dummy.video/1.m3u8",
		thumbnailUrl: "https://dummy.image/1.jpg",
		duration: 120,
		uploadDate: new Date("2024-01-01T12:00:00Z"),
		dislikes: 2,
		likes: 10,
		views: 100,
	},
	{
		id: "2",
		uploaderId: "user_2",
		uploaderName: "Bob",
		title: "Sample Video 2",
		description: "Another example video.",
		url: "https://dummy.video/2.m3u8",
		thumbnailUrl: "https://dummy.image/2.jpg",
		duration: 300,
		uploadDate: new Date("2024-02-15T15:30:00Z"),
		dislikes: 0,
		likes: 25,
		views: 250,
	},
	{
		id: "3",
		uploaderId: "user_3",
		uploaderName: "Charlie",
		title: "Sample Video 3",
		description: "Yet another video for testing.",
		url: "https://dummy.video/3.m3u8",
		thumbnailUrl: "https://dummy.image/3.jpg",
		duration: 180,
		uploadDate: new Date("2024-03-10T09:45:00Z"),
		dislikes: 1,
		likes: 5,
		views: 60,
	},
];

const VIDEO_BASE_URL = "https://example.com/videos";

const videoSelect = Prisma.validator<Prisma.VideoSelect>()({
	id: true,
	title: true,
	description: true,
	thumbnailUrl: true,
	durationSeconds: true,
	uploadDate: true,
	uploaderId: true,
	uploadStatus: true,
	viewsCount: true,
	visibility: true,
	key: true,
});

export type DbVideo = Prisma.VideoGetPayload<{ select: typeof videoSelect }>;

export const getVideos = async (): Promise<Video[]> => {
	const videos = await prisma.video.findMany({
		select: videoSelect,
		where: {
			visibility: "PUBLIC",
			uploadStatus: "COMPLETED",
		},
		orderBy: {
			uploadDate: "desc",
		},
	});
	// return videos.map(enrichVideo);
	return getDummyVideos();
};

function enrichVideo(dbVideo: DbVideo): Video {
	return {
		id: dbVideo.id,
		uploaderId: dbVideo.uploaderId,
		uploaderName: "",
		title: dbVideo.title,
		description: dbVideo.description ?? "",
		url: `${VIDEO_BASE_URL}/${dbVideo.key}`,
		thumbnailUrl: dbVideo.thumbnailUrl ?? "",
		duration: dbVideo.durationSeconds,
		uploadDate: dbVideo.uploadDate,
		dislikes: 0,
		likes: 0,
		views: 0,
	};
}
