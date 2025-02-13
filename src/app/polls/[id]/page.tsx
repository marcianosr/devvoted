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

const getPollById = async (params: { id: string }, userId?: string) => {
	const { id } = params;

	const { poll, options, userSelectedOptions } = await getPollWithOptions(id, userId);

	return { poll, options, userSelectedOptions };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { poll } = await getPollById(params);
	return {
		title: poll?.question || "Poll Not Found",
		description: `Vote on the poll: ${poll?.question}`,
	};
}

export default async function PollPage({ params }: Props) {
	const user = await getUser();
	const { poll, options, userSelectedOptions } = await getPollById(params, user?.id);

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
