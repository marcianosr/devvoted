import Text from "@/components/ui/Text";

export const ClosedPollMessage = () => (
	<div className="border border-yellow-500 rounded-lg p-4">
		<Text variant="warning">This poll is no longer accepting responses.</Text>
	</div>
);
