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
    "blue",
    "darkBlue",
    "purple",
    "darkPurple",
    "orange",
    "darkOrange",
    "light",
    "dark",
  ];

  return (
    <div className="bg-background">
      <NavBar selected="Profile" />
      <div className="flex h-full w-full items-center justify-center gap-4 pt-4">
        {/* <UserProfile path="/profile" /> */}
        <Card>
          <CardHeader>Themes</CardHeader>
          <CardContent className="grid grid-cols-3 gap-4">
            {themes.map((t) => (
              <ThemeCircle key={t} theme={t} />
            ))}
          </CardContent>
        </Card>
        <Card>
          <SignedIn>
            <Button>
              <SignOutButton />
            </Button>
          </SignedIn>
          <SignedOut>
            <Button>
              <SignInButton />
            </Button>
          </SignedOut>
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
      className={` ${theme == "light" ? "bg-white" : "bg-primary"} ${theme} relative aspect-square h-12 overflow-hidden rounded-full`}
      onClick={() => handleThemeChange(theme)}
    >
      <div
        className={`absolute bottom-0 right-0 h-14 w-14 bg-gradient-to-tl from-40% to-40% ${theme.includes("dark") ? "from-zinc-900" : "from-zinc-100"}`}
      ></div>
    </div>
  );
};
