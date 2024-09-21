import React, { useState, useEffect } from "react";

interface Step {
  id: string;
  description: string;
  highlightId: string;
}

interface OnboardingProps {
  steps: Step[];
  onFinish: () => void;
}

export const OnboardingOverlay = ({ steps, onFinish }: OnboardingProps) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const currentStep = steps[currentStepIndex];

  useEffect(() => {
    if (currentStep) {
      const element = document.getElementById(currentStep.highlightId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        const rect = element.getBoundingClientRect();
        document.documentElement.style.setProperty(
          "--highlight-top",
          `${rect.top + window.scrollY}px`,
        );
        document.documentElement.style.setProperty(
          "--highlight-left",
          `${rect.left + window.scrollX}px`,
        );
        document.documentElement.style.setProperty(
          "--highlight-width",
          `${rect.width}px`,
        );
        document.documentElement.style.setProperty(
          "--highlight-height",
          `${rect.height}px`,
        );
      }
    } else {
      // No more steps
      setIsVisible(false);
      onFinish && onFinish();
    }
  }, [currentStep]);

  const handleNext = () => {
    setCurrentStepIndex((prev) => prev + 1);
  };

  if (!isVisible) return null;

  return (
    <div>
      {/* Overlay for the spotlight effect */}
      <div className="highlight-mask"></div>

      {/* Dialog */}
      <div
        style={{
          position: "fixed",
          bottom: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: "#fff",
          padding: "20px",
          zIndex: 10000,
          borderRadius: "8px",
          maxWidth: "80%",
          textAlign: "center",
        }}
      >
        <p>{currentStep?.description}</p>
        <button onClick={handleNext}>Next</button>
      </div>

      {/* Spotlight Effect Styles */}
      <style jsx>{`
        .highlight-mask {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 9999;
        }
        .highlight-mask::before {
          content: "";
          position: absolute;
          top: var(--highlight-top);
          left: var(--highlight-left);
          width: var(--highlight-width);
          height: var(--highlight-height);
          background: transparent;
          box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.7);
          border: 2px solid #fff;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

export default OnboardingOverlay;
