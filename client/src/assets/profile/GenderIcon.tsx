export const GenderIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
  >
    <circle
      cx="9"
      cy="9"
      r="5"
      fill="#FBCFE8"
      stroke="black"
      strokeWidth="2"
    />
    <circle
      cx="15"
      cy="15"
      r="5"
      fill="#A5B4FC"
      stroke="black"
      strokeWidth="2"
    />
  </svg>
);
