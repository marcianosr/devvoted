import ConfigSelector from "@/components/ConfigSelector";
import { getUser } from "@/services/user";
import { redirect } from "next/navigation";

export type Config = {
	name: string;
	description: string;
	id: string;
};

const CONFIGS = [
	{
		name: "Vanilla Config",
		description: "Default config with no options",
		id: "vanilla-config",
	},
];

const ConfigSelectorPage = async () => {
	const user = await getUser();

	if (user?.devvotedUser.active_config) {
		redirect(`/polls/1`);
	}

	return (
		<section>
			<ConfigSelector configs={CONFIGS} />
		</section>
	);
};

export default ConfigSelectorPage;
