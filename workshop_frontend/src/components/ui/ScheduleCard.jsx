/**
 * ScheduleCard — reusable card for a single schedule session.
 * Used by both AdminSchedule (read view) and student Schedule page.
 */

const SESSION_TYPES = {
  ceremony:    { label: "Ceremony",    cls: "bg-purple-50 text-purple-700 border-purple-200" },
  workshop:    { label: "Workshop",    cls: "bg-blue-50   text-blue-700   border-blue-200"   },
  competition: { label: "Competition", cls: "bg-rose-50   text-rose-700   border-rose-200"   },
  evaluation:  { label: "Evaluation",  cls: "bg-amber-50  text-amber-700  border-amber-200"  },
  break:       { label: "Break",       cls: "bg-slate-50  text-slate-500  border-slate-200"  },
  keynote:     { label: "Keynote",     cls: "bg-teal-50   text-teal-700   border-teal-200"   },
};

const TRACK_CLR = {
  Drone:     "bg-sky-100    text-sky-700",
  Robotics:  "bg-violet-100 text-violet-700",
  IoT:       "bg-emerald-100 text-emerald-700",
  Common:    "bg-slate-100  text-slate-600",
};

const STATUS_CLR = {
  Upcoming:  "bg-blue-50   text-blue-700   border-blue-200",
  Ongoing:   "bg-green-100 text-green-700  border-green-300",
  Completed: "bg-slate-100 text-slate-500  border-slate-200",
};

export default function ScheduleCard({
  title,
  description,
  track,
  startTime,   // "HH:MM" string
  endTime,
  venue,
  instructor,
  type = "workshop",
  status = "Upcoming",
  isLive = false,
  isCompleted = false,
}) {
  const badge   = SESSION_TYPES[type] ?? SESSION_TYPES.workshop;
  const trackCl = TRACK_CLR[track]   ?? TRACK_CLR.Common;
  const statCl  = STATUS_CLR[status] ?? STATUS_CLR.Upcoming;
  const isBreak = type === "break";

  return (
    <div
      className={`
        flex gap-3 sm:gap-4 items-start group transition-opacity duration-300
        ${isCompleted ? "opacity-45" : "opacity-100"}
      `}
    >
      {/* Left border accent for live sessions */}
      <div
        className={`
          flex-1 border rounded-xl p-4 transition-all
          ${isLive
            ? "border-l-4 border-l-green-500 border-green-300 bg-green-50/40"
            : isBreak
              ? "border-[#E2E8F0] bg-transparent"
              : "border-[#E2E8F0] bg-white group-hover:border-[#BFDBFE]"
          }
        `}
      >
        {/* Header row */}
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div className="flex-1 min-w-0">
            {/* Badges row */}
            <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
              {/* LIVE badge */}
              {isLive && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px]
                  font-bold bg-green-500 text-white shadow-sm">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  LIVE
                </span>
              )}
              {/* Type badge */}
              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${badge.cls}`}>
                {badge.label}
              </span>
              {/* Track badge */}
              {track && track !== "Common" && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${trackCl}`}>
                  {track}
                </span>
              )}
              {/* Status badge (only when not detected by time) */}
              {!isLive && (
                <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${statCl}`}>
                  {status}
                </span>
              )}
            </div>

            {/* Title */}
            <p className={`font-semibold text-sm leading-snug ${isBreak ? "text-[#475569]" : "text-[#0F172A]"}`}>
              {title}
            </p>

            {/* Description */}
            {description && !isBreak && (
              <p className="text-xs text-[#64748B] mt-1 line-clamp-2">{description}</p>
            )}

            {/* Meta row */}
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {/* Clock */}
              <span className="flex items-center gap-1 text-xs text-[#64748B]">
                <svg className="w-3 h-3 text-[#94A3B8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {startTime} – {endTime}
              </span>

              {/* Venue */}
              {venue && (
                <>
                  <span className="text-[#CBD5E1] text-xs">·</span>
                  <span className="flex items-center gap-1 text-xs text-[#64748B]">
                    <svg className="w-3 h-3 text-[#94A3B8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {venue}
                  </span>
                </>
              )}

              {/* Instructor */}
              {instructor && (
                <>
                  <span className="text-[#CBD5E1] text-xs">·</span>
                  <span className="flex items-center gap-1 text-xs text-[#64748B]">
                    <svg className="w-3 h-3 text-[#94A3B8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {instructor}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { SESSION_TYPES, TRACK_CLR, STATUS_CLR };
