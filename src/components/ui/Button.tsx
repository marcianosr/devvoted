import { ButtonHTMLAttributes } from "react";
import classNames from "classnames";
import styles from "./ButtonLink.module.css";
import Link from "next/link";
type ButtonVariant = "primary" | "secondary";

type ButtonProps = Omit<
	ButtonHTMLAttributes<HTMLButtonElement>,
	"className"
> & {
	variant?: ButtonVariant;
	as?: "button" | "link";
	href?: string;
};

const Button = ({
	variant = "primary",
	as = "button",
	children,
	href,
	...props
}: ButtonProps) =>
	as === "button" ? (
		<button
			className={classNames(styles.button, styles[variant])}
			{...props}
		>
			{children}
		</button>
	) : (
		<Link
			href={href}
			className={classNames(styles.button, styles[variant])}
			{...props}
		>
			{children}
		</Link>
	);

export default Button;
