export default function MiqStoreLogo({ className = "w-full h-auto" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Arc luar */}
      <path
        d="
          M120 320
          C150 180, 280 90, 430 90
          C560 90, 660 150, 720 250
          L610 250
          C560 190, 500 160, 420 160
          C330 160, 250 210, 210 320
          Z
        "
        fill="currentColor"
      />

      {/* Arc dalam */}
      <path
        d="
          M250 320
          C300 240, 380 200, 470 200
          C560 200, 620 240, 670 320
          L560 320
          C530 280, 490 255, 440 255
          C390 255, 340 275, 305 320
          Z
        "
        fill="currentColor"
      />

      {/* Sinar kiri */}
      <path
        d="
          M535 130
          L560 35
          L590 50
          L565 145
          Z
        "
        fill="currentColor"
      />

      {/* Sinar tengah */}
      <path
        d="
          M610 115
          L710 25
          L740 55
          L635 145
          Z
        "
        fill="currentColor"
      />

      {/* Sinar kanan */}
      <path
        d="
          M650 190
          L760 155
          L745 190
          L655 220
          Z
        "
        fill="currentColor"
      />
    </svg>
  );
}
