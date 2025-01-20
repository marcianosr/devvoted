import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  Timestamp,
  connectFirestoreEmulator 
} from "firebase/firestore";
import type { Poll, User } from "@/types/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: "polls-d8b3d",
  // Add other config if needed
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Connect to emulator in development
if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR) {
  connectFirestoreEmulator(db, "127.0.0.1", 8080);
}

// Sample poll data
const samplePolls: Poll[] = [
  {
    id: "poll1",
    pollNumber: 1,
    categories: ["frontend", "react"],
    question: "What hooks do you use most often in React?",
    options: [
      { id: "opt1", text: "useState", isCorrect: true },
      { id: "opt2", text: "useEffect", isCorrect: false },
      { id: "opt3", text: "useMemo", isCorrect: false },
      { id: "opt4", text: "useContext", isCorrect: false },
    ],
    status: "open",
    openingTime: Timestamp.fromDate(new Date()),
    closingTime: Timestamp.fromDate(new Date(Date.now() + 24 * 60 * 60 * 1000)),
    totalResponses: 0,
  },
  {
    id: "poll2",
    pollNumber: 2,
    categories: ["typescript", "types"],
    question: "Which TypeScript utility type is your favorite?",
    options: [
      { id: "opt1", text: "Partial<T>", isCorrect: true },
      { id: "opt2", text: "Pick<T, K>", isCorrect: false },
      { id: "opt3", text: "Omit<T, K>", isCorrect: false },
      { id: "opt4", text: "Record<K, T>", isCorrect: false },
    ],
    status: "open",
    openingTime: Timestamp.fromDate(new Date()),
    closingTime: Timestamp.fromDate(new Date(Date.now() + 24 * 60 * 60 * 1000)),
    totalResponses: 0,
  },
];

// Sample users
const sampleUsers: User[] = [
  {
    id: "user1",
    displayName: "TypeScript Titan",
    email: "titan@example.com",
    photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=TypeScript",
    roles: ["user"],
    totalPollsSubmitted: 0,
    responses: [],
  },
  {
    id: "user2",
    displayName: "React Ranger",
    email: "ranger@example.com",
    photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=React",
    roles: ["admin", "user"],
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
