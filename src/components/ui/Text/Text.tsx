import type { ReactNode } from "react";
import styles from "./Text.module.css";
import classNames from "classnames";
type TextProps = {
	children: ReactNode;
	variant?: "default" | "small" | "error" | "warning" | "success";
	as?: "p" | "span" | "b";
	weight?: "bold" | "normal";
};

export default function Text({
	children,
	variant = "default",
	as: Component = "p",
	weight = "normal",
}: TextProps) {
	return (
		<Component
			className={classNames(
				styles.paragraph,
				styles[variant],
				styles[weight]
			)}
		>
			{children}
		</Component>
	);
}

// Named exports for specific variants
export function SmallText({
	children,
	as = "span",
}: Omit<TextProps, "variant">) {
	return (
		<Text variant="small" as={as}>
			{children}
		</Text>
	);
}

export const PerformanceText = ({
	variant,
	condition,
	text,
}: {
	variant: "upgraded" | "downgraded";
	condition: boolean;
	text: string;
}) => {
	if (!condition) return null;

	const mapping = {
		["upgraded"]: "success",
		["downgraded"]: "error",
	} as const;

	return (
		<Text variant={mapping[variant]} weight="bold" as="b">
			{text}
		</Text>
	);
};
