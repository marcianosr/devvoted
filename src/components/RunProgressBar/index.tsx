"use client";

import { usePollResult } from "@/app/context/PollResultContext";
import Text, { PerformanceText } from "@/components/ui/Text/Text";
import { AuthenticatedUser } from "@/services/clientUser";
import { START_AMOUNT_ATTEMPTS } from "@/services/constants";
import { useUserPerformance } from "@/services/userPerformance";
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

	const newScore = pollResult?.changes.devvotedScore
		? Number(pollResult.changes.devvotedScore).toFixed(2)
		: null;

	const scoreDifference =
		newScore && formattedScore
			? (Number(newScore) - Number(formattedScore)).toFixed(2)
			: null;

	const scoreIncreased = scoreDifference && Number(scoreDifference) > 0;
	const scoreDecreased = scoreDifference && Number(scoreDifference) < 0;

	return (
		<aside>
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
					{activeRun?.current_streak ?? 0}{" "}
					<PerformanceText
						variant="upgraded"
						condition={
							Number(pollResult?.changes.newStreak) >
							Number(pollResult?.changes.previousStreak)
						}
						text={`→ ${pollResult?.changes.newStreak}`}
					/>
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
