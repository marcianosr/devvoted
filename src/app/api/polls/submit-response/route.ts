import { createClient } from "@/app/supabase/server";
import { SubmitPollResponseParams } from "@/services/api/polls";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	try {
		const { poll, userId, selectedOptions, selectedBet } =
			(await request.json()) as SubmitPollResponseParams;

		const supabase = await createClient();

		// First create the response record in polls_responses
		const { data: response, error: responseError } = await supabase
			.from("polls_responses")
			.insert([
				{
					poll_id: poll.id,
					user_id: userId,
				},
			])
			.select()
			.single();

		if (responseError) {
			console.error("Error creating poll response:", responseError);
			return NextResponse.json(
				{ error: "Failed to create response" },
				{ status: 500 }
			);
		}

		// Create many-to-many relationships in polls_response_options
		// This links which options were selected for this response
		const responseOptions = selectedOptions.map((optionId: string) => ({
			response_id: response.response_id,
			option_id: optionId,
		}));

		const { error: optionsError } = await supabase
			.from("polls_response_options")
			.insert(responseOptions);

		// Get the previous streak multiplier
		const { data: prevRun } = await supabase
			.from("active_runs")
			.select("streakMultiplier")
			.eq("user_id", userId)
			.order("created_at", { ascending: false })
			.limit(1)
			.single();

		const prevMultiplier = prevRun?.streakMultiplier ?? 0;
		const DEFAULT_MULTIPLIER = 0.1;
		const newMultiplier = prevMultiplier + DEFAULT_MULTIPLIER;

		// Calculate XP based on the selected bet
		const calculateXP = (bet: number) => {
			return bet;
		};

		const { error: betError } = await supabase.from("active_runs").insert([
			{
				user_id: userId,
				category_code: poll.category_code,
				temporary_xp: calculateXP(selectedBet),
				streak_multiplier: newMultiplier,
			},
		]);

		if (betError) {
			console.error("Error creating bet:", betError);
			// If we fail to save the bet, we must delete the response
			// to prevent having a response without a bet (orphaned record)
			await supabase
				.from("polls_responses")
				.delete()
				.eq("response_id", response.response_id);

			return NextResponse.json(
				{ error: "Failed to create bet" },
				{ status: 500 }
			);
		}

		if (optionsError) {
			console.error("Error creating response options:", optionsError);
			// If we fail to save the selected options, we must delete the response
			// to prevent having a response without any selected options (orphaned record)
			await supabase
				.from("polls_responses")
				.delete()
				.eq("response_id", response.response_id);

			return NextResponse.json(
				{ error: "Failed to create response options" },
				{ status: 500 }
			);
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error in poll submission:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
