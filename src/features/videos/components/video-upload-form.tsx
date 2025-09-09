import { CircleCheck, CircleDashed, Loader } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createServerFn, useServerFn } from "@tanstack/react-start";
import { processVideo } from "../video.api";
import { useEventSource } from "@/lib/sse";
import { API_BASE_URL, ApiError } from "@/lib/api-utils";

const processVideoFn = createServerFn({ method: "POST" })
	.validator((videoId: string) => {
		if (videoId === "") {
			throw new Error("Video ID is required");
		}
		return videoId;
	})
	.handler(async ({ data }) => {
		try {
			await processVideo(data);
		} catch (error) {
			if (error instanceof ApiError) {
				return { success: false, message: error.message };
			}
		}
	});

type VideoProcessingEvent = {
	videoId: string;
	status: string;
};

interface VideoUploadFormProps {
	videoId: string;
	onUploadComplete: () => void;
	onUploadError: (error: Error) => void;
	uploadUrl: string | null;
}

export function VideoUploadForm({
	videoId,
	onUploadComplete,
	onUploadError,
	uploadUrl,
}: VideoUploadFormProps) {
	const processVideoClientFn = useServerFn(processVideoFn);
	const [status, setStatus] = useState<
		"idle" | "uploading" | "processing" | "completed"
	>("idle");
	const [selectedFile, setSelectedFile] = useState<File | null>(null);

	const { close: closeEventSource } = useEventSource<VideoProcessingEvent>({
		events: {
			video_update: (data) => {
				if (data.status === "ready") {
					setStatus("completed");
					closeEventSource();
					onUploadComplete();
				}
			},
		},
		src: `${API_BASE_URL}/videos/${videoId}/status`,
	});

	const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			setSelectedFile(file);
		}
	};

	const handleUpload = async () => {
		if (!selectedFile || !uploadUrl) return;

		try {
			setStatus("uploading");
			const response = await fetch(uploadUrl, {
				method: "PUT",
				body: selectedFile,
				headers: {
					"Content-Type": selectedFile.type,
				},
			});

			if (!response.ok) {
				throw new Error(
					`Upload failed: ${response.status} ${response.statusText}`,
				);
			}

			setStatus("processing");

			await processVideoClientFn({
				data: videoId,
			});
		} catch (error) {
			onUploadError(
				error instanceof Error ? error : new Error("Upload failed"),
			);
			setStatus("idle");
		}
	};

	return (
		<div className="space-y-6">
			<div className="space-y-4">
				<ul className="space-y-4">
					<li className="flex items-center space-x-3">
						{(status === "idle" || status === "uploading") && (
							<>
								{status === "idle" ? (
									<CircleDashed className="h-4 w-4 text-muted-foreground" />
								) : (
									<Loader className="h-4 w-4 text-primary animate-spin" />
								)}
								<span
									className={
										status === "uploading"
											? "text-primary font-medium"
											: "text-muted-foreground"
									}
								>
									Uploading video file
								</span>
							</>
						)}
						{(status === "processing" || status === "completed") && (
							<>
								<CircleCheck className="h-4 w-4 text-green-500" />
								<span className="text-muted-foreground">Upload completed</span>
							</>
						)}
					</li>
					<li className="flex items-center space-x-3">
						{status === "processing" ? (
							<>
								<Loader className="h-4 w-4 text-primary animate-spin" />
								<span className="text-primary font-medium">
									Processing video
								</span>
							</>
						) : status === "completed" ? (
							<>
								<CircleCheck className="h-4 w-4 text-green-500" />
								<span className="text-muted-foreground">
									Processing completed
								</span>
							</>
						) : (
							<>
								<CircleDashed className="h-4 w-4 text-muted-foreground" />
								<span className="text-muted-foreground">Process video</span>
							</>
						)}
					</li>
				</ul>
			</div>

			<div className="space-y-4">
				<div className="space-y-2">
					<label
						htmlFor="video-file"
						className="block text-sm font-medium text-foreground"
					>
						Select Video File
					</label>
					<input
						id="video-file"
						type="file"
						accept="video/*"
						onChange={handleFileSelect}
						disabled={status !== "idle"}
						className="block w-full text-sm text-muted-foreground
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-md file:border-0
                            file:text-sm file:font-semibold
                            file:bg-primary file:text-primary-foreground
                            hover:file:bg-primary/90
                            disabled:opacity-50 disabled:cursor-not-allowed"
					/>
				</div>

				{selectedFile && (
					<div className="text-sm text-muted-foreground">
						Selected file: {selectedFile.name}
					</div>
				)}

				<Button
					onClick={handleUpload}
					disabled={!selectedFile || status !== "idle"}
					className="w-full"
				>
					{status === "uploading"
						? "Uploading..."
						: status === "processing"
							? "Processing..."
							: status === "completed"
								? "Completed"
								: "Start Upload"}
				</Button>
			</div>
		</div>
	);
}
