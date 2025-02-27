import type { Metadata } from "next";
import { Fira_Code } from "next/font/google";
import Navbar from "@/components/Navbar";
import { QueryProvider } from "@/providers/QueryProvider";
import "./globals.css";

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
				className={
					`${firaCode.className} antialiased` + " " + layoutStyles
				}
			>
				<QueryProvider>
					<Navbar />
					<main>{children}</main>
				</QueryProvider>
			</body>
		</html>
	);
}
