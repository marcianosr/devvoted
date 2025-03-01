import type { ReactNode } from "react";
import styles from "./Title.module.css";
import classNames from "classnames";

type TitleLevel = "h1" | "h2" | "h3";

type TitleProps = {
	variant?: "primary" | "secondary" | "tertiary";
	children: ReactNode;
	as?: TitleLevel;
};

export default function Title({
	variant = "primary",
	children,
	as: Component = "h1",
}: TitleProps) {
	return (
		<Component className={classNames(styles[variant])}>
			{children}
		</Component>
	);
}
