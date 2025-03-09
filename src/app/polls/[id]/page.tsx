import Text from "@/components/ui/Text/Text";
import Title from "@/components/ui/Title/Title";
import { Metadata } from "next";
import { getPollWithOptions } from "@/services/polls";
import PollQuestion from "@/components/PollQuestion";
import { getUser } from "@/services/user";
import PollSubmission from "@/components/PollSubmission";
import { getActiveRun } from "@/services/activeRun";
import ButtonLink from "@/components/ui/ButtonLink/ButtonLink";
import { START_AMOUNT_ATTEMPTS } from "@/services/constants";

type Props = {
	params: { id: string };
};

export const getPollById = async (id: string, userId?: string) => {
	const { poll, options, userSelectedOptions } = await getPollWithOptions(
		id,
		userId
	);
	return { poll, options, userSelectedOptions };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const id = await params.id;
	const { poll } = await getPollById(id);

	return {
		title: poll?.question || "Poll Not Found",
		description: `Vote on the poll: ${poll?.question}`,
	};
}

export default async function PollPage({ params }: Props) {
	const id = await params.id;
	const user = await getUser();

	const { poll, options, userSelectedOptions } = await getPollById(
		id,
		user?.id
	);

	const activeRun = await getActiveRun(
		user?.id ?? "",
		poll?.category_code ?? ""
	);
	console.log("activeRun", activeRun);

	if (!poll) {
		return (
			<div className="container mx-auto py-8 space-y-4">
				<Title>Poll Not Found</Title>
				<Text>
					The poll you&apos;re looking for doesn&apos;t exist.
				</Text>
			</div>
		);
	}

	if (!activeRun) {
		return (
			<div className="container mx-auto py-8 space-y-4">
				<Title>Start a run first!</Title>
				<Text>
					You need to start a run before you can vote on polls.
				</Text>
				<ButtonLink href="/config">Start a run</ButtonLink>
			</div>
		);
	}

	return (
		<section className="container mx-auto py-8 grid grid-cols-1 md:grid-cols-[250px_1fr] gap-4">
			<aside>
				<Text>📜 Category: {poll.category_code}</Text>
				<Text>
					🕒 Status:{" "}
					<b>
						{poll.status.charAt(0).toUpperCase() +
							poll.status.slice(1)}
					</b>
				</Text>
				<Text>
					💰 Available to bet: <b>{activeRun?.temporary_xp ?? "0"}</b>{" "}
					XP from <b>{activeRun?.category_code}</b>
				</Text>
				<Text>
					🎯 Streak Multiplier: <b>{activeRun?.streak_multiplier}×</b>
				</Text>
				<Text>
					🔥 Current streak: <b>{activeRun?.current_streak ?? 0}</b>
				</Text>
				<Text>
					⚙️ Playing with config:{" "}
					<b>{user?.devvotedUser.active_config}</b>
				</Text>
				<Text>
					🔄 Attempts:{" "}
					<b>
						{user?.devvotedUser.run_attempts}/
						{START_AMOUNT_ATTEMPTS} left
					</b>
				</Text>
			</aside>
			<section>
				<PollQuestion poll={poll} />
				<PollSubmission
					poll={poll}
					options={options}
					user={user}
					userSelectedOptions={userSelectedOptions}
				/>
				{user?.devvotedUser.run_attempts === 0 && (
					<>
						<Text>🔧 Run over!</Text>
						<ButtonLink href="/config">Start a new run</ButtonLink>
					</>
				)}
			</section>
		</section>
	);
}
