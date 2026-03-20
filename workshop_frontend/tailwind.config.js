/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        dart: {
          bg:       "#F8FAFC",
          surface:  "#FFFFFF",
          surface2: "#F1F5F9",
          border:   "#E2E8F0",
          "border-strong": "#CBD5E1",
          hover:    "#F0F9FF",
          text:     "#0F172A",
          muted:    "#475569",
          dim:      "#94A3B8",
          primary:  "#0EA5E9",
          "primary-hov":   "#0284C7",
          "primary-light": "#E0F2FE",
          secondary:        "#8B5CF6",
          "secondary-light":"#EDE9FE",
          success:  "#10B981",
          "success-light": "#D1FAE5",
          warning:  "#F59E0B",
          "warning-light": "#FEF3C7",
          error:    "#EF4444",
          "error-light":   "#FEE2E2",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      animation: {
        "fade-in":     "fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        "slide-left":  "slideInLeft 0.35s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        "slide-right": "slideInRight 0.35s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        "slide-up":    "slideUp 0.35s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        "scale-in":    "scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
        shimmer:       "shimmer 2s infinite linear",
        "pulse-slow":  "pulse 3s cubic-bezier(0.4,0,0.6,1) infinite",
        "glow-pulse":  "glowPulse 2.5s ease-in-out infinite",
        "spin-slow":   "spin 3s linear infinite",
        "bounce-sm":   "bounceSm 0.6s ease",
        float:         "float 4s ease-in-out infinite",
        "reveal-up":   "revealUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        "bar-grow":    "barGrow 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        "scan-line":   "scanLine 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%":   { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInLeft: {
          "0%":   { opacity: "0", transform: "translateX(-16px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideInRight: {
          "0%":   { opacity: "0", transform: "translateX(16px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideUp: {
          "0%":   { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%":   { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        bounceSm: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%":      { transform: "translateY(-4px)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-6px)" },
        },
        revealUp: {
          "0%":   { opacity: "0", transform: "translateY(24px) scale(0.97)" },
          "100%": { opacity: "1", transform: "translateY(0)    scale(1)" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(14,165,233,0)" },
          "50%":      { boxShadow: "0 0 0 4px rgba(14,165,233,0.15)" },
        },
        barGrow: {
          "0%":   { width: "0%" },
          "100%": { width: "var(--bar-w, 100%)" },
        },
        scanLine: {
          "0%":   { top: "8px",  opacity: "0.9" },
          "50%":  { top: "calc(100% - 8px)", opacity: "0.9" },
          "51%":  { opacity: "0" },
          "100%": { top: "8px",  opacity: "0" },
        },
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      boxShadow: {
        "card":         "0 4px 20px -2px rgba(0,0,0,0.03), 0 0 3px rgba(0,0,0,0.05)",
        "card-hover":   "0 12px 28px -4px rgba(0,0,0,0.06), 0 0 4px rgba(14,165,233,0.3)",
        "blue-focus":   "0 0 0 3px rgba(14,165,233,0.25)",
        "blue-glow":    "0 0 15px 0 rgba(14,165,233,0.4)",
        inner:          "inset 0 0 0 1px rgba(14,165,233,0.15)",
        "glass":        "0 4px 30px rgba(0, 0, 0, 0.1)",
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(14,165,233,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(14,165,233,0.04) 1px,transparent 1px)",
        shimmer:
          "linear-gradient(90deg,#E2E8F0 25%,#F8FAFC 50%,#E2E8F0 75%)",
        "tech-gradient": "linear-gradient(135deg, #0EA5E9 0%, #8B5CF6 100%)",
      },
      backgroundSize: { grid: "40px 40px" },
    },
  },
  plugins: [],
};
