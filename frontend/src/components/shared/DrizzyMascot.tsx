import { useEffect, useRef } from "react";

interface DrizzyMascotProps {
  className?: string;
}

const LEFT_EYE = { x: 42, y: 32 };
const RIGHT_EYE = { x: 58, y: 32 };
const MAX_PUPIL_OFFSET = 2.5; // SVG units — keeps pupil inside the white
const SHINE_DX = 1.0;
const SHINE_DY = -1.3;

function offsetToward(eyeX: number, eyeY: number, x: number, y: number) {
  const dx = x - eyeX;
  const dy = y - eyeY;
  const dist = Math.hypot(dx, dy);
  if (dist === 0) return { x: 0, y: 0 };
  const scale = Math.min(dist, MAX_PUPIL_OFFSET) / dist;
  return { x: dx * scale, y: dy * scale };
}

/**
 * Small front-facing dinosaur mascot. The right arm waves in a loop;
 * the pupils + eye shines track the cursor in real time.
 */
export function DrizzyMascot({ className }: DrizzyMascotProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const leftPupilRef = useRef<SVGCircleElement>(null);
  const rightPupilRef = useRef<SVGCircleElement>(null);
  const leftShineRef = useRef<SVGCircleElement>(null);
  const rightShineRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    let raf = 0;
    let lastX = 0;
    let lastY = 0;

    const apply = (
      pupil: SVGCircleElement | null,
      shine: SVGCircleElement | null,
      eye: { x: number; y: number },
      off: { x: number; y: number }
    ) => {
      if (pupil) {
        pupil.setAttribute("cx", String(eye.x + off.x));
        pupil.setAttribute("cy", String(eye.y + off.y));
      }
      if (shine) {
        shine.setAttribute("cx", String(eye.x + off.x + SHINE_DX));
        shine.setAttribute("cy", String(eye.y + off.y + SHINE_DY));
      }
    };

    const update = () => {
      raf = 0;
      const svg = svgRef.current;
      if (!svg) return;
      const ctm = svg.getScreenCTM();
      if (!ctm) return;
      const pt = svg.createSVGPoint();
      pt.x = lastX;
      pt.y = lastY;
      const local = pt.matrixTransform(ctm.inverse());
      const leftOff = offsetToward(LEFT_EYE.x, LEFT_EYE.y, local.x, local.y);
      const rightOff = offsetToward(RIGHT_EYE.x, RIGHT_EYE.y, local.x, local.y);
      apply(leftPupilRef.current, leftShineRef.current, LEFT_EYE, leftOff);
      apply(rightPupilRef.current, rightShineRef.current, RIGHT_EYE, rightOff);
    };

    const handle = (e: MouseEvent) => {
      lastX = e.clientX;
      lastY = e.clientY;
      if (!raf) raf = requestAnimationFrame(update);
    };

    window.addEventListener("mousemove", handle, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handle);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox="12 2 76 80"
      preserveAspectRatio="xMidYMin meet"
      overflow="hidden"
      style={{ overflow: "hidden" }}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Tail peeking out */}
      <path
        d="M22 76 Q10 78 14 90 Q24 86 30 80 Z"
        fill="hsl(var(--sidebar-accent))"
        stroke="#0a0a0a"
        strokeWidth="1"
        strokeLinejoin="round"
      />

      {/* Static left arm */}
      <path
        d="M26 62 Q16 68 20 82 Q30 80 34 70 Q36 64 32 60 Z"
        fill="hsl(var(--sidebar-accent))"
        stroke="#0a0a0a"
        strokeWidth="1"
        strokeLinejoin="round"
      />

      {/* Body */}
      <ellipse
        cx="50"
        cy="71"
        rx="21"
        ry="23"
        fill="hsl(var(--sidebar-accent))"
        stroke="#0a0a0a"
        strokeWidth="1"
      />

      {/* Belly */}
      <ellipse cx="50" cy="79" rx="14" ry="13" fill="#fafafa" />

      {/* Belly scale lines */}
      <path d="M41 72 Q50 73.5 59 72" stroke="#0a0a0a" strokeWidth="0.5" fill="none" opacity="0.35" />
      <path d="M39 76 Q50 77.5 61 76" stroke="#0a0a0a" strokeWidth="0.5" fill="none" opacity="0.35" />
      <path d="M41 80 Q50 81.5 59 80" stroke="#0a0a0a" strokeWidth="0.5" fill="none" opacity="0.35" />

      {/* Legs */}
      <ellipse
        cx="40"
        cy="98"
        rx="7"
        ry="6"
        fill="hsl(var(--sidebar-accent))"
        stroke="#0a0a0a"
        strokeWidth="2"
      />
      <ellipse
        cx="60"
        cy="98"
        rx="7"
        ry="6"
        fill="hsl(var(--sidebar-accent))"
        stroke="#0a0a0a"
        strokeWidth="2"
      />

      {/* Spike crest */}
      <path
        d="M36 19 L42 10 L46 18 L50 10 L54 18 L58 10 L64 19"
        fill="hsl(var(--sidebar-accent))"
        stroke="#0a0a0a"
        strokeWidth="1"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Head */}
      <ellipse
        cx="50"
        cy="35"
        rx="22"
        ry="18"
        fill="hsl(var(--sidebar-accent))"
        stroke="#0a0a0a"
        strokeWidth="1"
      />

      {/* Cheek spikes — small horns sticking out of the head sides */}
      <path
        d="M28 38 L22 36 L27 33 Z"
        fill="hsl(var(--sidebar-accent))"
        stroke="#0a0a0a"
        strokeWidth="0.5"
        strokeLinejoin="round"
      />
      <path
        d="M72 38 L78 36 L73 33 Z"
        fill="hsl(var(--sidebar-accent))"
        stroke="#0a0a0a"
        strokeWidth="0.5"
        strokeLinejoin="round"
      />

      {/* Brow ridges — small dark slants above each eye */}
      <path d="M37 26 Q41 24 46 26" fill="none" stroke="#0a0a0a" strokeWidth="1" strokeLinecap="round" />
      <path d="M54 26 Q59 24 63 26" fill="none" stroke="#0a0a0a" strokeWidth="1" strokeLinecap="round" />

      {/* Eye whites */}
      <circle cx={LEFT_EYE.x} cy={LEFT_EYE.y} r="5.5" fill="#fafafa" stroke="#0a0a0a" strokeWidth="1.5" />
      <circle cx={RIGHT_EYE.x} cy={RIGHT_EYE.y} r="5.5" fill="#fafafa" stroke="#0a0a0a" strokeWidth="1.5" />

      {/* Pupils — track the cursor */}
      <circle ref={leftPupilRef} cx={LEFT_EYE.x} cy={LEFT_EYE.y} r="2.6" fill="#0a0a0a" />
      <circle ref={rightPupilRef} cx={RIGHT_EYE.x} cy={RIGHT_EYE.y} r="2.6" fill="#0a0a0a" />

      {/* Eye shines — ride along with the pupils */}
      <circle ref={leftShineRef} cx={LEFT_EYE.x + SHINE_DX} cy={LEFT_EYE.y + SHINE_DY} r="0.9" fill="#fafafa" />
      <circle ref={rightShineRef} cx={RIGHT_EYE.x + SHINE_DX} cy={RIGHT_EYE.y + SHINE_DY} r="0.9" fill="#fafafa" />

      {/* Nostrils */}
      <ellipse cx="46" cy="40" rx="0.7" ry="0.5" fill="#0a0a0a" />
      <ellipse cx="54" cy="40" rx="0.7" ry="0.5" fill="#0a0a0a" />

      {/* Smile */}
      <path
        d="M42 44 Q50 52 58 44"
        fill="none"
        stroke="#0a0a0a"
        strokeWidth="1"
        strokeLinecap="round"
      />

      {/* Cap — black in light mode, white in dark mode (.drizzy-cap-fill) */}
      <ellipse
        cx="50"
        cy="22"
        rx="25"
        ry="2.5"
        className="drizzy-cap-fill"
      />
      <path
        d="M30 20 L70 20 Q73 4 50 4 Q27 4 30 20 Z"
        className="drizzy-cap-fill"
      />
      {/* Side vent eyelets */}
      <circle cx="36" cy="13" r="0.55" fill="#707070" />
      <circle cx="64" cy="13" r="0.55" fill="#707070" />
      {/* Green sweatband stripe at base of dome */}
      <rect x="31" y="18" width="38" height="0.7" fill="hsl(var(--sidebar-accent))" />
      {/* Brim underside trim — thin green line */}
      <path d="M25 23.4 Q50 24.8 75 23.4" stroke="hsl(var(--sidebar-accent))" strokeWidth="0.55" fill="none" />
      {/* Top snap button */}
      <circle cx="50" cy="5" r="1.2" fill="hsl(var(--sidebar-accent))" stroke="#0a0a0a" strokeWidth="0.4" />
      {/* Green "Drippy" wordmark */}
      <text
        x="50"
        y="14"
        textAnchor="middle"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize="4.8"
        fontWeight="800"
        letterSpacing="0.15"
        fill="white"
      >
        Drippy
      </text>

      {/* Waving right arm — pivots at the shoulder */}
      <g>
        <path
          d="M72 60 Q86 48 82 36 Q74 40 68 52 Z"
          fill="hsl(var(--sidebar-accent))"
          stroke="#0a0a0a"
          strokeWidth="1"
          strokeLinejoin="round"
        />
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="-10 72 60; 30 72 60; -10 72 60"
          keyTimes="0; 0.5; 1"
          dur="1.4s"
          repeatCount="indefinite"
          calcMode="spline"
          keySplines="0.5 0 0.5 1; 0.5 0 0.5 1"
        />
      </g>
    </svg>
  );
}
