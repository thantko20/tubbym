import React, { useEffect, useRef } from "react";
import videojs, { type VideoJsPlayer } from "video.js";
import type Player from "video.js/dist/types/player";
import "video.js/dist/video-js.css";
import "videojs-contrib-quality-levels";
import "jb-videojs-hls-quality-selector";

type OnReadyFn = (player: Player) => void;

type Props = {
	onReady: OnReadyFn;
	// biome-ignore lint/suspicious/noExplicitAny: I dont know the exact type of videojs options
	options: any;
};

export const VideoJS = (props: Props) => {
	const videoRef = React.useRef<HTMLDivElement>(null);
	const playerRef = React.useRef<Player>(null);
	const onReadyRef = useRef<OnReadyFn>(null);
	const { options, onReady } = props;

	useEffect(() => {
		onReadyRef.current = onReady;
	}, [onReady]);

	useEffect(() => {
		const onReady = onReadyRef.current;
		if (!playerRef.current) {
			const videoElement = document.createElement("video");
			videoElement.className = "video-js vjs-big-play-centered";
			videoRef.current?.appendChild(videoElement);

			const player = videojs(videoElement, options, function () {
				videojs.log("player is ready");

				try {
					// biome-ignore lint/suspicious/noExplicitAny: duh
					const anyPlayer = player as any;
					if (typeof anyPlayer.hlsQualitySelector === "function") {
						anyPlayer.hlsQualitySelector({ displayCurrentQuality: true });
					} else {
						videojs.log.warn("hlsQualitySelector is not a function");
					}

					const ql = anyPlayer.qualityLevels?.();

					if (ql && typeof ql.on === "function") {
						ql.on("change", () => {
							const t = player.currentTime();
							if (typeof t !== "undefined" && !Number.isNaN(t)) {
								player.currentTime(t + 0.001);
							}
						});
					}
				} catch (error) {
					videojs.log.warn("Error initializing hlsQualitySelector:", error);
				}

				if (onReady) {
					onReady(player);
				}
			});
			playerRef.current = player;
		} else {
			const player = playerRef.current;
			player.autoplay(options.autoplay);
			player.src(options.sources);
		}
	}, [options]);

	useEffect(() => {
		const player = playerRef.current;
		// Clean up function to dispose the player after the component unmounts
		return () => {
			if (player && !player.isDisposed()) {
				player.dispose();
				playerRef.current = null;
			}
		};
	}, []);

	return (
		<div className="video-player" data-vjs-player>
			<div ref={videoRef} />
		</div>
	);
};
