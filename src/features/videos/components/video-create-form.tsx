import { useForm } from "@tanstack/react-form";
import { createServerFn, useServerFn } from "@tanstack/react-start";
import { getWebRequest, setResponseStatus } from "@tanstack/react-start/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { auth } from "@/lib/auth";
import {
	type CreateVideoSchema,
	createVideoSchema,
} from "../schemas/create-video.schema";
import type { Video } from "../types";
import {
	type VideoVisibility,
	videoVisibility,
	videoVisibilityOptions,
} from "../video.constants";
import { createVideo } from "../video.service";

const createVideoServerFn = createServerFn({ method: "POST" })
	.validator(createVideoSchema)
	.handler(async ({ data }) => {
		const authData = await auth.api.getSession(getWebRequest());
		if (!authData) {
			setResponseStatus(401);
			return {
				success: false,
				statusCode: 401,
				message: "Unauthorized",
				data: null,
			} as const;
		}
		console.log("Creating video with data:", data);
		const result = await createVideo(data, authData.user.id);
		setResponseStatus(201);
		return {
			success: true,
			data: result,
			statusCode: 201,
			message: "Video created successfully",
		} as const;
	});

export const VideoCreateForm = ({
	onSuccess,
}: {
	onSuccess?: (data: Video) => void;
}) => {
	const createVideoClientFn = useServerFn(createVideoServerFn);
	const form = useForm({
		defaultValues: {
			title: "",
			description: "",
			visibility: videoVisibility.PUBLIC,
		} as CreateVideoSchema,
		validators: {
			onSubmit: createVideoSchema,
		},
		onSubmit: async ({ value }) => {
			console.log("Submitting video creation form with value:", value);
			try {
				const result = await createVideoClientFn({ data: value });
				if (result.success) {
					console.log("Video created successfully:", result.data);
					onSuccess?.(result.data);
				} else {
					console.error("Error creating video:", result.message);
				}
			} catch (error) {
				console.error("Error creating video:", error);
			}
		},
	});

	return (
		<form
			className="space-y-4"
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
		>
			<div className="space-y-2">
				<form.Field
					name="title"
					children={(field) => {
						return (
							<>
								<Label htmlFor={field.name}>Title</Label>
								<Input
									placeholder="Enter video title"
									id={field.name}
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
								/>
								{field.state.meta.errors.length > 0 && (
									<p className="text-red-500 text-sm mt-1">
										{field.state.meta.errors[0]?.message}
									</p>
								)}
							</>
						);
					}}
				/>
			</div>
			<div className="space-y-2">
				<form.Field
					name="description"
					validators={{
						onBlur: createVideoSchema.shape.description,
					}}
					children={(field) => {
						return (
							<>
								<Label htmlFor={field.name}>Description</Label>
								<Textarea
									placeholder="Enter video description"
									id={field.name}
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
								/>
								{!field.state.meta.isValid && (
									<p className="text-red-500 text-sm mt-1">
										{field.state.meta.errors[0]?.message}
									</p>
								)}
							</>
						);
					}}
				/>
			</div>
			<div className="space-y-2">
				<form.Field
					name="visibility"
					validators={{
						onChange: createVideoSchema.shape.visibility,
					}}
					children={(field) => {
						return (
							<>
								<Label htmlFor={field.name}>Visibility</Label>
								<Select
									value={field.state.value}
									onValueChange={(value) => {
										if (
											videoVisibilityOptions.includes(value as VideoVisibility)
										) {
											field.handleChange(value as VideoVisibility);
										}
									}}
									name={field.name}
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Select visibility" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value={videoVisibility.PUBLIC}>
											Public
										</SelectItem>
										<SelectItem value={videoVisibility.PRIVATE}>
											Private
										</SelectItem>
										<SelectItem value={videoVisibility.UNLISTED}>
											Unlisted
										</SelectItem>
									</SelectContent>
								</Select>
								{!field.state.meta.isValid && (
									<p className="text-red-500 text-sm mt-1">
										{field.state.meta.errors[0]?.message}
									</p>
								)}
							</>
						);
					}}
				/>
			</div>
			<div className="flex justify-end">
				<form.Subscribe
					selector={(state) => [state.isSubmitting]}
					children={([isSubmitting]) => {
						return (
							<Button
								key={"create-video-submit"}
								disabled={isSubmitting}
								type="submit"
								className="min-w-[100px]"
							>
								{isSubmitting ? "Submitting..." : "Next"}
							</Button>
						);
					}}
				/>
			</div>
		</form>
	);
};
