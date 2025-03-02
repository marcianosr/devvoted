import { CreatePostPollResponseRequest } from "@/services/api/createPostPollResponse";
import { NextResponse } from "next/server";

import { createPostPollResponse } from "@/services/createPollResponse";

export async function POST(request: Request) {
	try {
		const { poll, userId, selectedOptions, selectedBet } =
			(await request.json()) as CreatePostPollResponseRequest;

		await createPostPollResponse({
			poll,
			userId,
			selectedOptions,
			selectedBet,
		});
		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error in poll submission:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
