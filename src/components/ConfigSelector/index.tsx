"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { updateUserConfig } from "@/services/config";
import { getClientUser } from "@/services/clientUser";
import Text from "@/components/ui/Text/Text";
import ButtonLink from "@/components/ui/ButtonLink/ButtonLink";
import styles from "./ConfigSelector.module.css";
import Title from "@/components/ui/Title/Title";

type Config = {
	name: string;
	description: string;
	id: string;
};

type ConfigSelectorProps = {
	configs: Config[];
};

const ConfigSelector = ({ configs }: ConfigSelectorProps) => {
	const [selectedConfig, setSelectedConfig] = useState(configs[0].id);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	const { mutate: updateConfig, isPending } = useMutation({
		mutationFn: async () => {
			const user = await getClientUser();

			console.log(user);
			if (!user) {
				throw new Error("You must be logged in to start a run");
			}
			return updateUserConfig(user.id, selectedConfig);
		},
		onSuccess: () => {
			router.push("/polls/1");
		},
		onError: (error) => {
			setError(
				error instanceof Error ? error.message : "Failed to start run"
			);
		},
	});

	return (
		<section className="container mx-auto px-4 py-8 w-xl space-y-4">
			<Title variant="secondary">
				🔥 Select your config to begin your next run
			</Title>

			<div className="space-y-4">
				{configs.map((config) => (
					<div
						key={config.id}
						className={styles.configSelector}
						onClick={() => setSelectedConfig(config.id)}
						onKeyDown={(e) => {
							if (e.key === "Enter" || e.key === " ") {
								setSelectedConfig(config.id);
							}
						}}
					>
						<Text>[{config.name}]</Text>
						<Text>{config.description}</Text>
					</div>
				))}
			</div>

			{error && <Text>{error}</Text>}

			<div className="flex justify-end">
				<ButtonLink onClick={() => updateConfig()} disabled={isPending}>
					{isPending ? "Starting Run..." : "Start Run ▶️"}
				</ButtonLink>
			</div>
		</section>
	);
};

export default ConfigSelector;
