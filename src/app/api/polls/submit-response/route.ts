import { createClient } from "@/app/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	try {
		const { pollId, userId, selectedOptions } = await request.json();

		console.log(" Submitting poll response:", {
			pollId,
			userId,
			selectedOptions,
		});

		const supabase = await createClient();

		// First create the response record in polls_responses
		const { data: response, error: responseError } = await supabase
			.from("polls_responses")
			.insert([
				{
					poll_id: pollId,
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
		const responseOptions = selectedOptions.map((optionId) => ({
			response_id: response.response_id,
			option_id: optionId,
		}));

		const { error: optionsError } = await supabase
			.from("polls_response_options")
			.insert(responseOptions);

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
