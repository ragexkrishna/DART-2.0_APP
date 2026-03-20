export default function AttendanceIllustration() {
  return (
    <svg
      viewBox="0 0 600 380"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="ai-bg" x1="0" y1="0" x2="600" y2="380" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#060d1f" />
          <stop offset="100%" stopColor="#0f1f4a" />
        </linearGradient>
        <linearGradient id="ai-card" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
          <stop offset="0%" stopColor="#1a3270" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#0a1228" stopOpacity="0.98" />
        </linearGradient>
        <radialGradient id="ai-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ai-drone-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
        </radialGradient>
        <filter id="ai-soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
        <clipPath id="ai-clip">
          <rect width="600" height="380" rx="16" />
        </clipPath>
      </defs>

      <g clipPath="url(#ai-clip)">

        {/* ── Background ── */}
        <rect width="600" height="380" fill="url(#ai-bg)" />

        {/* Grid pattern */}
        {Array.from({ length: 13 }).map((_, i) => (
          <line key={`vg-${i}`} x1={i * 50} y1="0" x2={i * 50} y2="380"
            stroke="#1e3a8a" strokeWidth="0.5" opacity="0.18" />
        ))}
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={`hg-${i}`} x1="0" y1={i * 50} x2="600" y2={i * 50}
            stroke="#1e3a8a" strokeWidth="0.5" opacity="0.18" />
        ))}

        {/* Central ambient glow */}
        <ellipse cx="300" cy="200" rx="220" ry="160" fill="url(#ai-glow)" />

        {/* ── Circuit traces ── */}
        <path d="M30 90 H80 Q95 90 95 75 V50" stroke="#1e40af" strokeWidth="1.5" opacity="0.5" />
        <circle cx="30" cy="90" r="3" fill="#3b82f6" opacity="0.5" />
        <circle cx="95" cy="50" r="3" fill="#3b82f6" opacity="0.5" />

        <path d="M30 280 H75 Q90 280 90 295 V330" stroke="#1e40af" strokeWidth="1.5" opacity="0.4" />
        <circle cx="30" cy="280" r="3" fill="#06b6d4" opacity="0.5" />
        <circle cx="90" cy="330" r="3" fill="#06b6d4" opacity="0.5" />

        <path d="M570 100 H525 Q510 100 510 115 V145" stroke="#1e40af" strokeWidth="1.5" opacity="0.5" />
        <circle cx="570" cy="100" r="3" fill="#3b82f6" opacity="0.5" />
        <circle cx="510" cy="145" r="3" fill="#3b82f6" opacity="0.5" />

        <path d="M570 300 H530 Q515 300 515 315 V340" stroke="#1e40af" strokeWidth="1.5" opacity="0.4" />
        <circle cx="570" cy="300" r="3" fill="#7c3aed" opacity="0.5" />

        {/* ── Drone ── */}
        {/* Drone glow */}
        <ellipse cx="300" cy="64" rx="70" ry="35" fill="url(#ai-drone-glow)" />

        {/* Rotor spin discs */}
        <ellipse cx="248" cy="44" rx="18" ry="5" fill="#60a5fa" opacity="0.35" />
        <ellipse cx="352" cy="44" rx="18" ry="5" fill="#60a5fa" opacity="0.35" />
        <ellipse cx="248" cy="72" rx="18" ry="5" fill="#60a5fa" opacity="0.35" />
        <ellipse cx="352" cy="72" rx="18" ry="5" fill="#60a5fa" opacity="0.35" />

        {/* Rotor centers */}
        <circle cx="248" cy="44" r="3.5" fill="#93c5fd" />
        <circle cx="352" cy="44" r="3.5" fill="#93c5fd" />
        <circle cx="248" cy="72" r="3.5" fill="#93c5fd" />
        <circle cx="352" cy="72" r="3.5" fill="#93c5fd" />

        {/* Arms */}
        <line x1="272" y1="53" x2="250" y2="44" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" />
        <line x1="328" y1="53" x2="350" y2="44" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" />
        <line x1="272" y1="63" x2="250" y2="72" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" />
        <line x1="328" y1="63" x2="350" y2="72" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" />

        {/* Body */}
        <rect x="272" y="46" width="56" height="24" rx="10"
          fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1.5" />
        <rect x="280" y="52" width="40" height="12" rx="4" fill="#0a1228" opacity="0.8" />
        {/* Camera lens */}
        <circle cx="300" cy="82" r="6" fill="#0a1228" stroke="#3b82f6" strokeWidth="1.5" />
        <circle cx="300" cy="82" r="3" fill="#1d4ed8" />
        <circle cx="301.5" cy="80.5" r="1" fill="#93c5fd" opacity="0.8" />
        {/* LED */}
        <circle cx="320" cy="55" r="2.5" fill="#34d399" />
        <circle cx="320" cy="55" r="4" fill="#34d399" opacity="0.2" />

        {/* Hover downwash lines */}
        <line x1="285" y1="91" x2="285" y2="97" stroke="#60a5fa" strokeWidth="1" opacity="0.4" />
        <line x1="293" y1="91" x2="293" y2="99" stroke="#60a5fa" strokeWidth="1" opacity="0.4" />
        <line x1="300" y1="91" x2="300" y2="100" stroke="#06b6d4" strokeWidth="1.5" opacity="0.5" />
        <line x1="307" y1="91" x2="307" y2="99" stroke="#60a5fa" strokeWidth="1" opacity="0.4" />
        <line x1="315" y1="91" x2="315" y2="97" stroke="#60a5fa" strokeWidth="1" opacity="0.4" />

        {/* ── Main QR card ── */}
        {/* Card shadow */}
        <rect x="182" y="116" width="236" height="196" rx="18" fill="#1e3a8a" opacity="0.15" filter="url(#ai-soft)" />
        {/* Card bg */}
        <rect x="180" y="112" width="240" height="196" rx="18"
          fill="#0d1e4a" stroke="#2563eb" strokeWidth="1.5" />
        {/* Card inner shine */}
        <rect x="180" y="112" width="240" height="60" rx="18" fill="#1e3a8a" opacity="0.3" />

        {/* Card header text */}
        <rect x="198" y="124" width="8" height="8" rx="2" fill="#3b82f6" />
        <rect x="208" y="124" width="8" height="8" rx="2" fill="#3b82f6" opacity="0.5" />
        <rect x="218" y="124" width="8" height="8" rx="2" fill="#3b82f6" opacity="0.25" />

        {/* QR tile */}
        <rect x="198" y="143" width="108" height="108" rx="10" fill="#f1f5f9" />

        {/* QR corner — top-left */}
        <rect x="206" y="151" width="26" height="26" rx="4" fill="#1e3a8a" />
        <rect x="210" y="155" width="18" height="18" rx="2" fill="#f1f5f9" />
        <rect x="214" y="159" width="10" height="10" rx="1" fill="#1e3a8a" />

        {/* QR corner — top-right */}
        <rect x="272" y="151" width="26" height="26" rx="4" fill="#1e3a8a" />
        <rect x="276" y="155" width="18" height="18" rx="2" fill="#f1f5f9" />
        <rect x="280" y="159" width="10" height="10" rx="1" fill="#1e3a8a" />

        {/* QR corner — bottom-left */}
        <rect x="206" y="217" width="26" height="26" rx="4" fill="#1e3a8a" />
        <rect x="210" y="221" width="18" height="18" rx="2" fill="#f1f5f9" />
        <rect x="214" y="225" width="10" height="10" rx="1" fill="#1e3a8a" />

        {/* QR center data dots */}
        {[
          [260,153],[266,153],[260,159],[268,161],[254,165],[262,167],[270,165],
          [256,173],[264,173],[254,183],[260,179],[268,179],[262,185],[270,183],
          [256,191],[264,193],[268,191],[254,199],[262,199],[270,199],
          [260,207],[266,211],[270,207],[256,207],[252,215],[262,215]
        ].map(([x, y], i) => (
          <rect key={i} x={x} y={y} width="4" height="4" rx="0.8" fill="#1e3a8a" opacity="0.75" />
        ))}

        {/* Scan line */}
        <rect x="201" y="194" width="102" height="3" rx="1.5" fill="#06b6d4" opacity="0.9" />
        <rect x="201" y="188" width="102" height="15" rx="4" fill="#06b6d4" opacity="0.07" />

        {/* Right side stats inside card */}
        {/* Stat 1 */}
        <rect x="320" y="143" width="82" height="38" rx="10"
          fill="#1e3a8a" stroke="#2563eb" strokeWidth="1" opacity="0.85" />
        <text x="328" y="158" fill="#93c5fd" fontSize="8.5" fontFamily="system-ui, sans-serif"
          fontWeight="600" letterSpacing="0.5">PRESENT</text>
        <text x="328" y="174" fill="#34d399" fontSize="17" fontFamily="system-ui, sans-serif"
          fontWeight="700">87%</text>

        {/* Stat 2 */}
        <rect x="320" y="188" width="82" height="38" rx="10"
          fill="#1e3a8a" stroke="#2563eb" strokeWidth="1" opacity="0.85" />
        <text x="328" y="203" fill="#93c5fd" fontSize="8.5" fontFamily="system-ui, sans-serif"
          fontWeight="600" letterSpacing="0.5">PARTICIPANTS</text>
        <text x="328" y="219" fill="#f1f5f9" fontSize="17" fontFamily="system-ui, sans-serif"
          fontWeight="700">234</text>

        {/* Verified badge */}
        <rect x="320" y="233" width="82" height="30" rx="10"
          fill="#064e3b" stroke="#10b981" strokeWidth="1" opacity="0.9" />
        <path d="M330 248 L336 254 L346 241" stroke="#34d399" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round" />
        <text x="352" y="252" fill="#6ee7b7" fontSize="10" fontFamily="system-ui, sans-serif"
          fontWeight="600">Verified</text>

        {/* ── Left floating badge — Tracks ── */}
        <rect x="62" y="130" width="100" height="50" rx="12"
          fill="#312e81" stroke="#7c3aed" strokeWidth="1.5" opacity="0.92" />
        <text x="112" y="149" fill="#c4b5fd" fontSize="9" fontFamily="system-ui, sans-serif"
          textAnchor="middle" fontWeight="600" letterSpacing="0.5">QR SESSIONS</text>
        <text x="112" y="169" fill="#a78bfa" fontSize="20" fontFamily="system-ui, sans-serif"
          textAnchor="middle" fontWeight="700">12</text>

        {/* Left floating badge — Check-ins */}
        <rect x="62" y="200" width="100" height="50" rx="12"
          fill="#1e3a45" stroke="#06b6d4" strokeWidth="1.5" opacity="0.92" />
        <text x="112" y="219" fill="#67e8f9" fontSize="9" fontFamily="system-ui, sans-serif"
          textAnchor="middle" fontWeight="600" letterSpacing="0.5">CHECK-INS</text>
        <text x="112" y="239" fill="#22d3ee" fontSize="20" fontFamily="system-ui, sans-serif"
          textAnchor="middle" fontWeight="700">203</text>

        {/* Dashed connector lines */}
        <line x1="162" y1="155" x2="180" y2="175" stroke="#7c3aed"
          strokeWidth="1" strokeDasharray="4 3" opacity="0.4" />
        <line x1="162" y1="225" x2="180" y2="235" stroke="#06b6d4"
          strokeWidth="1" strokeDasharray="4 3" opacity="0.4" />

        {/* ── Right floating badge — Live ── */}
        <rect x="438" y="120" width="110" height="50" rx="12"
          fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1.5" opacity="0.92" />
        {/* Pulse dot */}
        <circle cx="454" cy="145" r="5" fill="#ef4444" opacity="0.25" />
        <circle cx="454" cy="145" r="3" fill="#ef4444" />
        <text x="464" y="138" fill="#93c5fd" fontSize="8.5" fontFamily="system-ui, sans-serif"
          fontWeight="600" letterSpacing="0.5">LIVE TRACKING</text>
        <text x="464" y="154" fill="#22d3ee" fontSize="12" fontFamily="system-ui, sans-serif"
          fontWeight="700">● ACTIVE</text>

        {/* Right bottom badge — sessions */}
        <rect x="438" y="200" width="110" height="50" rx="12"
          fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1.5" opacity="0.92" />
        <text x="493" y="218" fill="#93c5fd" fontSize="8.5" fontFamily="system-ui, sans-serif"
          textAnchor="middle" fontWeight="600" letterSpacing="0.5">TODAY'S SESSIONS</text>
        <text x="493" y="239" fill="#f8fafc" fontSize="20" fontFamily="system-ui, sans-serif"
          textAnchor="middle" fontWeight="700">3</text>

        {/* Dashed connectors right side */}
        <line x1="420" y1="155" x2="438" y2="148" stroke="#3b82f6"
          strokeWidth="1" strokeDasharray="4 3" opacity="0.4" />
        <line x1="420" y1="230" x2="438" y2="230" stroke="#3b82f6"
          strokeWidth="1" strokeDasharray="4 3" opacity="0.4" />

        {/* Wi-Fi arcs top-right */}
        <path d="M536 52 Q546 42 556 52" stroke="#06b6d4" strokeWidth="1.5" fill="none" opacity="0.55" />
        <path d="M530 46 Q546 33 562 46" stroke="#06b6d4" strokeWidth="1.3" fill="none" opacity="0.38" />
        <path d="M524 40 Q546 24 568 40" stroke="#06b6d4" strokeWidth="1.1" fill="none" opacity="0.22" />
        <circle cx="546" cy="54" r="3" fill="#06b6d4" opacity="0.75" />

        {/* Bottom decoration dots */}
        {[180, 220, 260, 300, 340, 380, 420].map((x, i) => (
          <circle key={i} cx={x} cy={365} r="2.5" fill="#1e3a8a" opacity={0.4 + i * 0.05} />
        ))}

        {/* Bottom circuit */}
        <path d="M170 355 H240 Q255 355 255 342 V318" stroke="#1e3a8a" strokeWidth="1" opacity="0.3" />
        <path d="M430 355 H360 Q345 355 345 342 V318" stroke="#1e3a8a" strokeWidth="1" opacity="0.3" />

      </g>
    </svg>
  );
}
