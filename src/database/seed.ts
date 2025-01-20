import { initializeApp } from "firebase/app";
import {
	getFirestore,
	doc,
	setDoc,
	Timestamp,
	connectFirestoreEmulator,
} from "firebase/firestore";
import type { Poll, User } from "@/types/database";

// Your web app's Firebase configuration for emulator
const firebaseConfig = {
	projectId: "demo-devvoted",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Always connect to emulator for seeding
connectFirestoreEmulator(db, "localhost", 8080);

// Sample poll data
const samplePolls: Poll[] = [
	{
		id: "poll1",
		pollNumber: 1,
		categories: ["React", "Hooks"],
		question: "What's your favorite React Hook?",
		options: [
			{ id: "1", text: "useState", isCorrect: true },
			{ id: "2", text: "useEffect", isCorrect: false },
			{ id: "3", text: "useContext", isCorrect: false },
			{ id: "4", text: "useRef", isCorrect: false },
		],
		status: "open",
		openingTime: Timestamp.now(),
		closingTime: Timestamp.fromDate(
			new Date(Date.now() + 24 * 60 * 60 * 1000)
		),
		totalResponses: 0,
	},
	{
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
		totalResponses: 0,
	},
];

// Sample users
const sampleUsers: User[] = [
	{
		id: "user1",
		displayName: "TypeScript Titan",
		email: "titan@example.com",
		photoURL: "https://example.com/photo1.jpg",
		roles: ["user"],
		totalPollsSubmitted: 0,
		responses: [],
	},
	{
		id: "user2",
		displayName: "React Ranger",
		email: "ranger@example.com",
		photoURL: "https://example.com/photo2.jpg",
		roles: ["user"],
		totalPollsSubmitted: 0,
		responses: [],
	},
];

export async function seedDatabase() {
	try {
		// Seed polls
		for (const poll of samplePolls) {
			await setDoc(doc(db, "polls", poll.id), poll);
			console.log(`✅ Created poll: ${poll.id}`);
		}

		// Seed users
		for (const user of sampleUsers) {
			await setDoc(doc(db, "users", user.id), user);
			console.log(`✅ Created user: ${user.id}`);
		}

		console.log("🌱 Seeding completed successfully!");
	} catch (error) {
		console.error("Error seeding database:", error);
		throw error;
	}
}
