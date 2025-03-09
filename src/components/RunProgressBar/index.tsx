"use client";

import { usePollResult } from "@/app/context/PollResultContext";
import Text from "@/components/ui/Text/Text";
import { AuthenticatedUser } from "@/services/clientUser";
import { START_AMOUNT_ATTEMPTS } from "@/services/constants";
import { ActiveRun, Poll } from "@/types/db";

type RunProgressBarProps = {
	activeRun: ActiveRun;
	poll: Poll;
	user: AuthenticatedUser | null;
};

const RunProgressBar = ({ activeRun, poll, user }: RunProgressBarProps) => {
	const { pollResult } = usePollResult();

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
					{pollResult?.changes.newXP && (
						<span className="text-green-500">
							→ {pollResult?.changes.newXP} XP
						</span>
					)}
				</b>
			</Text>
			<Text>
				🎯 Streak Multiplier:{" "}
				<b>
					{activeRun?.streak_multiplier}×{" "}
					{pollResult?.changes.newMultiplier && (
						<span className="text-green-500">
							→ {pollResult?.changes.newMultiplier}×
						</span>
					)}
				</b>
			</Text>
			<Text>
				🔥 Current streak:{" "}
				<b>
					{activeRun?.current_streak ?? 0}{" "}
					{pollResult?.changes.newStreak && (
						<span className="text-green-500">
							→ {pollResult?.changes.newStreak}
						</span>
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
