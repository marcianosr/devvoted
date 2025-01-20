import type { ReactNode } from "react";

type TextProps = {
	children: ReactNode;
	variant?: "default" | "small";
	as?: "p" | "span";
};

const variantStyles = {
	default: "text-white",
	small: "text-sm text-gray-500",
} as const;

export default function Text({
	children,
	variant = "default",
	as: Component = "p",
}: TextProps) {
	return (
		<Component className={variantStyles[variant]}>
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
