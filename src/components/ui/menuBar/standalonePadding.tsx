"use client";
import { useState, useEffect } from "react";

export const StandalonePadding = () => {
  const [isStandaloneMode, setIsStandaloneMode] = useState(false);

  // Check if app is in PWA mode
  useEffect(() => {
    const checkStandalone = () =>
      window.matchMedia("(display-mode: standalone)").matches;

    setIsStandaloneMode(checkStandalone());

    // Optional: Add event listener for changes
    window
      .matchMedia("(display-mode: standalone)")
      .addEventListener("change", (e) => {
        setIsStandaloneMode(e.matches);
      });
  }, []);
  return <div className={`${isStandaloneMode ? "h-4" : ""}`}></div>;
};
