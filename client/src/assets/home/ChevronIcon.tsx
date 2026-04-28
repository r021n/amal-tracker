import React from "react";

interface ChevronProps {
  size?: number;
  className?: string;
  direction?: "up" | "down";
}

export const ChevronIcon: React.FC<ChevronProps> = ({ 
  size = 18, 
  className = "", 
  direction = "down" 
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="black"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {direction === "down" ? (
      <path d="m6 9 6 6 6-6" />
    ) : (
      <path d="m18 15-6-6-6 6" />
    )}
  </svg>
);
