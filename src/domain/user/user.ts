import { createClient } from "@/app/supabase/server";
import { redirect } from "next/navigation";
import { AuthenticatedUser } from "@/domain/user/clientUser";

export const getUser = async (): Promise<AuthenticatedUser | null> => {
	const supabase = createClient();

	const {
		data: { user },
		error,
	} = await (await supabase).auth.getUser();

	if (error) {
		console.error("Error fetching user:", error);
		return null;
	}

	if (!user) {
		console.error("User not found:", user);
		return redirect("/login");
	}

	const { data: userTableData, error: userTableError } = await (
		await supabase
	)
		.from("users")
		.select("*")
		.eq("id", user?.id)
		.single();

	if (userTableError) {
		console.error("Error fetching user:", userTableError);
		return null;
	}

	if (!userTableData) {
		console.error("User not found in table:", userTableError);
		return null;
	}

	return {
		...user,
		devvotedUser: userTableData,
	};
};
