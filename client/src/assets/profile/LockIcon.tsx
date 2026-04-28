export const LockIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
  >
    <rect
      x="5"
      y="11"
      width="14"
      height="10"
      rx="2"
      fill="#FEF08A"
      stroke="black"
      strokeWidth="2"
    />
    <path
      d="M8 11V7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7V11"
      stroke="black"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="12" cy="16" r="1.5" fill="black" />
  </svg>
);
