"use client";

import { usePollResult } from "@/app/context/PollResultContext";
import Text, { PerformanceText } from "@/components/ui/Text/Text";
import { AuthenticatedUser } from "@/domain/user/clientUser";
import { useUserPerformance } from "@/domain/user/userPerformance";
import { ActiveRun, Poll } from "@/types/db";

type RunProgressBarProps = {
	activeRun: ActiveRun;
	poll: Poll;
	user: AuthenticatedUser | null;
};

const RunProgressBar = ({ activeRun, poll, user }: RunProgressBarProps) => {
	const { pollResult } = usePollResult();
	const { data: userPerformance } = useUserPerformance(
		user?.id,
		poll.category_code
	);

	const bettingAverage = userPerformance?.betting_average ?? 0;

	const streakChanged =
		pollResult?.changes?.previousStreak !== pollResult?.changes?.newStreak;

	return (
		<aside>
			{poll.answer_type}
			<Text>📜 Category: {poll.category_code}</Text>
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
		</aside>
	);
};

export default RunProgressBar;
