import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { Toaster } from "~/components/ui/toaster";
import { ClerkProvider } from "@clerk/nextjs";
import { ReactQueryProvider } from "./ReactQueryProvider";

export const metadata: Metadata = {
  title: "MyLibrary",
  description: "Your home library management system",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ReactQueryProvider>
      <ClerkProvider>
        <html lang="en" className={`${GeistSans.variable}`}>
          <body>
            <Toaster />
            {children}
          </body>
        </html>
      </ClerkProvider>
    </ReactQueryProvider>
  );
}
