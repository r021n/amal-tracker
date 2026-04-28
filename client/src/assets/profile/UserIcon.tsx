export const UserIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
  >
    <circle
      cx="12"
      cy="8"
      r="4"
      fill="#BAE6FD"
      stroke="black"
      strokeWidth="2"
    />
    <path
      d="M4 20C4 16.6863 7.58172 14 12 14C16.4183 14 20 16.6863 20 20"
      fill="#BAE6FD"
      stroke="black"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);
