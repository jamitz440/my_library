// StarRating.tsx
"use client";
import { useState } from "react";

const containerStyle = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
};

const starContainerStyle = {
  display: "flex",
};

type StarRatingProps = {
  maxRating?: number;
  color?: string;
  size?: number;
  className?: string;
  messages?: string[];
  defaultRating?: number;
  onSetRating?: (rating: number) => void;
  dynamic?: boolean;
};

export default function StarRating({
  maxRating = 10,
  color = "#FCC419",
  size = 48,
  className = "",
  messages = [""],
  defaultRating = 0,
  onSetRating,
  dynamic = true,
}: StarRatingProps) {
  const [rating, setRating] = useState(defaultRating);
  const [tempRating, setTempRating] = useState(0);

  function handleSetRating(newRating: number) {
    setRating(newRating);
    if (onSetRating) {
      onSetRating(newRating);
    }
  }

  return (
    <div style={containerStyle} className={`${className} cursor-default`}>
      <div style={starContainerStyle}>
        {Array.from({ length: maxRating }, (_, i) => (
          <Star
            key={i}
            onClick={() => (dynamic ? handleSetRating(i + 1) : null)}
            full={tempRating ? tempRating > i : rating > i}
            onHoverIn={() => (dynamic ? setTempRating(i + 1) : null)}
            onHoverOut={() => (dynamic ? setTempRating(0) : null)}
            color={color}
            size={size}
            dynamic={dynamic}
          />
        ))}
      </div>
    </div>
  );
}

function Star({ onClick, full, onHoverIn, onHoverOut, color, size, dynamic }) {
  const starStyle = {
    width: `${size}px`,
    height: `${size}px`,
    color,
    display: "block",
    cursor: dynamic ? "pointer" : "default",
  };
  return (
    <span
      style={starStyle}
      onClick={onClick}
      onMouseEnter={onHoverIn}
      onMouseLeave={onHoverOut}
    >
      {full ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill={"hsl(var(--primary))"}
          stroke={"hsl(var(--primary))"}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke={"hsl(var(--primary))"}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="{2}"
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      )}
    </span>
  );
}
