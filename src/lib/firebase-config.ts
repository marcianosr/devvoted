export const useEmulator =
	process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === "true";

export const emulatorHost = "localhost";
export const authEmulatorPort = 9099;
export const firestoreEmulatorPort = 8080;

export const getEmulatorHost = (port: number) =>
	`http://${emulatorHost}:${port}`;

export const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
	authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};
