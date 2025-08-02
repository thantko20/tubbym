import { useForm } from "@tanstack/react-form";
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
import {
	type CreateVideoSchema,
	createVideoSchema,
} from "../schemas/create-video.schema";
import {
	type VideoVisibility,
	videoVisibility,
	videoVisibilityOptions,
} from "../video.constants";

export const VideoUploadForm = () => {
	const form = useForm({
		defaultValues: {
			title: "",
			description: "",
			visibility: videoVisibility.PUBLIC,
		} as CreateVideoSchema,
		validators: {
			onSubmit: createVideoSchema,
		},
		onSubmit: async (values) => {
			// Handle form submission logic here
			console.log("Form submitted with values:", values);
			// You can call your API to upload the video or proceed to the next step
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
					validators={{
						onBlur: createVideoSchema.shape.title,
					}}
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
				<Button type="submit" className="min-w-[100px]">
					Next
				</Button>
			</div>
		</form>
	);
};
