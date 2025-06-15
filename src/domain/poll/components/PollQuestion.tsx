import { Poll } from "@/types/db";
import Title from "@/components/ui/Title/Title";

const PollQuestion = ({ poll }: { poll: Poll }) => {
	return (
		<div className="space-y-4">
			<Title>❓ {poll.question}</Title>
		</div>
	);
};

export default PollQuestion;
