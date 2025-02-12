import Button from "@/components/ui/Button";
import { User } from "@supabase/supabase-js";

type Props = {
	isPending: boolean;
	isPollClosed: boolean;
	user: User | null;
	hasSelectedOptions: boolean;
	onSubmit: () => void;
};

export const SubmitButton = ({
	isPending,
	isPollClosed,
	user,
	hasSelectedOptions,
	onSubmit,
}: Props) => (
	<div className="flex justify-end">
		<Button
			onClick={onSubmit}
			disabled={isPollClosed || !user || !hasSelectedOptions || isPending}
			variant="primary"
		>
			{isPending ? "Submitting..." : "Submit"}
		</Button>
	</div>
);
