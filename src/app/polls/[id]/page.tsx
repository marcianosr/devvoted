import Text from "@/components/ui/Text/Text";
import Title from "@/components/ui/Title/Title";
import { Metadata } from "next";
import { getPollWithOptions } from "@/domain/poll/polls";
import PollQuestion from "@/domain/poll/components/PollQuestion";
import { getUser } from "@/domain/user/user";
import PollSubmission from "@/domain/poll/submission/components/PollSubmission";
import { getActiveRun } from "@/domain/run/activeRun";
import ButtonLink from "@/components/ui/ButtonLink/ButtonLink";
import RunProgressBar from "@/domain/run/components/RunProgressBar";
import Link from "next/link";

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
	const { id } = await params;
	const { poll } = await getPollById(id);

	return {
		title: poll?.question || "Poll Not Found",
		description: `Vote on the poll: ${poll?.question}`,
	};
}

export default async function PollPage({ params }: Props) {
	const { id } = await params;
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
			<RunProgressBar activeRun={activeRun} poll={poll} user={user} />
			<section>
				<PollQuestion poll={poll} />
				<PollSubmission
					poll={poll}
					options={options}
					user={user}
					userSelectedOptions={userSelectedOptions}
				/>
				{/* If the XP of a given caterogy hits 0, start new run */}
				{false && (
					<>
						<Text>🔧 Run over!</Text>
						<ButtonLink href="/config">Start a new run</ButtonLink>
					</>
				)}
				<Link href={`/polls/${Number(id) + 1}`}>Next poll</Link>
			</section>
		</section>
	);
}
