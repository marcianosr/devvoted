import React from "react";
import Link from "next/link";
import styles from "./ButtonLink.module.css";

interface ButtonLinkProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	href?: string;
	external?: boolean;
}

const ButtonLink: React.FC<ButtonLinkProps> = ({
	href,
	external,
	children,
	...props
}) => {
	if (href) {
		return external ? (
			<a
				href={href}
				target="_blank"
				rel="noopener noreferrer"
				className={styles.buttonLink}
			>
				{children}
			</a>
		) : (
			<Link href={href} className={styles.buttonLink}>
				{children}
			</Link>
		);
	}

	return (
		<button className={styles.buttonLink} {...props}>
			{children}
		</button>
	);
};

export default ButtonLink;
