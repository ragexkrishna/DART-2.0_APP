import { motion as Motion } from "framer-motion";

/** AlertBanner – notification bar.
 *  variant: "error" | "warning" | "info" | "success"
 */
const S = {
  error:   { wrap: "bg-[#DC2626] border-[#DC2626] text-white",  icon: "⚠", role: "alert"  },
  warning: { wrap: "bg-[#D97706] border-[#D97706] text-white",  icon: "!", role: "alert"  },
  info:    { wrap: "bg-[#1D4ED8] border-[#1D4ED8] text-white",  icon: "i", role: "status" },
  success: { wrap: "bg-[#16A34A] border-[#16A34A] text-white",  icon: "✓", role: "status" },
};

export default function AlertBanner({ variant = "error", children, onClose }) {
  const s = S[variant] ?? S.error;
  return (
    <Motion.div
      role={s.role}
      initial={{ opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className={`flex items-start gap-3 px-4 py-3 rounded-lg border text-sm ${s.wrap}`}>
      <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center font-bold text-xs mt-0.5">
        {s.icon}
      </span>
      <span className="flex-1">{children}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 opacity-50 hover:opacity-90 transition-opacity text-sm mt-0.5"
          aria-label="Dismiss"
        >
          ✕
        </button>
      )}
    </Motion.div>
  );
}
