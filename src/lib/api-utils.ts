export const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export type ApiResponse<T = unknown> = {
	success: boolean;
	message: string;
	data?: T;
	code?: string;
};

export class ApiError extends Error {
	constructor(
		public status: number,
		message: string,
		public code?: string,
		public response?: Response,
	) {
		super(message);
		this.name = "ApiError";
	}
}

export async function handleApiResponse<T>(response: Response): Promise<T> {
	const responseData: ApiResponse<T> = await response.json();

	if (!response.ok || !responseData.success) {
		throw new ApiError(
			response.status,
			responseData.message || `HTTP ${response.status}`,
			responseData.code,
			response,
		);
	}

	// Useful during development for quick inspection; adjust verbosity as needed.
	// eslint-disable-next-line no-console
	console.log(responseData.data);

	return responseData.data as T;
}
