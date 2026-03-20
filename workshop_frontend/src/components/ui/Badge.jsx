/** Badge – status chip.
 *  variant: "success" | "warning" | "danger" | "info" | "neutral" | "purple"
 */
const V = {
  success: "bg-[#16A34A] text-white",
  warning: "bg-[#EA580C] text-white",
  danger:  "bg-[#DC2626] text-white",
  info:    "bg-[#2563EB] text-white",
  neutral: "bg-[#475569] text-white",
  purple:  "bg-[#7C3AED] text-white",
};

const D = {
  success: "bg-white/60", warning: "bg-white/60",
  danger:  "bg-white/60", info:    "bg-white/60",
  neutral: "bg-white/60", purple:  "bg-white/60",
};

export default function Badge({ variant = "neutral", children, dot = false, className = "" }) {
  return (
    <span className={`badge ${V[variant] ?? V.neutral} ${className}`}>
      {dot && (
        <span className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full flex-shrink-0 ${D[variant] ?? D.neutral}`} />
      )}
      {children}
    </span>
  );
}
