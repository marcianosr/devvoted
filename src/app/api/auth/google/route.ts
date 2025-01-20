import { NextResponse } from "next/server";
import { verifyGoogleToken } from "@/lib/firebase-admin";

export async function POST(request: Request) {
	try {
		const { idToken } = await request.json();

		// Verify the ID token using our existing function
		const { user } = await verifyGoogleToken(idToken);

		return NextResponse.json({
			status: "success",
			user: {
				uid: user.uid,
				email: user.email,
				name: user.displayName,
				photoURL: user.photoURL,
			},
		});
	} catch (error) {
		console.error("Token verification error:", error);
		return NextResponse.json({ error: "Invalid token" }, { status: 401 });
	}
}
