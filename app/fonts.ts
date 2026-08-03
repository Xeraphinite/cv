import localFont from "next/font/local";
import { IBM_Plex_Sans, IBM_Plex_Sans_JP, Spectral } from "next/font/google";

export const spectral = Spectral({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700", "800"],
	style: ["normal", "italic"],
	display: "swap",
	variable: "--font-spectral",
});

export const ibmPlexSans = IBM_Plex_Sans({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
	display: "swap",
	variable: "--font-ibm-plex-sans",
});

export const ibmPlexSansJp = IBM_Plex_Sans_JP({
	weight: ["400", "500", "600", "700"],
	display: "swap",
	preload: false,
	variable: "--font-ibm-plex-sans-jp",
});

export const frexSansGb = localFont({
	src: [
		{
			path: "./fonts/FrexSansGB-Regular.woff2",
			weight: "400",
			style: "normal",
		},
		{
			path: "./fonts/FrexSansGB-Medium.woff2",
			weight: "500",
			style: "normal",
		},
		{
			path: "./fonts/FrexSansGB-SemiBold.woff2",
			weight: "600",
			style: "normal",
		},
		{
			path: "./fonts/FrexSansGB-Bold.woff2",
			weight: "700",
			style: "normal",
		},
	],
	display: "swap",
	preload: false,
	variable: "--font-frex-sans-gb",
});

export const fontVariables = [
	spectral.variable,
	ibmPlexSans.variable,
	ibmPlexSansJp.variable,
	frexSansGb.variable,
].join(" ");
