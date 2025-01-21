import { initializeApp, getApps } from "firebase/app";
import {
	getAuth,
	GoogleAuthProvider,
	signInWithPopup,
	connectAuthEmulator,
} from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import {
	useEmulator,
	emulatorHost,
	authEmulatorPort,
	firestoreEmulatorPort,
	firebaseConfig,
} from "@/lib/firebase-config";

// Ensure we're using emulator in development
const isEmulator = process.env.NODE_ENV === "development" || useEmulator;

console.log("Firebase Config:", {
	projectId: firebaseConfig.projectId,
	isEmulator,
	nodeEnv: process.env.NODE_ENV,
});

// Initialize Firebase
const app =
	getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Auth
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Initialize Firestore
const db = getFirestore(app);

// Connect to emulators in development
if (isEmulator) {
	console.log("Connecting to Firebase emulators...");
	connectAuthEmulator(auth, `http://${emulatorHost}:${authEmulatorPort}`);
	connectFirestoreEmulator(db, emulatorHost, firestoreEmulatorPort);
	console.log("Connected to Firebase emulators");
}

export const signInWithGoogle = async () => {
	try {
		const result = await signInWithPopup(auth, googleProvider);
		const idToken = await result.user.getIdToken();

		// Send token to backend for verification
		const response = await fetch("/api/auth/google", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ idToken }),
		});

		if (!response.ok) {
			throw new Error("Failed to verify token");
		}

		return result;
	} catch (error) {
		console.error("Error signing in with Google:", error);
		throw error;
	}
};

export { auth, db };
