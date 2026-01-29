import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chief of Staff Kit — for Clawdbot",
  description: "A hand-tuned workspace that turns your Clawdbot into a personal chief of staff. Daily briefings, email triage, follow-ups. Five minutes to set up. Runs on pennies.",
  openGraph: {
    title: "Chief of Staff Kit",
    description: "Turn your Clawdbot into a personal chief of staff. $5.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
