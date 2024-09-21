import "~/styles/globals.css";
import { type Metadata } from "next";
import { Toaster } from "~/components/ui/toaster";
import { ClerkProvider } from "@clerk/nextjs";
import { ReactQueryProvider } from "./ReactQueryProvider";
import { ThemeProvider } from "~/components/theme-provider";
import type { Viewport } from "next";
import { CheckSignedIn } from "../components/checkSignedIn";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "MyLibrary",
  description: "Your home library management system",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning className="bg-background">
        <ReactQueryProvider>
          <body>
            <ThemeProvider
              attribute="class"
              defaultTheme="pink"
              enableSystem={false}
              themes={[
                "red",
                "rose",
                "yellow",
                "green",
                "turquoise",
                "blue",
                "purple",
                "orange",
                "peach",
                "pink",
                "gold",
                "silver",
                "teal",
                "black",
              ]}
              disableTransitionOnChange={false}
            >
              <Toaster />
              {children}
            </ThemeProvider>
          </body>
        </ReactQueryProvider>
      </html>
    </ClerkProvider>
  );
}
