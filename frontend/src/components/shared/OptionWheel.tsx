import type { LucideIcon } from "lucide-react";

export interface WheelOption<T extends string> {
  value: T;
  label: string;
  Icon: LucideIcon;
}

interface OptionWheelProps<T extends string> {
  options: WheelOption<T>[];
  value: T;
  onChange: (v: T) => void;
  center?: { value: T; label: string };
  size?: number;
}

function describeSector(
  cx: number,
  cy: number,
  rOuter: number,
  rInner: number,
  startDeg: number,
  endDeg: number
) {
  // Angles in degrees where 0 = top (north), increasing clockwise.
  const start = ((startDeg - 90) * Math.PI) / 180;
  const end = ((endDeg - 90) * Math.PI) / 180;
  const x1o = cx + rOuter * Math.cos(start);
  const y1o = cy + rOuter * Math.sin(start);
  const x2o = cx + rOuter * Math.cos(end);
  const y2o = cy + rOuter * Math.sin(end);
  const x1i = cx + rInner * Math.cos(start);
  const y1i = cy + rInner * Math.sin(start);
  const x2i = cx + rInner * Math.cos(end);
  const y2i = cy + rInner * Math.sin(end);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${x1i} ${y1i} L ${x1o} ${y1o} A ${rOuter} ${rOuter} 0 ${large} 1 ${x2o} ${y2o} L ${x2i} ${y2i} A ${rInner} ${rInner} 0 ${large} 0 ${x1i} ${y1i} Z`;
}

export function OptionWheel<T extends string>({
  options,
  value,
  onChange,
  center,
  size = 260,
}: OptionWheelProps<T>) {
  const C = size / 2;
  const rOuter = size / 2 - 4;
  const rInner = center ? size * 0.22 : size * 0.06;
  const slice = 360 / options.length;
  const gap = 1.5;

  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        {options.map((opt, i) => {
          const startAngle = i * slice + gap / 2;
          const endAngle = (i + 1) * slice - gap / 2;
          const isActive = value === opt.value;
          return (
            <path
              key={opt.value}
              d={describeSector(C, C, rOuter, rInner, startAngle, endAngle)}
              fill={
                isActive
                  ? "hsl(var(--sidebar-accent))"
                  : "hsl(var(--sidebar-hover))"
              }
              stroke="hsl(var(--sidebar-border))"
              strokeWidth="1"
              onClick={() => onChange(opt.value)}
              className="cursor-pointer transition-[fill,filter] duration-200 hover:brightness-105"
            />
          );
        })}
      </svg>

      {options.map((opt, i) => {
        const midAngle = i * slice + slice / 2;
        const labelR = (rOuter + rInner) / 2;
        const rad = ((midAngle - 90) * Math.PI) / 180;
        const x = C + labelR * Math.cos(rad);
        const y = C + labelR * Math.sin(rad);
        const isActive = value === opt.value;
        return (
          <div
            key={opt.value}
            className="absolute pointer-events-none flex flex-col items-center gap-0.5 text-center"
            style={{
              left: x,
              top: y,
              transform: "translate(-50%, -50%)",
              color: isActive ? "#000" : "hsl(var(--sidebar-fg))",
            }}
          >
            <opt.Icon className="w-5 h-5" />
            <span className="text-[10px] font-semibold tracking-wider uppercase whitespace-nowrap">
              {opt.label}
            </span>
          </div>
        );
      })}

      {center && (
        <button
          onClick={() => onChange(center.value)}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center text-xs font-bold tracking-wider uppercase transition-colors"
          style={{
            width: rInner * 2 - 4,
            height: rInner * 2 - 4,
            background:
              value === center.value
                ? "hsl(var(--sidebar-accent))"
                : "hsl(var(--sidebar-surface))",
            color: value === center.value ? "#000" : "hsl(var(--sidebar-fg))",
            border: "1px solid hsl(var(--sidebar-border))",
          }}
        >
          {center.label}
        </button>
      )}
    </div>
  );
}
