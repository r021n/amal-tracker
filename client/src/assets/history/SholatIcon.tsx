export const SholatIcon = ({ size = 14, className = "" }: { size?: number, className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22 20v-4a2 2 0 0 0-2-2h-2V8l-4-4-4 4v6h-2a2 2 0 0 0-2 2v4" />
    <path d="M6 18h4" />
    <path d="M14 18h4" />
    <path d="M12 11V7" />
  </svg>
);
