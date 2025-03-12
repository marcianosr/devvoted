"use client";

import { createClient } from "@/app/supabase/client";
import { UserPerformance } from "@/types/db";
import { useQuery } from "@tanstack/react-query";

/**
 * Fetches user performance data for a specific category
 * @param userId The user ID to fetch performance for
 * @param categoryCode The category code to fetch performance for
 * @returns The user performance data for the specified category
 */
export const getUserPerformance = async (
	userId: string,
	categoryCode: string
): Promise<UserPerformance | null> => {
	const supabase = createClient();

	const { data, error } = await supabase
		.from("polls_user_performance")
		.select("*")
		.eq("user_id", userId)
		.eq("category_code", categoryCode)
		.maybeSingle();

	if (error) {
		console.error("Error fetching user performance:", error);
		return null;
	}

	return data;
};

/**
 * React Query hook to fetch and cache user performance data
 * @param userId The user ID to fetch performance for
 * @param categoryCode The category code to fetch performance for
 * @returns Query result containing the user performance data
 */
export const useUserPerformance = (userId?: string, categoryCode?: string) => {
	return useQuery({
		queryKey: ["userPerformance", userId, categoryCode],
		queryFn: () => getUserPerformance(userId!, categoryCode!),
		enabled: !!userId && !!categoryCode,
	});
};
