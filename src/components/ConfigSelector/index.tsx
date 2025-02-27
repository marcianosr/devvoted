import ButtonLink from "@/components/ui/ButtonLink/ButtonLink";
import Text from "@/components/ui/Text/Text";

const ConfigSelector = () => (
	<section className="container mx-auto px-4 py-8 w-1/2 space-y-2">
		<Text as="p">🔥 Select your config to begin your next run:</Text>
		<div className="config-selector">
			<Text as="p">[Vanilla Config]</Text>
			<Text as="p">Default config with no options</Text>
		</div>
		<div className="flex justify-end">
			<ButtonLink href="/polls/1">Start Run ▶️</ButtonLink>
		</div>
	</section>
);

export default ConfigSelector;
