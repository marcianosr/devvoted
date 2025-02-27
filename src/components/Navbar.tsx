import Link from "@/components/ui/Link";
import UserProfile from "@/components/UserProfile";

const Navbar = () => {
	return (
		<header>
			<nav>
				<div>
					<Link href="/">Devvoted</Link>
					<div>
						<UserProfile />
					</div>
				</div>
			</nav>
		</header>
	);
};

export default Navbar;
