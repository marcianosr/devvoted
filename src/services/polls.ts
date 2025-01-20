import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Poll } from "@/types/database";

export const getPoll = async (pollId: string): Promise<Poll | null> => {
  try {
    console.log("Fetching poll from Firestore emulator:", pollId);
    const pollRef = doc(db, "polls", pollId);
    const pollSnap = await getDoc(pollRef);
    
    console.log("Poll data:", pollSnap.data());
    
    if (!pollSnap.exists()) {
      console.log("Poll not found");
      return null;
    }
    
    return pollSnap.data() as Poll;
  } catch (error) {
    console.error("Error fetching poll:", error);
    throw error;
  }
};
