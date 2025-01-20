import type { ReactNode } from "react";

type TitleLevel = "h1" | "h2" | "h3";

type TitleProps = {
	children: ReactNode;
	as?: TitleLevel;
};

const levelStyles: Record<TitleLevel, string> = {
	h1: "text-4xl font-bold text-white",
	h2: "text-3xl font-semibold text-white",
	h3: "text-2xl font-semibold text-white",
	h4: "text-xl font-medium text-white",
	h5: "text-lg font-medium text-white",
	h6: "text-base font-medium text-white",
} as const;

export default function Title({ children, as: Component = "h1" }: TitleProps) {
	return <Component className={levelStyles[Component]}>{children}</Component>;
}
