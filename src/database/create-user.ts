import { firebaseConfigLocal } from "@/lib/firebase-config.local";
import { User } from "@/types/database";
import { initializeApp } from "firebase/app";
import {
	getAuth,
	createUserWithEmailAndPassword,
	connectAuthEmulator,
	updateProfile,
} from "firebase/auth";
import {
	getFirestore,
	doc,
	setDoc,
	connectFirestoreEmulator,
} from "firebase/firestore";

// Initialize Firebase with your config
const app = initializeApp(firebaseConfigLocal, "test-user-instance");

const auth = getAuth(app);
const db = getFirestore(app);

// Connect to emulators
connectAuthEmulator(auth, "http://localhost:9099");
connectFirestoreEmulator(db, "localhost", 8080);

// Test user credentials
export const TEST_USER = {
	email: "test@example.com",
	password: "testpass123",
	displayName: "Marciano Test",
	photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=test",
};

async function createTestUser() {
	try {
		console.log("🚀 Creating test user in Firebase Auth...");

		// Create user in Firebase Auth
		const userCredential = await createUserWithEmailAndPassword(
			auth,
			TEST_USER.email,
			TEST_USER.password
		);

		// Update profile
		await updateProfile(userCredential.user, {
			displayName: TEST_USER.displayName,
			photoURL: TEST_USER.photoURL,
		});

		const userId = userCredential.user.uid;
		console.log("✅ Created auth user with ID:", userId);

		// Create corresponding document in Firestore
		const userData: User = {
			id: userId,
			email: TEST_USER.email,
			displayName: TEST_USER.displayName,
			photoURL: TEST_USER.photoURL,
			roles: ["user"],
			totalPollsSubmitted: 0,
			responses: [],
		};

		console.log("📝 Creating user document in Firestore...");
		await setDoc(doc(db, "users", userId), userData);
		console.log("✅ Created Firestore document");

		console.log("\n🎉 Test user created successfully!");
		console.log("Email:", TEST_USER.email);
		console.log("Password:", TEST_USER.password);
		console.log("User ID:", userId);

		return userId;
	} catch (error) {
		console.error("❌ Error creating test user:", error);
		throw error;
	}
}

// Run the creation
createTestUser()
	.then(() => {
		console.log(
			"\n✨ All done! You can now sign in with the test user credentials"
		);
		process.exit(0);
	})
	.catch((error) => {
		console.error("Failed to create test user:", error);
		process.exit(1);
	});
