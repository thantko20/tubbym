import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { VideoCreateForm } from "./video-create-form";
import { VideoUploadForm } from "./video-upload-form";

export const VideoUploadFormButton = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [step, setStep] = useState<"create" | "upload">("create");
	const [videoId, setVideoId] = useState<string | null>(null);
	const [presignedUrl, setPresignedUrl] = useState<string | null>(null);

	const handleCreateSuccess = (data: { id: string; presignedUrl: string }) => {
		setVideoId(data.id);
		setPresignedUrl(data.presignedUrl);
		setStep("upload");
	};

	const handleUploadComplete = () => {
		setIsOpen(false);
		setStep("create");
		setVideoId(null);
	};

	const handleUploadError = (error: Error) => {
		console.error("Upload error:", error);
		// You might want to show an error toast here
	};

	return (
		<Dialog
			open={isOpen}
			onOpenChange={(open) => {
				if (!open) {
					// Reset form state when dialog is closed
					setStep("create");
					setVideoId(null);
				}
				setIsOpen(open);
			}}
		>
			<DialogTrigger asChild>
				<Button>Upload Video</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{step === "create" ? "Video Details" : "Upload Video"}
					</DialogTitle>
					<DialogDescription>
						{step === "create"
							? "Enter the details about your video."
							: "Upload your video file. Supported formats: MP4, WebM, MOV."}
					</DialogDescription>
				</DialogHeader>

				{step === "create" ? (
					<VideoCreateForm onSuccess={handleCreateSuccess} />
				) : (
					videoId && (
						<VideoUploadForm
							videoId={videoId}
							onUploadComplete={handleUploadComplete}
							onUploadError={handleUploadError}
							uploadUrl={presignedUrl}
						/>
					)
				)}
			</DialogContent>
		</Dialog>
	);
};
