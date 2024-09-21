"use client";
import React, { useEffect, useState } from "react";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { MenuBar } from "~/components/ui/menuBar/MenuBar";
import { NavBar } from "~/components/ui/NavBar";
import { LandingPage } from "~/components/ui/home/landingPage";
import { StatsSection } from "~/components/ui/home/statsSection";
import OnboardingOverlay from "~/components/ui/overlay";

interface DimensionsStructured {
  length: {
    unit: string;
    value: number;
  };
  width: {
    unit: string;
    value: number;
  };
  weight: {
    unit: string;
    value: number;
  };
  height: {
    unit: string;
    value: number;
  };
}

export interface Book {
  publisher: string;
  synopsis: string;
  language: string;
  image: string;
  title_long: string;
  dimensions: string; // This can be a more complex structure if needed
  dimensions_structured: DimensionsStructured;
  pages: number;
  date_published: string;
  subjects: string[];
  authors: string[];
  title: string;
  isbn13: string;
  msrp: string;
  binding: string;
  isbn: string;
  isbn10: string;
}

const onboardingSteps = [
  {
    id: "step1",
    description:
      "This is the navigation bar where you can access different pages.",
    highlightId: "navbar",
  },
  {
    id: "step2",
    description: "Here you can see your profile information.",
    highlightId: "stats",
  },
];

export default function Home() {
  const [showOnboarding, setShowOnboarding] = useState(true);

  const handleFinishOnboarding = () => {
    setShowOnboarding(false);
    // Optionally, save to localStorage to prevent showing again
    localStorage.setItem("onboardingCompleted", "true");
  };

  useEffect(() => {
    const completed = localStorage.getItem("onboardingCompleted");
    if (completed) {
      // setShowOnboarding(false);
    }
  }, []);
  return (
    <div className="bg-background">
      <NavBar selected="Home" />
      <SignedIn>
        <StatsSection />
      </SignedIn>
      <SignedOut>
        <LandingPage />
      </SignedOut>
      {showOnboarding && (
        <OnboardingOverlay
          steps={onboardingSteps}
          onFinish={handleFinishOnboarding}
        />
      )}
      <MenuBar currentPage="Home" />
    </div>
  );
}
