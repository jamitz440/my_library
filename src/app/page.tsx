"use client";
import React from "react";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { MenuBar } from "~/components/ui/menuBar/MenuBar";
import { NavBar } from "~/components/ui/NavBar";
import { LandingPage } from "~/components/ui/home/landingPage";
import { StatsSection } from "~/components/ui/home/statsSection";

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

export default function Home() {
  return (
    <div className="bg-background">
      <NavBar selected="Home" />
      <SignedIn>
        <StatsSection />
      </SignedIn>
      <SignedOut>
        <LandingPage />
      </SignedOut>
      <MenuBar currentPage="Home" />
    </div>
  );
}
