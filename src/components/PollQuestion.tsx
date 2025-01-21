import { Poll } from "@/types/database";
import { SmallText } from "@/components/ui/Text";
import Title from "@/components/ui/Title";

const PollQuestion = ({ poll }: { poll: Poll }) => {
	return (
		<div className="space-y-4">
			<Title>{poll.question}</Title>
			<SmallText>
				Status:{" "}
				{poll.status.charAt(0).toUpperCase() + poll.status.slice(1)}
			</SmallText>
		</div>
	);
};

export default PollQuestion;
