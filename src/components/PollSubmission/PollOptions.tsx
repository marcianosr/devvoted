"use client";

import { PollOption as PollOptionType } from "@/types/db";
import { PollOption } from "@/components/PollSubmission/PollOption";

type Props = {
	options: PollOptionType[];
	selectedOptions: string[];
	onOptionClick: (optionId: string) => void;
};

export const PollOptions = ({
	options,
	selectedOptions,
	onOptionClick,
}: Props) => {
	const isOptionSelected = (optionId: string) =>
		selectedOptions.includes(optionId);

	return (
		<div className="space-y-4">
			{options.map((option) => (
				<PollOption
					key={option.id}
					option={option}
					isSelected={isOptionSelected(option.id.toString())}
					onOptionClick={onOptionClick}
				/>
			))}
		</div>
	);
};
