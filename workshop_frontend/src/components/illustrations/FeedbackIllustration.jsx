export default function FeedbackIllustration() {
  const bars = [
    { h: 56, color: "#3b82f6", label: "Drone" },
    { h: 72, color: "#7c3aed", label: "Robot" },
    { h: 88, color: "#3b82f6", label: "IoT" },
    { h: 64, color: "#06b6d4", label: "AI" },
    { h: 80, color: "#7c3aed", label: "All" },
  ];

  return (
    <svg
      viewBox="0 0 600 380"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="fi-bg" x1="0" y1="0" x2="600" y2="380" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#060d1f" />
          <stop offset="100%" stopColor="#0f1f4a" />
        </linearGradient>
        <linearGradient id="fi-card" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
          <stop offset="0%" stopColor="#152155" stopOpacity="0.97" />
          <stop offset="100%" stopColor="#080f27" stopOpacity="0.99" />
        </linearGradient>
        <radialGradient id="fi-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#6d28d9" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#6d28d9" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="fi-glow2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </radialGradient>
        <filter id="fi-soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
        <clipPath id="fi-clip">
          <rect width="600" height="380" rx="16" />
        </clipPath>
      </defs>

      <g clipPath="url(#fi-clip)">

        {/* ── Background ── */}
        <rect width="600" height="380" fill="url(#fi-bg)" />

        {/* Grid */}
        {Array.from({ length: 13 }).map((_, i) => (
          <line key={`fvg-${i}`} x1={i * 50} y1="0" x2={i * 50} y2="380"
            stroke="#1e3a8a" strokeWidth="0.5" opacity="0.16" />
        ))}
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={`fhg-${i}`} x1="0" y1={i * 50} x2="600" y2={i * 50}
            stroke="#1e3a8a" strokeWidth="0.5" opacity="0.16" />
        ))}

        {/* Ambient glows */}
        <ellipse cx="300" cy="180" rx="200" ry="140" fill="url(#fi-glow)" />
        <ellipse cx="140" cy="260" rx="120" ry="80" fill="url(#fi-glow2)" />

        {/* ── Circuit traces ── */}
        <path d="M40 70 H80 Q95 70 95 55 V35" stroke="#1e40af" strokeWidth="1.5" opacity="0.45" />
        <circle cx="40" cy="70" r="3" fill="#3b82f6" opacity="0.5" />
        <circle cx="95" cy="35" r="3" fill="#3b82f6" opacity="0.5" />
        <path d="M40 310 H70 Q85 310 85 325 V348" stroke="#1e40af" strokeWidth="1.5" opacity="0.4" />
        <circle cx="40" cy="310" r="3" fill="#7c3aed" opacity="0.5" />
        <path d="M560 70 H530 Q515 70 515 55 V35" stroke="#1e40af" strokeWidth="1.5" opacity="0.45" />
        <circle cx="560" cy="70" r="3" fill="#06b6d4" opacity="0.5" />
        <path d="M560 310 H530 Q515 310 515 325 V348" stroke="#1e40af" strokeWidth="1.5" opacity="0.4" />

        {/* ── Main analytics card (center) ── */}
        <rect x="172" y="90" width="256" height="210" rx="18"
          fill="#0d1e4a" opacity="0.12" filter="url(#fi-soft)" />
        <rect x="170" y="88" width="260" height="210" rx="18"
          fill="#0d1e4a" stroke="#2563eb" strokeWidth="1.5" />
        {/* Card header shine */}
        <rect x="170" y="88" width="260" height="55" rx="18" fill="#1e3a8a" opacity="0.28" />

        {/* Card title dots */}
        <rect x="188" y="101" width="9" height="9" rx="2.5" fill="#3b82f6" />
        <rect x="200" y="101" width="9" height="9" rx="2.5" fill="#3b82f6" opacity="0.55" />
        <rect x="212" y="101" width="9" height="9" rx="2.5" fill="#3b82f6" opacity="0.25" />
        <text x="227" y="110" fill="#93c5fd" fontSize="9.5" fontFamily="system-ui, sans-serif"
          fontWeight="600" letterSpacing="0.8">WORKSHOP RATING</text>

        {/* ── Stars ── */}
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i} transform={`translate(${191 + i * 32}, 126)`}>
            {/* Full star polygon */}
            <polygon
              points="12,2 14.9,9.3 22.6,9.3 16.4,14 18.8,21.4 12,17 5.2,21.4 7.6,14 1.4,9.3 9.1,9.3"
              fill={i < 4 ? "#fbbf24" : "none"}
              stroke={i < 4 ? "#fbbf24" : "#fbbf24"}
              strokeWidth={i < 4 ? "0" : "1.5"}
              opacity="0.95"
            />
            {/* Half-star for index 4 */}
            {i === 4 && (
              <>
                <clipPath id="fi-half">
                  <rect x="0" y="0" width="12" height="24" />
                </clipPath>
                <polygon
                  points="12,2 14.9,9.3 22.6,9.3 16.4,14 18.8,21.4 12,17 5.2,21.4 7.6,14 1.4,9.3 9.1,9.3"
                  fill="#fbbf24"
                  clipPath="url(#fi-half)"
                  opacity="0.95"
                />
              </>
            )}
          </g>
        ))}

        {/* Rating number */}
        <text x="360" y="140" fill="#fbbf24" fontSize="26" fontFamily="system-ui, sans-serif"
          fontWeight="800">4.5</text>
        <text x="361" y="152" fill="#f59e0b" fontSize="8.5" fontFamily="system-ui, sans-serif"
          fontWeight="500">out of 5</text>

        {/* ── Bar chart inside card ── */}
        {bars.map((b, i) => {
          const bx = 188 + i * 38;
          const by = 270 - b.h;
          return (
            <g key={i}>
              {/* Bar track */}
              <rect x={bx} y={270 - 90} width="22" height="90" rx="5" fill="#0f172a" opacity="0.45" />
              {/* Bar fill */}
              <rect x={bx} y={by} width="22" height={b.h} rx="5" fill={b.color} opacity="0.75" />
              {/* Bar top glow */}
              <rect x={bx} y={by} width="22" height="6" rx="3" fill={b.color} opacity="0.4" />
              {/* Label */}
              <text x={bx + 11} y="282" fill="#64748b" fontSize="7.5"
                fontFamily="system-ui, sans-serif" textAnchor="middle">{b.label}</text>
            </g>
          );
        })}

        {/* ── Donut arc (satisfaction %) ── */}
        {/* Track */}
        <circle cx="390" cy="238" r="32" stroke="#1e3a8a" strokeWidth="8" fill="none" />
        {/* Arc ~88% = 316.8 deg of 360 = strokeDasharray = 201 of 226 (r=32, circumference≈201) */}
        <circle cx="390" cy="238" r="32" stroke="#3b82f6" strokeWidth="8" fill="none"
          strokeDasharray="177 201" strokeDashoffset="50" strokeLinecap="round" />
        <circle cx="390" cy="238" r="32" stroke="#06b6d4" strokeWidth="4" fill="none"
          strokeDasharray="40 201" strokeDashoffset="-130" strokeLinecap="round" opacity="0.5" />
        <text x="390" y="234" fill="#f1f5f9" fontSize="13" fontFamily="system-ui, sans-serif"
          fontWeight="700" textAnchor="middle">88%</text>
        <text x="390" y="246" fill="#64748b" fontSize="7.5" fontFamily="system-ui, sans-serif"
          textAnchor="middle">Satisfied</text>

        {/* ── Left bar chart floating card ── */}
        <rect x="52" y="108" width="104" height="120" rx="14"
          fill="#0d1e4a" stroke="#7c3aed" strokeWidth="1.5" opacity="0.92" />
        <text x="104" y="125" fill="#c4b5fd" fontSize="8.5" fontFamily="system-ui, sans-serif"
          textAnchor="middle" fontWeight="600" letterSpacing="0.5">RESPONSES</text>
        <text x="104" y="146" fill="#a78bfa" fontSize="22" fontFamily="system-ui, sans-serif"
          textAnchor="middle" fontWeight="700">186</text>

        {/* Mini sparkline */}
        <polyline points="64,190 75,178 86,184 97,170 108,175 120,163 131,168 142,157"
          stroke="#7c3aed" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="64,190 75,178 86,184 97,170 108,175 120,163 131,168 142,157 142,215 64,215"
          fill="#7c3aed" opacity="0.08" />
        <circle cx="142" cy="157" r="3.5" fill="#a78bfa" />

        {/* Left bottom badge — track label */}
        <rect x="52" y="248" width="104" height="50" rx="14"
          fill="#0d1e4a" stroke="#06b6d4" strokeWidth="1.5" opacity="0.92" />
        <text x="104" y="265" fill="#67e8f9" fontSize="8.5" fontFamily="system-ui, sans-serif"
          textAnchor="middle" fontWeight="600" letterSpacing="0.5">TOP TRACK</text>
        <text x="104" y="287" fill="#22d3ee" fontSize="12" fontFamily="system-ui, sans-serif"
          textAnchor="middle" fontWeight="700">Robotics</text>

        {/* Dashed connectors left */}
        <line x1="156" y1="148" x2="170" y2="165" stroke="#7c3aed"
          strokeWidth="1" strokeDasharray="4 3" opacity="0.4" />
        <line x1="156" y1="272" x2="170" y2="272" stroke="#06b6d4"
          strokeWidth="1" strokeDasharray="4 3" opacity="0.4" />

        {/* ── Right floating feedback card 1 ── */}
        <rect x="444" y="100" width="120" height="58" rx="14"
          fill="#0d1e4a" stroke="#3b82f6" strokeWidth="1.5" opacity="0.92" />
        {/* Mini stars */}
        {[0, 1, 2, 3, 4].map((i) => (
          <polygon key={i}
            points="12,2 14.9,9.3 22.6,9.3 16.4,14 18.8,21.4 12,17 5.2,21.4 7.6,14 1.4,9.3 9.1,9.3"
            fill={i < 5 ? "#fbbf24" : "#334155"}
            transform={`translate(${450 + i * 14},110) scale(0.52)`}
            opacity="0.9"
          />
        ))}
        {/* Comment lines */}
        <rect x="453" y="132" width="104" height="5" rx="2.5" fill="#1e3a8a" opacity="0.7" />
        <rect x="453" y="141" width="80" height="5" rx="2.5" fill="#1e3a8a" opacity="0.5" />

        {/* Right floating feedback card 2 */}
        <rect x="444" y="176" width="120" height="58" rx="14"
          fill="#0d1e4a" stroke="#7c3aed" strokeWidth="1.5" opacity="0.92" />
        {[0, 1, 2, 3].map((i) => (
          <polygon key={i}
            points="12,2 14.9,9.3 22.6,9.3 16.4,14 18.8,21.4 12,17 5.2,21.4 7.6,14 1.4,9.3 9.1,9.3"
            fill="#fbbf24"
            transform={`translate(${450 + i * 14},186) scale(0.52)`}
            opacity="0.9"
          />
        ))}
        <polygon
          points="12,2 14.9,9.3 22.6,9.3 16.4,14 18.8,21.4 12,17 5.2,21.4 7.6,14 1.4,9.3 9.1,9.3"
          fill="#334155"
          transform="translate(506,186) scale(0.52)"
          opacity="0.6"
        />
        <rect x="453" y="208" width="104" height="5" rx="2.5" fill="#1e3a8a" opacity="0.7" />
        <rect x="453" y="217" width="70" height="5" rx="2.5" fill="#1e3a8a" opacity="0.5" />

        {/* Right badge — avg score */}
        <rect x="444" y="252" width="120" height="50" rx="14"
          fill="#0d1e4a" stroke="#06b6d4" strokeWidth="1.5" opacity="0.92" />
        <text x="504" y="272" fill="#67e8f9" fontSize="8.5" fontFamily="system-ui, sans-serif"
          textAnchor="middle" fontWeight="600" letterSpacing="0.5">AVG SCORE</text>
        <text x="504" y="292" fill="#fbbf24" fontSize="18" fontFamily="system-ui, sans-serif"
          textAnchor="middle" fontWeight="700">4.5 ★</text>

        {/* Dashed connectors right */}
        <line x1="430" y1="155" x2="444" y2="138" stroke="#3b82f6"
          strokeWidth="1" strokeDasharray="4 3" opacity="0.4" />
        <line x1="430" y1="210" x2="444" y2="210" stroke="#7c3aed"
          strokeWidth="1" strokeDasharray="4 3" opacity="0.4" />
        <line x1="430" y1="260" x2="444" y2="270" stroke="#06b6d4"
          strokeWidth="1" strokeDasharray="4 3" opacity="0.4" />

        {/* ── Top decorative node cluster ── */}
        <circle cx="300" cy="42" r="4" fill="#3b82f6" opacity="0.6" />
        <circle cx="316" cy="38" r="2.5" fill="#7c3aed" opacity="0.5" />
        <circle cx="284" cy="38" r="2.5" fill="#06b6d4" opacity="0.5" />
        <line x1="284" y1="38" x2="300" y2="42" stroke="#3b82f6" strokeWidth="1" opacity="0.4" />
        <line x1="300" y1="42" x2="316" y2="38" stroke="#7c3aed" strokeWidth="1" opacity="0.4" />
        <line x1="300" y1="42" x2="300" y2="88" stroke="#3b82f6" strokeWidth="1"
          strokeDasharray="4 3" opacity="0.3" />

        {/* ── Bottom decoration ── */}
        {[140, 180, 220, 260, 300, 340, 380, 420, 460].map((x, i) => (
          <circle key={i} cx={x} cy={365} r="2.5" fill="#1e3a8a" opacity={0.3 + (i % 3) * 0.1} />
        ))}
        <path d="M160 355 H230 Q245 355 245 345 V312" stroke="#1e3a8a" strokeWidth="1" opacity="0.3" />
        <path d="M440 355 H370 Q355 355 355 345 V312" stroke="#1e3a8a" strokeWidth="1" opacity="0.3" />

      </g>
    </svg>
  );
}
