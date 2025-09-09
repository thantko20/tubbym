import type { CreateVideoSchema } from "./schemas/create-video.schema";
import type { Video } from "./types";
import {
	API_BASE_URL,
	ApiError,
	handleApiResponse,
	type ApiResponse,
} from "../../lib/api-utils";

export const getVideos = async (): Promise<Video[]> => {
	const response = await fetch(`${API_BASE_URL}/videos`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});

	return handleApiResponse<Video[]>(response);
};

export const createVideo = async (
	data: CreateVideoSchema,
): Promise<{ videoId: string; presignedUrl: string }> => {
	const response = await fetch(`${API_BASE_URL}/videos`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			...data,
		}),
	});

	return handleApiResponse<{ videoId: string; presignedUrl: string }>(response);
};

export const processVideo = async (videoId: string): Promise<void> => {
	const response = await fetch(`${API_BASE_URL}/videos/${videoId}/process`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (response.status !== 202) {
		const responseData = (await response.json()) as ApiResponse;
		throw new ApiError(
			response.status,
			responseData.message || "Failed to process video",
			responseData.code,
		);
	}
	return;
};

export const getVideoById = async (id: string): Promise<Video> => {
	const response = await fetch(`${API_BASE_URL}/videos/${id}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});

	return handleApiResponse<Video>(response);
};

export const updateVideo = async (
	id: string,
	data: Partial<CreateVideoSchema>,
): Promise<Video> => {
	const response = await fetch(`${API_BASE_URL}/videos/${id}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});

	return handleApiResponse<Video>(response);
};

export const deleteVideo = async (id: string): Promise<void> => {
	const response = await fetch(`${API_BASE_URL}/videos/${id}`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
	});

	await handleApiResponse<void>(response);
};

export const incrementVideoViews = async (id: string): Promise<void> => {
	const response = await fetch(`${API_BASE_URL}/videos/${id}/views`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
	});

	await handleApiResponse<void>(response);
};

export const likeVideo = async (id: string, userId: string): Promise<void> => {
	const response = await fetch(`${API_BASE_URL}/videos/${id}/like`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ userId }),
	});

	await handleApiResponse<void>(response);
};

export const dislikeVideo = async (
	id: string,
	userId: string,
): Promise<void> => {
	const response = await fetch(`${API_BASE_URL}/videos/${id}/dislike`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ userId }),
	});

	await handleApiResponse<void>(response);
};
