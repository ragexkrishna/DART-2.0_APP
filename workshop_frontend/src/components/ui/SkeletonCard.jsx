/**
 * SkeletonCard – placeholder while data loads.
 * Props: rows (number of skeleton rows, default 4), className
 */
export function SkeletonCard({ rows = 4, className = "" }) {
  return (
    <div className={`glass-card p-5 space-y-3 ${className}`}>
      <div className="skeleton h-5 w-1/3 rounded" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className={`skeleton h-4 rounded ${i % 2 === 0 ? "w-full" : "w-2/3"}`} />
      ))}
    </div>
  );
}

/**
 * SkeletonTable – placeholder table rows.
 */
export function SkeletonTable({ cols = 4, rows = 6 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4 p-3 glass-card">
          {Array.from({ length: cols }).map((_, c) => (
            <div key={c} className={`skeleton h-4 rounded flex-1 ${c === 0 ? "max-w-[3rem]" : ""}`} />
          ))}
        </div>
      ))}
    </div>
  );
}
