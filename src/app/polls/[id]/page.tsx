import Text from "@/components/ui/Text";
import { SmallText } from "@/components/ui/Text";
import Title from "@/components/ui/Title";
import { Metadata } from "next";
import { getPollWithOptions } from "@/services/polls";
import PollQuestion from "@/components/PollQuestion";
import { getUser } from "@/services/user";
import PollSubmission from "@/components/PollSubmission";
type Props = {
	params: { id: string };
};

const getPollById = async (params: { id: string }) => {
	const { id } = await params;

	const { poll, options } = await getPollWithOptions(id);

	return { poll, options };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { poll } = await getPollById(params);
	return {
		title: poll?.question || "Poll Not Found",
		description: `Vote on the poll: ${poll?.question}`,
	};
}

export default async function PollPage({ params }: Props) {
	const { poll, options } = await getPollById(params);
	const user = await getUser();

	if (!poll) {
		return (
			<div className="container mx-auto px-4 py-8">
				<Title>Poll Not Found</Title>
				<Text>
					The poll you&apos;re looking for doesn&apos;t exist.
				</Text>
			</div>
		);
	}

	const hasResponded = false;

	if (hasResponded) {
		return (
			<div className="container mx-auto px-4 py-8">
				<Title>You have already responded to this poll</Title>
				<Text>You can only submit one response per poll.</Text>
			</div>
		);
	}

	return (
		<section className="container mx-auto px-4 py-8 space-y-8">
			<PollQuestion poll={poll} />
			<PollSubmission poll={poll} options={options} user={user} />

			<div className="mt-4">
				{/* <SmallText>Total responses: {poll.responses.length}</SmallText> */}
			</div>
		</section>
	);
}
