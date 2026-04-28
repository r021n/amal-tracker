export const ChevronDownIcon = ({ size = 16, className = "" }: { size?: number, className?: string }) => (
  <svg
    className={className}
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="3"
      d="M19 9l-7 7-7-7"
    />
  </svg>
);
