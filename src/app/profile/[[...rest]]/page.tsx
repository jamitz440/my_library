"use client";
import { MenuBar } from "~/components/ui/MenuBar";
import { NavBar } from "~/components/ui/NavBar";
import { UserProfile } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { SignOutButton, SignInButton } from "@clerk/nextjs";
import { SignedIn, SignedOut } from "@clerk/clerk-react";

export default function Profile() {
  const themes = [
    "red",
    "darkRed",
    "rose",
    "darkRose",
    "yellow",
    "darkYellow",
    "green",
    "darkGreen",
    "turquoise",
    "darkTurquoise",
    "blue",
    "darkBlue",
    "purple",
    "darkPurple",
    "orange",
    "darkOrange",
    "peach",
    "darkPeach",
    "pink",
    "darkPink",
    "gold",
    "darkGold",
    "silver",
    "darkSilver",
    "teal",
    "darkTeal",
    "light",
    "dark",
  ];

  return (
    <div className="min-h-screen bg-background">
      <NavBar selected="Profile" />
      <div className="flex flex-col items-center px-4 py-8 sm:px-8">
        <Card className="mb-8 w-full max-w-2xl">
          <CardHeader>
            <h2 className="text-center text-xl font-semibold">Themes</h2>
          </CardHeader>
          <CardContent className="grid grid-cols-5 justify-items-center gap-6 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
            {themes.map((t) => (
              <ThemeCircle key={t} theme={t} />
            ))}
          </CardContent>
        </Card>

        <Card className="w-full max-w-sm">
          <CardContent className="flex flex-col items-center justify-center pt-6">
            <SignedIn>
              <Button className="w-full">
                <SignOutButton />
              </Button>
            </SignedIn>
            <SignedOut>
              <Button className="w-full">
                <SignInButton />
              </Button>
            </SignedOut>
          </CardContent>
        </Card>
      </div>
      <MenuBar currentPage="Profile" />
    </div>
  );
}

const ThemeCircle = ({ theme }: { theme: string }) => {
  const { setTheme } = useTheme();
  const [themeTrigger, setThemeTrigger] = useState(false);

  const handleThemeChange = (theme: string) => {
    setTheme(theme);
    setThemeTrigger(!themeTrigger);
  };

  return (
    <div
      className={`flex items-center justify-center ${theme == "light" ? "bg-white" : "bg-primary"} ${theme} aspect-square h-8 w-8 transform cursor-pointer overflow-hidden rounded-full transition-all duration-200 hover:scale-110`}
      onClick={() => handleThemeChange(theme)}
    >
      <div
        className={`absolute bottom-0 right-0 h-8 w-8 bg-gradient-to-tl from-40% to-40% ${theme.includes("dark") ? "from-zinc-900" : "from-zinc-100"}`}
      ></div>
    </div>
  );
};
