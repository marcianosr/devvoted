import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import serviceAccount from "../config/polls-d8b3d-fa6512eea816.json";

if (!getApps().length) {
	initializeApp({
		credential: cert(serviceAccount as any),
	});
}

export const adminAuth = getAuth();
