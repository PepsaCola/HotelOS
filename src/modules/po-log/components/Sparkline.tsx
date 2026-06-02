interface SparklineProps {
  color?: string;
}

export function Sparkline({ color = "#a5e0ff" }: SparklineProps) {
  return (
    <svg width="76" height="34" viewBox="0 0 76 34" fill="none" aria-hidden="true">
      <path
        d="M2 26 L12 22 L20 24 L28 16 L36 18 L46 10 L54 12 L62 6 L74 8"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M2 26 L12 22 L20 24 L28 16 L36 18 L46 10 L54 12 L62 6 L74 8 L74 34 L2 34 Z"
        fill={color}
        opacity="0.12"
      />
    </svg>
  );
}
