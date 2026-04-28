import React from "react";

interface CircularProgressProps {
  sholatDone: number;
  className?: string;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({ 
  sholatDone, 
  className = "" 
}) => {
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - sholatDone / 5);

  return (
    <svg className={`h-full w-full -rotate-90 ${className}`}>
      <circle
        cx="28"
        cy="28"
        r={radius}
        stroke="black"
        strokeWidth="5"
        fill="white"
      />
      <circle
        cx="28"
        cy="28"
        r={radius}
        stroke="#10b981"
        strokeWidth="5"
        fill="transparent"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-1000 ease-in-out"
      />
    </svg>
  );
};
