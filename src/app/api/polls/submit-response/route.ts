import { SubmitPollResponseParams } from "@/services/api/polls";
import { NextResponse } from "next/server";

import { submitPollResponse } from "@/services/pollResponse";

export async function POST(request: Request) {
	try {
		const { poll, userId, selectedOptions, selectedBet } =
			(await request.json()) as SubmitPollResponseParams;

		await submitPollResponse({
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
