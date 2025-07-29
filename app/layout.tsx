import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { fontNoto } from "@/config/fonts";
import Navbar from "@/components/Navigationbar";

export const metadata: Metadata = {
	title: {
		default: siteConfig.name,
		template: `%s - ${siteConfig.name}`,
	},
	appleWebApp: {
		title: siteConfig.name,
	},
	description: siteConfig.description,
};

export const viewport: Viewport = {
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "white" },
		{ media: "(prefers-color-scheme: dark)", color: "black" },
	],
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html suppressHydrationWarning lang="en">
			<head />

			<body
				className={clsx(
					"bg-background font-sans text-foreground antialiased",
					fontNoto.variable
				)}
			>
				<Providers
					themeProps={{ attribute: "class", defaultTheme: "white" }}
				>
					<div className="relative flex flex-col h-full min-h-screen">
						<Navbar />

						<main className="container flex-grow h-full max-w-full p-3 mx-auto md:p-6">
							{children}
						</main>
					</div>
				</Providers>
			</body>
		</html>
	);
}
