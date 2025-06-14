import { CreatePostRunRequest } from "@/domain/api/createPostRunRequest";
import { createRun } from "@/domain/run/createRun";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	console.log("🦋 Starting run");

	try {
		const { userId, configId } =
			(await request.json()) as CreatePostRunRequest;
		await createRun({
			userId,
			configId,
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
