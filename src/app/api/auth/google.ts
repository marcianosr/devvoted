import { NextApiRequest, NextApiResponse } from "next";
import { verifyGoogleToken } from "@/lib/firebase-admin";
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== "POST") {
		return res.status(405).json({ error: "Method not allowed" });
	}

	try {
		const { idToken } = req.body;

		if (!idToken) {
			return res.status(400).json({ error: "ID token is required" });
		}

		const { user, token } = await verifyGoogleToken(idToken);

		// You might want to set a session cookie here
		// or return a JWT token for client-side authentication

		return res.status(200).json({
			user: {
				uid: user.uid,
				email: user.email,
				displayName: user.displayName,
				photoURL: user.photoURL,
			},
		});
	} catch (error) {
		console.error("Authentication error:", error);
		return res.status(401).json({ error: "Authentication failed" });
	}
}
