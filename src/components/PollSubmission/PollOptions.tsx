import classNames from "classnames";
import { PollOption } from "@/types/db";
import Text from "@/components/ui/Text";

type Props = {
	options: PollOption[];
	selectedOptions: string[];
	onOptionClick: (optionId: string) => void;
};

export const PollOptions = ({ options, selectedOptions, onOptionClick }: Props) => {
	const isOptionSelected = (optionId: string) =>
		selectedOptions.includes(optionId);

	return (
		<div className="space-y-4">
			{options.map((option) => (
				<button
					key={option.id}
					onClick={() => onOptionClick(option.id.toString())}
					className={classNames(
						"w-full p-4 text-left border rounded-lg transition-colors",
						{
							"border-purple-600 bg-purple-600 bg-opacity-20":
								isOptionSelected(option.id.toString()),
							"bg-white bg-opacity-0 hover:bg-opacity-20":
								!isOptionSelected(option.id.toString()),
						}
					)}
					role="checkbox"
					aria-checked={isOptionSelected(option.id.toString())}
				>
					<Text as="span">{option.option}</Text>
				</button>
			))}
		</div>
	);
};
