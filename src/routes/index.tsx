import { VideoCard } from "@/features/videos/components/video-card";
import { getVideos } from "@/features/videos/video.service";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

const getData = createServerFn().handler(async () => {
  return {
    videos: await getVideos(),
  };
});

export const Route = createFileRoute("/")({
  component: Home,
  loader: async () => getData(),
});

function Home() {
  const { videos } = Route.useLoaderData();
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Video List</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
}
