export default function MiqStoreLogo({ className = "w-64 h-auto" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 200"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M40 170 A160 160 0 0 1 280 80 L250 110 A120 120 0 0 0 80 170 Z"
        fill="currentColor"
      />

      <path
        d="M110 170 A110 110 0 0 1 250 130 L230 150 A85 85 0 0 0 140 170 Z"
        fill="currentColor"
      />

      <polygon
        points="280,65 300,35 315,45 290,80"
        fill="currentColor"
      />

      <polygon
        points="320,50 355,30 350,75 300,115"
        fill="currentColor"
      />

      <polygon
        points="340,120 380,100 370,130 330,140"
        fill="currentColor"
      />
    </svg>
  );
}
