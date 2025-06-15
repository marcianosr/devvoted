import { User } from "@supabase/supabase-js";
import ButtonLink from "@/components/ui/ButtonLink/ButtonLink";

type Props = {
	isPending: boolean;
	isPollClosed: boolean;
	user: User | null;
	hasSelectedOptions: boolean;
	hasSelectedBet: boolean;
	onSubmit: () => void;
};

export const SubmitButton = ({
	isPending,
	isPollClosed,
	user,
	hasSelectedOptions,
	hasSelectedBet,
	onSubmit,
}: Props) => (
	<div className="flex justify-end">
		<ButtonLink
			onClick={onSubmit}
			disabled={
				isPollClosed ||
				!user ||
				!hasSelectedOptions ||
				!hasSelectedBet ||
				isPending
			}
		>
			{isPending ? "Submitting..." : "Submit"}
		</ButtonLink>
	</div>
);
