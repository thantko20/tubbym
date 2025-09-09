import { VideoJS } from "@/components/videojs";
import { getVideoById } from "@/features/videos/video.api";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useRef } from "react";
import z from "zod";

const getVideoByIdServerFn = createServerFn({ method: "GET" })
	.validator(
		z.object({
			videoId: z.string(),
		}),
	)
	.handler(async ({ data }) => {
		const video = await getVideoById(data.videoId);
		return video;
	});

export const Route = createFileRoute("/_layout/$videoId/")({
	component: RouteComponent,
	loader: async ({ params }) => {
		return {
			video: await getVideoByIdServerFn({ data: { videoId: params.videoId } }),
		};
	},
});

function RouteComponent() {
	const { video } = Route.useLoaderData();
	const playerRef = useRef<any>(null);

	const isHls = /\.m3u8($|\?)/i.test(video.url ?? "");

	const videoJsOptions = {
		autoplay: true,
		controls: true,
		responsive: true,
		fluid: true,
		preload: "auto",
		playsinline: true,
		liveui: true,
		sources: [
			{
				src: video.url,
				// type: isHls ? "application/x-mpegURL" : "video/mp4",
				type: "application/x-mpegURL",
			},
		],
		html5: isHls
			? {
					vhs: {
						withCredentials: false,
						enableLowInitialPlaylist: true,
						overrideNative: true,
						limitRenditionByPlayerDimensions: true,
						useDevicePixelRatio: true,
					},
					nativeAudioTracks: false,
					nativeTextTracks: false,
				}
			: undefined,
	} as const;

	const handleOnReady = (player: any) => {
		playerRef.current = player;

		player.on("waiting", () => {
			console.log("Player is waiting");
		});

		player.on("dispose", () => {
			console.log("Player will dispose");
		});
	};

	return (
		<div>
			<h2>{video.title}</h2>
			<p>{video.url}</p>
			<VideoJS options={videoJsOptions} onReady={handleOnReady} />
		</div>
	);
}
