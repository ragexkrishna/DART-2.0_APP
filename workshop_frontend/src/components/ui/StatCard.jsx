/** StatCard â€“ analytic metric tile.
 *  accent: "blue" | "emerald" | "amber" | "rose" | "purple" | "indigo"
 */
const ACCENT = {
  blue:    { bar:"#1E3A8A", icon:"bg-blue-50 text-blue-700",         val:"text-[#1E3A8A]"     },
  emerald: { bar:"#16A34A", icon:"bg-emerald-50 text-emerald-700",   val:"text-emerald-700"   },
  amber:   { bar:"#D97706", icon:"bg-amber-50 text-amber-700",       val:"text-amber-700"     },
  rose:    { bar:"#DC2626", icon:"bg-red-50 text-red-700",           val:"text-red-700"       },
  purple:  { bar:"#9333EA", icon:"bg-purple-50 text-purple-700",     val:"text-purple-700"   },
  indigo:  { bar:"#4F46E5", icon:"bg-indigo-50 text-indigo-700",     val:"text-indigo-700"   },
};

// legacy mapping from old accent names used in previous code
const ALIAS = { sky:"blue", sky2:"blue" };

export default function StatCard({ icon, label, value, sub, accent = "blue", loading = false }) {
  const key = ALIAS[accent] || accent;
  const c   = ACCENT[key] ?? ACCENT.blue;

  if (loading) {
    return (
      <div className="card p-5 relative overflow-hidden">
        <div className="skeleton h-10 w-10 rounded-lg mb-4" />
        <div className="skeleton h-6 w-20 mb-2" />
        <div className="skeleton h-3.5 w-28" />
      </div>
    );
  }

  return (
    <div className="card card-hover p-5 relative overflow-hidden group">
      {/* accent top bar */}
      <div className="stat-accent" style={{ backgroundColor: c.bar }} />

      <div className="flex items-start justify-between gap-3 mt-1">
        <div>
          <p className="text-[#475569] text-[11px] font-semibold uppercase tracking-widest mb-2">
            {label}
          </p>
          <p className={`text-3xl font-bold tabular-nums ${c.val}`}>{value}</p>
          {sub && <p className="text-[#475569] text-xs mt-1">{sub}</p>}
        </div>
        <span className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-lg
          ${c.icon} group-hover:scale-105 transition-transform duration-200`}>
          {icon}
        </span>
      </div>
    </div>
  );
}
