import Text from "@/components/ui/Text";
import Title from "@/components/ui/Title";
import { Metadata } from "next";
import { getPoll } from "@/services/polls";
import PollQuestion from "@/components/PollQuestion";

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

export default async function PollResponsesPage({ params }: Props) {
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
		<section className="container mx-auto px-4 py-8">
			<PollQuestion poll={poll} />
			<Title as="h2">Poll Responses</Title>

			<section className="space-y-4">
				{poll.responses.map((response) => (
					<div key={response.id}>
						<Text>{response.selectedOptions.join(", ")}</Text>
					</div>
				))}
			</section>
		</section>
	);
}
