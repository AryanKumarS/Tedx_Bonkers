export function TeamMemberX({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`absolute inset-0 w-full h-full ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
    >
      <path d="M30 20 L50 40 L70 20 L80 30 L60 50 L80 70 L70 80 L50 60 L30 80 L20 70 L40 50 L20 30 Z" />
    </svg>
  );
}
