import { Montserrat, Poppins } from "next/font/google";

export const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
});

/** Poppins has no Cyrillic, so Russian text uses this similar geometric face (see globals.css). */
export const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["cyrillic"],
  weight: ["400", "500", "600", "700"],
});

export const fontClasses = `${poppins.variable} ${montserrat.variable} antialiased`;
