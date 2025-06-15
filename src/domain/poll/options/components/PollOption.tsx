"use client";

import { PollOption as PollOptionType } from "@/types/db";
import classNames from "classnames";

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
	<li
		className={classNames("flex gap-2", {
			"text-green-500": isReadOnly && option.is_correct,
			"text-red-500": isReadOnly && !option.is_correct && isSelected,
		})}
	>
		correct: {JSON.stringify(option.is_correct)}
		<input
			type="checkbox"
			checked={isSelected}
			readOnly
			value={option.id}
			onChange={() => !isReadOnly && onOptionClick(option.id.toString())}
			disabled={isReadOnly}
			name="pollOption"
			id={option.id.toString()}
		/>
		<label htmlFor={option.id.toString()}>{option.option}</label>
	</li>
);
