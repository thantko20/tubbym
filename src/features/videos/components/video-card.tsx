import { Video } from "../types";

export const VideoCard = ({ video }: { video: Video }) => {
  return (
    <div
      key={video.id}
      className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden flex flex-col"
    >
      <div className="aspect-video bg-gray-200">
        {video.thumbnailUrl ? (
          <img
            src={video.thumbnailUrl}
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
        <p className="text-sm text-gray-500 mb-2 line-clamp-2">
          {video.description}
        </p>
        <div className="mt-auto flex items-center justify-between text-xs text-gray-500">
          <span>By {video.uploaderName || "Unknown"}</span>
          <span>{video.views} views</span>
        </div>
        <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
          <span>👍 {video.likes}</span>
          <span>👎 {video.dislikes}</span>
          <span>{formatDuration(video.duration)}</span>
        </div>
      </div>
    </div>
  );
};

function formatDuration(seconds: number | undefined) {
  if (!seconds || isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
