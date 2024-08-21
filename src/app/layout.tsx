import "~/styles/globals.css";
import { type Metadata } from "next";
import { Toaster } from "~/components/ui/toaster";
import { ClerkProvider } from "@clerk/nextjs";
import { ReactQueryProvider } from "./ReactQueryProvider";
import { ThemeProvider } from "~/components/theme-provider";

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
      <html lang="en" suppressHydrationWarning>
        <ReactQueryProvider>
          <body>
            <ThemeProvider
              attribute="class"
              defaultTheme="pink"
              enableSystem={false}
              themes={["red", "darkRed", "rose", "darkRose", "light", "dark"]}
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
