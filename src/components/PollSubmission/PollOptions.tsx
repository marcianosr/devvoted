"use client";

import { PollOption as PollOptionType } from "@/types/db";
import { PollOption } from "@/components/PollSubmission/PollOption";

type Props = {
	options: PollOptionType[];
	selectedOptions: string[];
	onOptionClick: (optionId: string) => void;
	isReadOnly?: boolean;
};

export const PollOptions = ({
	options,
	selectedOptions,
	onOptionClick,
	isReadOnly = false,
}: Props) => {
	const isOptionSelected = (optionId: string) =>
		selectedOptions.includes(optionId);

	return (
		<ul>
			{options.map((option: PollOptionType) => (
				<PollOption
					key={option.id}
					option={option}
					isSelected={isOptionSelected(option.id.toString())}
					onOptionClick={onOptionClick}
					isReadOnly={isReadOnly}
				/>
			))}
		</ul>
	);
};
