import { CreatePostPollResponseRequest } from "@/domain/api/createPostPollResponse";
import { NextResponse } from "next/server";

import { createPostPollResponse } from "@/domain/poll-response/createPollResponse";

export async function POST(request: Request) {
	try {
		const { poll, userId, selectedOptions, selectedBet } =
			(await request.json()) as CreatePostPollResponseRequest;

		const result = await createPostPollResponse({
			poll,
			userId,
			selectedOptions,
			selectedBet,
		});

		return NextResponse.json(result);
	} catch (error) {
		console.error("Error in poll submission:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
