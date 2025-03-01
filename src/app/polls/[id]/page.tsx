import Text from "@/components/ui/Text/Text";
import Title from "@/components/ui/Title/Title";
import { Metadata } from "next";
import { getPollWithOptions } from "@/services/polls";
import PollQuestion from "@/components/PollQuestion";
import { getUser } from "@/services/user";
import PollSubmission from "@/components/PollSubmission";

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

	console.log(poll);

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
