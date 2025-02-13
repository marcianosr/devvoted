"use client";

import classNames from "classnames";
import Text from "@/components/ui/Text";
import { PollOption as PollOptionType } from "@/types/db";

type Props = {
	option: PollOptionType;
	isSelected: boolean;
	onOptionClick: (optionId: string) => void;
	isReadOnly?: boolean;
};

export const PollOption = ({
	option,
	isSelected,
	onOptionClick,
	isReadOnly = false,
}: Props) => (
	<button
		onClick={() => !isReadOnly && onOptionClick(option.id.toString())}
		className={classNames(
			"w-full p-4 text-left border rounded-lg transition-colors",
			{
				"border-purple-600 bg-purple-600 bg-opacity-20": isSelected,
				"bg-white bg-opacity-0 hover:bg-opacity-20": !isSelected && !isReadOnly,
				"cursor-default": isReadOnly,
			}
		)}
		role="checkbox"
		aria-checked={isSelected}
		disabled={isReadOnly}
	>
		<Text as="span">{option.option}</Text>
	</button>
);
