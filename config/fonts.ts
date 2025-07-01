import { Fira_Code as FontMono, Inter as FontSans, Kanit as FontKanit, Noto_Sans_Thai as FontNoto } from "next/font/google";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const fontKanit = FontKanit({
  subsets: ['latin', 'thai'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900' ],
  variable: "--font-sans",
});

export const fontNoto = FontNoto({
  subsets: ['latin', 'thai'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900' ],
  variable: "--font-sans",
});