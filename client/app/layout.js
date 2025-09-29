import { Geist, Geist_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
    <html lang="en">
      <SpeedInsights/>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
