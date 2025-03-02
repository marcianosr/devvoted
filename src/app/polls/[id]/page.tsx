import Text from "@/components/ui/Text/Text";
import Title from "@/components/ui/Title/Title";
import { Metadata } from "next";
import { getPollWithOptions } from "@/services/polls";
import PollQuestion from "@/components/PollQuestion";
import { getUser } from "@/services/user";
import PollSubmission from "@/components/PollSubmission";
import { getActiveRun } from "@/services/activeRun";
import ButtonLink from "@/components/ui/ButtonLink/ButtonLink";

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

	const activeRun = await getActiveRun(user?.id ?? "");
	console.log("activeRun", activeRun);

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

	const { poll, options, userSelectedOptions } = await getPollById(
		id,
		user?.id
	);

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

	return (
		<section className="container mx-auto px-4 py-8">
			<section className="mb-8">
				<Text>📜 Category: {poll.category_code}</Text>
				<Text>
					🕒 Status:{" "}
					{poll.status.charAt(0).toUpperCase() + poll.status.slice(1)}
				</Text>
				<Text>
					💰 Available to bet: {activeRun?.category_code ?? "0"} from{" "}
					{activeRun?.category_code} XP pool
				</Text>
				<Text>
					🎯 Multiplier: <b>{activeRun?.streak_multiplier ?? 0}×</b>
				</Text>
				<Text>🔥 Current streak</Text>
			</section>
			<PollQuestion poll={poll} />
			<PollSubmission
				poll={poll}
				options={options}
				user={user}
				userSelectedOptions={userSelectedOptions}
			/>
		</section>
	);
}
