import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";
import type { Video } from "../types";

export const VideoCard = ({ video }: { video: Video }) => {
	return (
		<div
			key={video.id}
			className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden flex flex-col"
		>
			<div className="aspect-video bg-gray-200">
				{video.thumbnailUrl ? (
					<img
						src={
							"https://images.unsplash.com/photo-1745946645137-66cfb274ee7d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
						}
						alt={video.title}
						className="w-full h-full object-cover"
					/>
				) : (
					<div className="w-full h-full flex items-center justify-center text-gray-400">
						No Thumbnail
					</div>
				)}
			</div>
			<div className="p-4 flex-1 flex flex-col">
				<h2 className="text-lg font-semibold mb-1 line-clamp-2">
					{video.title}
				</h2>
				<p className="text-sm text-gray-500 mb-2 line-clamp-2 text-ellipsis">
					{video.description}
				</p>
				<div className="mt-auto flex items-center justify-between text-sm text-gray-500 font-semibold">
					<div>{video.uploaderName || "Unknown"}</div>
					<div>{video.views} views</div>
				</div>
				<div className="flex items-center gap-4 mt-2 text-xs text-gray-700">
					<div className="flex gap-2.5 items-center">
						<button
							type="button"
							className="flex items-center gap-1.5 cursor-pointer"
						>
							<ThumbsUpIcon size={16} /> {video.likes}
						</button>
						<button
							type="button"
							className="flex items-center gap-1.5 cursor-pointer"
						>
							<ThumbsDownIcon size={16} /> {video.dislikes}
						</button>
					</div>
					<div className="ml-auto">{formatDuration(video.duration)}</div>
				</div>
			</div>
		</div>
	);
};

function formatDuration(seconds: number | undefined) {
	if (!seconds || Number.isNaN(seconds)) return "0:00";
	const m = Math.floor(seconds / 60);
	const s = seconds % 60;
	return `${m}:${s.toString().padStart(2, "0")}`;
}
