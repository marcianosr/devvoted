"use client";

import { usePollResult } from "@/app/context/PollResultContext";
import Text, { PerformanceText } from "@/components/ui/Text/Text";
import { AuthenticatedUser } from "@/domain/user/clientUser";
import { START_AMOUNT_ATTEMPTS } from "@/domain/constants";
import { useUserPerformance } from "@/domain/user/userPerformance";
import { ActiveRun, Poll } from "@/types/db";

type RunProgressBarProps = {
	activeRun: ActiveRun;
	poll: Poll;
	user: AuthenticatedUser | null;
};

const RunProgressBar = ({ activeRun, poll, user }: RunProgressBarProps) => {
	const { pollResult } = usePollResult();
	const { data: userPerformance, isLoading } = useUserPerformance(
		user?.id,
		poll.category_code
	);

	console.log("userPerformance", userPerformance);

	const bettingAverage = userPerformance?.betting_average ?? 0;

	const formattedScore = userPerformance?.devvoted_score
		? Number(userPerformance.devvoted_score).toFixed(2)
		: "0.00";

	// Get the new score from the poll result
	const newScore = pollResult?.changes.devvotedScore
		? Number(pollResult.changes.devvotedScore).toFixed(2)
		: null;

	// Get the previous score from the poll result
	const previousScore = pollResult?.changes.previousDevvotedScore
		? Number(pollResult.changes.previousDevvotedScore).toFixed(2)
		: null;

	// For displaying the score difference, we need to use the absolute value
	const scoreDifference =
		newScore && previousScore
			? Math.abs(Number(newScore) - Number(previousScore)).toFixed(2)
			: null;

	// Determine if the score increased or decreased
	const scoreIncreased =
		newScore && previousScore && Number(newScore) > Number(previousScore);
	const scoreDecreased =
		newScore && previousScore && Number(newScore) < Number(previousScore);

	const streakChanged =
		pollResult?.changes?.previousStreak !== pollResult?.changes?.newStreak;

	return (
		<aside>
			{poll.answer_type}
			<Text>📜 Category: {poll.category_code}</Text>
			<Text>
				📊 DevVoted Score: {isLoading ? "Loading..." : formattedScore}{" "}
				<PerformanceText
					variant="upgraded"
					condition={!!scoreIncreased}
					text={`🔼 (+${scoreDifference})`}
				/>
				<PerformanceText
					variant="downgraded"
					condition={!!scoreDecreased}
					text={`🔽 (-${scoreDifference})`}
				/>
			</Text>
			<Text>
				🕒 Status:{" "}
				<b>
					{poll.status.charAt(0).toUpperCase() + poll.status.slice(1)}
				</b>
			</Text>
			<Text>
				💰 Available to bet: <b>{activeRun?.temporary_xp ?? "0"}</b> XP
				from{" "}
				<b>
					{activeRun?.category_code}{" "}
					<PerformanceText
						variant="upgraded"
						condition={
							Number(pollResult?.changes.newXP) >
							Number(pollResult?.changes.previousXP)
						}
						text={`→ ${pollResult?.changes.newXP} XP`}
					/>
					<PerformanceText
						variant="downgraded"
						condition={
							Number(pollResult?.changes.newXP) <
							Number(pollResult?.changes.previousXP)
						}
						text={`→ ${pollResult?.changes.newXP} XP`}
					/>
				</b>
			</Text>
			<Text>
				🎯 Streak Multiplier:{" "}
				<b>
					{activeRun?.streak_multiplier}×{" "}
					<PerformanceText
						variant="upgraded"
						condition={
							Number(pollResult?.changes.newMultiplier) >
							Number(pollResult?.changes.previousMultiplier)
						}
						text={`→ ${pollResult?.changes.newMultiplier}×`}
					/>
					<PerformanceText
						variant="downgraded"
						condition={
							Number(pollResult?.changes.newMultiplier) <
							Number(pollResult?.changes.previousMultiplier)
						}
						text={`→ ${pollResult?.changes.newMultiplier}×`}
					/>
				</b>
			</Text>
			<Text>
				🎯 Betting average:{" "}
				<b>
					{bettingAverage}{" "}
					<PerformanceText
						variant="upgraded"
						condition={
							Number(pollResult?.changes.newBettingAverage) >
							Number(pollResult?.changes.previousBettingAverage)
						}
						text={`→ ${pollResult?.changes.newBettingAverage}`}
					/>
					<PerformanceText
						variant="downgraded"
						condition={
							Number(pollResult?.changes.newBettingAverage) <
							Number(pollResult?.changes.previousBettingAverage)
						}
						text={`→ ${pollResult?.changes.newBettingAverage}`}
					/>
				</b>
			</Text>
			<Text>
				🔥 Current streak:{" "}
				<b>
					{streakChanged
						? pollResult.changes.previousStreak
						: activeRun?.current_streak ?? 0}

					{streakChanged && (
						<PerformanceText
							variant={
								Number(pollResult.changes.newStreak) >
								Number(pollResult.changes.previousStreak)
									? "upgraded"
									: "downgraded"
							}
							condition={true}
							text={` → ${pollResult.changes.newStreak}`}
						/>
					)}
				</b>
			</Text>
			<Text>
				⚙️ Playing with config:{" "}
				<b>{user?.devvotedUser.active_config}</b>
			</Text>
			<Text>
				🔄 Attempts:{" "}
				<b>
					{user?.devvotedUser.run_attempts}/{START_AMOUNT_ATTEMPTS}{" "}
					left
				</b>
			</Text>
		</aside>
	);
};

export default RunProgressBar;
