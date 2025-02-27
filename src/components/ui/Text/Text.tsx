import type { ReactNode } from "react";
import styles from "./Text.module.css";
import classNames from "classnames";
type TextProps = {
	children: ReactNode;
	variant?: "default" | "small" | "error" | "warning";
	as?: "p" | "span";
};

export default function Text({
	children,
	variant = "default",
	as: Component = "p",
}: TextProps) {
	return (
		<Component className={classNames(styles.paragraph, styles[variant])}>
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
