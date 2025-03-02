export type CreatePostRunRequest = {
	userId: string;
	configId: string;
};

export const createPostRunRequest = async (
	data: CreatePostRunRequest
): Promise<void> => {
	const response = await fetch("/api/runs/start", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.error || "Failed to submit run response");
	}

	return response.json();
};
