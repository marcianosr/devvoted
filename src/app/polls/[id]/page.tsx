import Text from "@/components/ui/Text";
import { SmallText } from "@/components/ui/Text";
import Title from "@/components/ui/Title";
import { Metadata } from "next";
import { PollSubmissionForm } from "@/components/PollSubmissionForm";
import { getPoll } from "@/services/polls";

type Props = {
	params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const poll = await getPoll(params.id);
	return {
		title: poll?.question || "Poll Not Found",
		description: `Vote on the poll: ${poll?.question}`,
	};
}

export default async function PollPage({ params }: Props) {
	const poll = await getPoll(params.id);

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

	return (
		<section className="container mx-auto px-4 py-8 space-y-8">
			<div className="space-y-4">
				<Title>{poll.question}</Title>
				<SmallText>
					Status:{" "}
					{poll.status.charAt(0).toUpperCase() + poll.status.slice(1)}
				</SmallText>
			</div>

			<PollSubmissionForm poll={poll} />

			<div className="mt-4">
				<SmallText>Total responses: {poll.responses.length}</SmallText>
			</div>
		</section>
	);
}
