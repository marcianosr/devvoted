"use client";

import { usePollResult } from "@/app/context/PollResultContext";
import Text, { UpgradedText } from "@/components/ui/Text/Text";
import { AuthenticatedUser } from "@/services/clientUser";
import { START_AMOUNT_ATTEMPTS } from "@/services/constants";
import { ActiveRun, Poll, User } from "@/types/db";

type RunProgressBarProps = {
	activeRun: ActiveRun;
	poll: Poll;
	user: AuthenticatedUser;
};

const RunProgressBar = ({ activeRun, poll, user }: RunProgressBarProps) => {
	const { pollResult } = usePollResult();

	console.log(pollResult);

	return (
		<aside>
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
					<UpgradedText
						condition={
							!!pollResult?.changes.newXP &&
							pollResult?.changes.xpGain > 0
						}
						text={`→ ${pollResult?.changes.newXP} XP`}
					/>
				</b>
			</Text>
			<Text>
				🎯 Streak Multiplier:{" "}
				<b>
					{activeRun?.streak_multiplier}×{" "}
					<UpgradedText
						condition={!!pollResult?.changes.newMultiplier}
						text={`→ ${pollResult?.changes.newMultiplier}×`}
					/>
				</b>
			</Text>
			<Text>
				🔥 Current streak:{" "}
				<b>
					{activeRun?.current_streak ?? 0}{" "}
					<UpgradedText
						condition={!!pollResult?.changes.newStreak}
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
