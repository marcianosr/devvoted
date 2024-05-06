import NextAuth from "next-auth";
import { FirestoreAdapter } from "@auth/firebase-adapter";
import { authConfig } from "./auth.config";
import { firestore } from "./app/lib/firestore";

const adapter = FirestoreAdapter(firestore);

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  adapter,
});
