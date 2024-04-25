import { auth } from "@/auth";
import { firestore } from "./firestore";

export type UserDetails = {
  profileId?: string;
  profilePicture?: string;
  profileName?: string;
};

export const fetchUserDetails = async (): Promise<UserDetails> => {
  const session = await auth();
  if (!session || !session.user) {
    return {
      profileId: undefined,
      profileName: undefined,
      profilePicture: undefined,
    };
  }

  const users = await firestore
    .collection("users")
    .where("email", "==", session?.user?.email)
    .limit(1)
    .get();
  const profileId = users.docs[0].id;
  const profilePicture = session?.user?.image ?? undefined;
  const profileName = session?.user?.name ?? "Unknown user";

  return { profileId, profileName, profilePicture };
};
