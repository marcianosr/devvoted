import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import serviceAccount from "../config/polls-d8b3d-fa6512eea816.json";

if (!getApps().length) {
	initializeApp({
		credential: cert(serviceAccount as any),
	});
}

export const adminAuth = getAuth();

export async function verifyGoogleToken(idToken: string) {
  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    
    // Get user by UID or create if doesn't exist
    let userRecord;
    try {
      userRecord = await adminAuth.getUser(decodedToken.uid);
    } catch (error) {
      // If user doesn't exist, create a new one
      userRecord = await adminAuth.createUser({
        uid: decodedToken.uid,
        email: decodedToken.email,
        emailVerified: decodedToken.email_verified,
        displayName: decodedToken.name,
        photoURL: decodedToken.picture,
        disabled: false
      });
    }

    return {
      user: userRecord,
      token: decodedToken
    };
  } catch (error) {
    throw new Error('Invalid ID token');
  }
}
