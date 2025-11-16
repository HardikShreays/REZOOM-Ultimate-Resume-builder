import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "REZOOM - The Ultimate Resume Builder",
  description: "Create ATS-friendly, professional resumes in minutes. AI-powered resume builder for modern professionals.",
  keywords: "resume builder, ATS friendly, professional resume, AI resume, job application",
  authors: [{ name: "Hardik Shreyas" }],
  openGraph: {
    title: "REZOOM - The Ultimate Resume Builder",
    description: "Create ATS-friendly, professional resumes in minutes",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <SpeedInsights />
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} min-h-full bg-background text-foreground antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
