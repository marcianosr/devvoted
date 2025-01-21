import { firebaseConfigLocal } from "@/lib/firebase-config.local";
import { Poll } from "@/types/database";
import { initializeApp } from "firebase/app";
import {
	getFirestore,
	setDoc,
	doc,
	connectFirestoreEmulator,
	Timestamp,
} from "firebase/firestore";

const seedData: Record<string, Record<string, Poll>> = {
	polls: {
		poll1: {
			id: "poll1",
			pollNumber: 1,
			categories: ["React", "Hooks"],
			question: "What's your favorite React Hook?",
			options: [
				{ id: "1", text: "useState", isCorrect: true },
				{ id: "2", text: "useEffect", isCorrect: false },
				{ id: "3", text: "useContext", isCorrect: false },
				{ id: "4", text: "useRef", isCorrect: false },
				{ id: "43", text: "useReducer", isCorrect: false },
			],
			status: "open",
			openingTime: Timestamp.now(),
			closingTime: Timestamp.fromDate(
				new Date(Date.now() + 24 * 60 * 60 * 1000)
			),
			responses: [],
		},
		poll2: {
			id: "poll2",
			pollNumber: 2,
			categories: ["TypeScript", "Types"],
			question: "Which TypeScript utility type do you use most?",
			options: [
				{ id: "1", text: "Partial<T>", isCorrect: true },
				{ id: "2", text: "Pick<T, K>", isCorrect: false },
				{ id: "3", text: "Omit<T, K>", isCorrect: false },
				{ id: "4", text: "Record<K, T>", isCorrect: false },
			],
			status: "open",
			openingTime: Timestamp.now(),
			closingTime: Timestamp.fromDate(
				new Date(Date.now() + 24 * 60 * 60 * 1000)
			),
			responses: [],
		},
	},
};

console.log("🚀 Starting database seeding...", firebaseConfigLocal);

const app = initializeApp(firebaseConfigLocal, "seeding-instance"); // Add a unique name to avoid conflicts

console.log("✅ Firebase initialized");

const db = getFirestore(app);

// Connect to emulator
console.log("🔌 Connecting to Firestore emulator...");
connectFirestoreEmulator(db, "localhost", 8080);
console.log("✅ Connected to Firestore emulator");

async function seedDatabase() {
	try {
		console.log("📝 Starting to seed polls...");
		// Seed polls
		for (const pollId in seedData.polls) {
			const poll = seedData.polls[pollId];
			console.log(`Seeding poll ${pollId}...`);
			await setDoc(doc(db, "polls", pollId), poll);
			console.log(`✅ Created poll: ${pollId}`);
		}

		console.log("📝 Starting to seed users...");

		console.log("🌱 Seeding completed successfully!");
		return true;
	} catch (error) {
		console.error("❌ Error seeding database:", error);
		throw error;
	}
}

// Run the seeding
seedDatabase()
	.then((success) => {
		if (success) {
			console.log(
				"✨ All done! Check your Firestore emulator at http://localhost:8080"
			);
			process.exit(0);
		}
	})
	.catch((error) => {
		console.error("Failed to seed database:", error);
		process.exit(1);
	});
