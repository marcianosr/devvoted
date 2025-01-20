import NextLink, { LinkProps as NextLinkProps } from "next/link";
import classNames from "classnames";
import { AnchorHTMLAttributes } from "react";

type LinkVariant = "primary";

type LinkProps = Omit<
	AnchorHTMLAttributes<HTMLAnchorElement>,
	keyof NextLinkProps
> &
	NextLinkProps & {
		variant?: LinkVariant;
	};

const linkVariants = {
	base: "underline transition-colors",
	variant: {
		primary: "text-blue-600 hover:text-blue-700",
	},
} as const;

const Link = ({ variant = "primary", children, ...props }: LinkProps) => (
	<NextLink
		className={classNames(linkVariants.base, linkVariants.variant[variant])}
		{...props}
	>
		{children}
	</NextLink>
);

export default Link;
