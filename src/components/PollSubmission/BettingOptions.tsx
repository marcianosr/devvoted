"use client";

import Text from "@/components/ui/Text/Text";

type BettingOptionsProps = {
	onBetSelect: (percentage: number) => void;
	selectedBet?: number;
	isFinalBoss?: boolean;
	challengeDescription?: string;
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
	isFinalBoss = false,
	challengeDescription,
}: BettingOptionsProps) => (
	<section>
		{isFinalBoss ? (
			<>
				<Text variant="error" weight="bold">
					{challengeDescription || "You must bet 100% of your XP on this poll!"}
				</Text>
				<ul>
					<li>
						<input
							type="radio"
							name="betOption"
							id="bet-100"
							value={100}
							checked={true}
							readOnly
						/>
						<label htmlFor="bet-100" className="font-bold">100% - FINAL BOSS CHALLENGE</label>
					</li>
				</ul>
			</>
		) : (
			<>
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
			</>
		)}
	</section>
);
