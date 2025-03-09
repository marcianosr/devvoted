import type { Metadata } from "next";
import { Fira_Code } from "next/font/google";
import Navbar from "@/components/Navbar";
import { QueryProvider } from "@/providers/QueryProvider";
import { PollResultProvider } from "@/app/context/PollResultContext";
import "./globals.css";
import classNames from "classnames";

const firaCode = Fira_Code({
	variable: "--font-fira-sans",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Devvoted",
	description: "A platform for developers",
};

const layoutStyles = "container mx-auto px-4 py-8";
export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				// className={
				// 	`${firaCode.className} antialiased` + " " + layoutStyles
				// }

				className={classNames("pixter-display-font", layoutStyles)}
			>
				<QueryProvider>
					<PollResultProvider>
						<Navbar />
						<main>{children}</main>
					</PollResultProvider>
				</QueryProvider>
			</body>
		</html>
	);
}
