"use client";

import classNames from "classnames";
import Text from "@/components/ui/Text";
import { PollOption as PollOptionType } from "@/types/db";

type Props = {
	option: PollOptionType;
	isSelected: boolean;
	onOptionClick: (optionId: string) => void;
};

export const PollOption = ({ option, isSelected, onOptionClick }: Props) => (
	<button
		onClick={() => onOptionClick(option.id.toString())}
		className={classNames(
			"w-full p-4 text-left border rounded-lg transition-colors",
			{
				"border-purple-600 bg-purple-600 bg-opacity-20": isSelected,
				"bg-white bg-opacity-0 hover:bg-opacity-20": !isSelected,
			}
		)}
		role="checkbox"
		aria-checked={isSelected}
	>
		<Text as="span">{option.option}</Text>
	</button>
);
