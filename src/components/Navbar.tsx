"use client";

import Button from "@/components/ui/Button";
import Link from "@/components/ui/Link";
import UserProfile from "@/components/UserProfile";

const Navbar = () => {
	return (
		<header className="w-full">
			<nav
				className="container mx-auto px-4 h-16"
				role="navigation"
				aria-label="Main navigation"
			>
				<div className="h-full flex items-center justify-between">
					<Link
						href="/"
						className="font-bold text-xl hover:text-gray-700 transition-colors"
						aria-label="Go to homepage"
					>
						Devvoted
					</Link>

					<div
						className="flex items-center space-x-4"
						role="group"
						aria-label="User actions"
					></div>
				</div>
			</nav>
		</header>
	);
};

export default Navbar;
