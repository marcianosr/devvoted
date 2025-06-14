import { User } from "@supabase/supabase-js";
import { createClient } from "@/app/supabase/client";
import { User as DevvotedUser } from "@/types/db";

const mapDbUserToAuthUser = (dbUser: User): DevvotedUser => {
	return dbUser;
};

// 	({
// 	id: dbUser.id,
// 	displayName: dbUser.user_metadata?.full_name || "",
// 	email: dbUser.email || "",
// 	photoUrl: dbUser.user_metadata?.avatar_url,
// 	roles: dbUser.role,
// });

export async function getOrCreateUser(authUser: User): Promise<DevvotedUser> {
	const supabase = createClient();

	// Check if user exists in our users table
	const { data: existingUser, error: fetchError } = await supabase
		.from("users")
		.select<"*", User>()
		.eq("id", authUser.id)
		.single();

	if (fetchError && fetchError.code !== "PGRST116") {
		throw new Error(`Failed to fetch user: ${fetchError.message}`);
	}

	if (existingUser) {
		console.log("existingUser", existingUser);
		return mapDbUserToAuthUser(existingUser);
	}

	// Create new user if not found
	const { data: newUser, error: insertError } = await supabase
		.from("users")
		.insert({
			id: authUser.id,
			display_name:
				authUser.user_metadata.full_name ||
				authUser.email!.split("@")[0],
			email: authUser.email!,
			photo_url: authUser.user_metadata.avatar_url,
			roles: "user" as const,
		})
		.select<"*", User>()
		.single();

	if (insertError || !newUser) {
		throw new Error(`Failed to create user: ${insertError?.message}`);
	}

	console.log("newUser", newUser);

	return mapDbUserToAuthUser(newUser);
}
