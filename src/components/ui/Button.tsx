import { ButtonHTMLAttributes } from "react";
import classNames from "classnames";

type ButtonVariant = "primary" | "secondary";
type ButtonSize = "default" | "sm" | "lg";

type ButtonProps = Omit<
	ButtonHTMLAttributes<HTMLButtonElement>,
	"className"
> & {
	variant?: ButtonVariant;
	size?: ButtonSize;
};

const buttonVariants = {
	base: "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
	variant: {
		primary: "bg-blue-600 text-white hover:bg-blue-700",
		secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
	},
	size: {
		sm: "h-8 px-3",
		default: "h-10 px-4",
		lg: "h-12 px-6",
	},
} as const;

const Button = ({
	variant = "primary",
	size = "default",
	children,
	...props
}: ButtonProps) => (
	<button
		className={classNames(
			buttonVariants.base,
			buttonVariants.variant[variant],
			buttonVariants.size[size]
		)}
		{...props}
	>
		{children}
	</button>
);

export default Button;
