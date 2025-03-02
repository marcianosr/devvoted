"use client";

import Text from "@/components/ui/Text/Text";

type BettingOptionsProps = {
	onBetSelect: (percentage: number) => void;
	selectedBet?: number;
};

const bettingOptions = [
	{ value: 1, label: "Pass ⏩ (1% XP)" },
	{ value: 10, label: "10%" },
	{ value: 25, label: "25%" },
	{ value: 50, label: "50%" },
	{ value: 75, label: "75%" },
	{ value: 100, label: "100%" },
];

export const BettingOptions = ({
	onBetSelect,
	selectedBet,
}: BettingOptionsProps) => (
	<section>
		<Text>🎲 Place your bet based on your chosen answer(s)</Text>
		<ul>
			{bettingOptions.map(({ value, label }) => (
				<li key={value}>
					<input
						type="radio"
						name="betOption"
						id={`bet-${value}`}
						value={value}
						checked={selectedBet === value}
						onChange={() => onBetSelect(value)}
					/>
					<label htmlFor={`bet-${value}`}>{label}</label>
				</li>
			))}
		</ul>
	</section>
);
