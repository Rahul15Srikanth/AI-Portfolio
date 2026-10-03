import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { VoiceAgent } from "@/components/voice-agent/VoiceAgent";
import { VoiceAgentProvider } from "@/components/voice-agent/VoiceAgentContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rahul Srikanth | AI & Software Developer",
  description:
    "Portfolio of Rahul Srikanth — AI, software development, data and conversational AI projects.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col">
        <VoiceAgentProvider>
          {children}
          <VoiceAgent />
        </VoiceAgentProvider>
      </body>
    </html>
  );
}
