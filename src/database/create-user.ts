import { firebaseConfigLocal } from "@/lib/firebase-config.local";
import { initializeApp } from "firebase/app";
import {
	getAuth,
	createUserWithEmailAndPassword,
	connectAuthEmulator,
	updateProfile,
	GoogleAuthProvider,
	signInWithCredential,
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

// Test users data
const TEST_USERS = [
	{
		// Admin user with Google account
		email: "bowser@nintendo.com",
		displayName: "King Bowser",
		photoURL: "https://api.dicebear.com/7.x/pixel-art/svg?seed=bowser",
		roles: ["admin", "user"] as const,
		isGoogle: true,
	},
	{
		// Regular user with Google account
		email: "mario@nintendo.com",
		displayName: "Super Mario",
		photoURL: "https://api.dicebear.com/7.x/pixel-art/svg?seed=mario",
		roles: ["user"] as const,
		isGoogle: true,
	},
	{
		// Regular user with password
		email: "link@hyrule.com",
		password: "triforce123",
		displayName: "Link",
		photoURL: "https://api.dicebear.com/7.x/pixel-art/svg?seed=link",
		roles: ["user"] as const,
		isGoogle: false,
	},

	{
		email: "shane@stardew.com",
		password: "chickens123",
		displayName: "Shane",
		photoURL: "https://api.dicebear.com/7.x/pixel-art/svg?seed=shane",
		roles: ["user"] as const,
		isGoogle: false,
	},
	{
		email: "krobus@sewers.com",
		password: "shadowgoods",
		displayName: "Krobus",
		photoURL: "https://api.dicebear.com/7.x/pixel-art/svg?seed=krobus",
		roles: ["user"] as const,
		isGoogle: false,
	},
	{
		// Pokémon admin
		email: "professoroak@pokemon.com",
		displayName: "Professor Oak",
		photoURL:
			"https://api.dicebear.com/7.x/pixel-art/svg?seed=professoroak",
		roles: ["admin", "user"] as const,
		isGoogle: true,
	},
];

async function createTestUsers() {
	try {
		console.log("🚀 Creating test users...");

		for (const user of TEST_USERS) {
			console.log(`\nCreating user: ${user.displayName}`);

			let userCredential;

			if (user.isGoogle) {
				// Create Google user
				const googleCredential = GoogleAuthProvider.credential(
					`{"sub": "${user.email}", "email": "${user.email}", "name": "${user.displayName}"}`
				);
				userCredential = await signInWithCredential(
					auth,
					googleCredential
				);
				console.log("✅ Created Google user");
			} else {
				// Create password-based user
				userCredential = await createUserWithEmailAndPassword(
					auth,
					user.email,
					user.password!
				);
				console.log("✅ Created password user");
			}

			// Update profile
			await updateProfile(userCredential.user, {
				displayName: user.displayName,
				photoURL: user.photoURL,
			});

			const userId = userCredential.user.uid;
			console.log("User ID:", userId);

			// Create corresponding document in Firestore
			const userData = {
				id: userId,
				email: user.email,
				displayName: user.displayName,
				photoURL: user.photoURL,
				roles: user.roles,
				totalPollsSubmitted: 0,
				responses: [],
			};

			await setDoc(doc(db, "users", userId), userData);
			console.log("✅ Created Firestore document");

			// Log credentials
			console.log("\n👤 User Credentials:");
			console.log("Email:", user.email);
			if (!user.isGoogle) {
				console.log("Password:", user.password);
			}
			console.log("User ID:", userId);
			console.log("Roles:", user.roles.join(", "));
		}

		console.log("\n🎉 All test users created successfully!");
		return true;
	} catch (error) {
		console.error("❌ Error creating test users:", error);
		throw error;
	}
}

// Run the creation
createTestUsers()
	.then(() => {
		console.log(
			"\n✨ All done! You can now sign in with any of the test user credentials"
		);
		process.exit(0);
	})
	.catch((error) => {
		console.error("Failed to create test users:", error);
		process.exit(1);
	});
