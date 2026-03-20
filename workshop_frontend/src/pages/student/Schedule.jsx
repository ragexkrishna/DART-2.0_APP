import { useState, useEffect, useMemo } from "react";
import AppLayout from "../../components/AppLayout";
import AlertBanner from "../../components/ui/AlertBanner";
import EmptyState  from "../../components/ui/EmptyState";
import ScheduleCard, { SESSION_TYPES } from "../../components/ui/ScheduleCard";
import api from "../../api/axios";

/* ── helpers ─────────────────────────────────────────────── */
const token = () => localStorage.getItem("token");
const authH  = () => ({ headers: { Authorization: `Bearer ${token()}` } });

function fmtDate(d) {
  if (!d) return "Undated";
  const dt = new Date(d + "T00:00:00");
  return dt.toLocaleDateString("en-GB", { weekday: "long", day: "2-digit", month: "long", year: "numeric" });
}

function isToday(d) {
  return d === new Date().toISOString().slice(0, 10);
}

function nowHM() {
  return new Date().toTimeString().slice(0, 5);
}

function SkeletonCard() {
  return (
    <div className="animate-pulse border border-[#F1F5F9] rounded-xl p-4 bg-white">
      <div className="flex gap-2 mb-3">
        <div className="h-4 bg-slate-200 rounded w-20" />
        <div className="h-4 bg-slate-200 rounded w-16" />
      </div>
      <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
      <div className="h-3 bg-slate-100 rounded w-1/2" />
    </div>
  );
}

function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs mb-5">
      {Object.values(SESSION_TYPES).map((t) => (
        <span key={t.label} className={`px-2 py-0.5 rounded border text-[10px] font-semibold ${t.cls}`}>
          {t.label}
        </span>
      ))}
    </div>
  );
}

const TRACKS = ["All", "Common", "Drone", "Robotics", "IoT"];

/* ══ StudentSchedule ═════════════════════════════════════════ */
export default function Schedule() {
  const [sessions,      setSessions]     = useState([]);
  const [loading,       setLoading]      = useState(true);
  const [error,         setError]        = useState("");
  const [search,        setSearch]       = useState("");
  const [trackF,        setTrackF]       = useState("All");
  const [activeDateKey, setActiveDateKey] = useState(null);
  const [now,           setNow]          = useState(nowHM());

  /* Tick every 30s to refresh LIVE state */
  useEffect(() => {
    const id = setInterval(() => setNow(nowHM()), 30_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true); setError("");
      try {
        const res  = await api.get("/student/schedule", authH());
        const data = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.schedules) ? res.data.schedules : [];
        data.sort((a, b) => {
          const d = (a.date ?? "").localeCompare(b.date ?? "");
          return d !== 0 ? d : (a.start_time ?? "").localeCompare(b.start_time ?? "");
        });
        setSessions(data);

        const today = new Date().toISOString().slice(0, 10);
        const dates = [...new Set(data.map(s => s.date ?? "Undated"))].sort();
        setActiveDateKey(dates.includes(today) ? today : (dates[0] ?? null));
      } catch (e) {
        console.log("[Schedule] load error:", e?.response?.data || e.message);
        setError(e?.response?.data?.error ?? "Failed to load schedule. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  /* Live / completed helper */
  const liveStatus = (s) => {
    const today = new Date().toISOString().slice(0, 10);
    const isLive = s.date === today && now >= s.start_time && now <= s.end_time;
    const isCompleted = s.status === "Completed" ||
      (s.date === today && now > s.end_time) ||
      (s.date < today && s.date !== today);
    return { isLive, isCompleted };
  };

  const dates = useMemo(
    () => [...new Set(sessions.map(s => s.date ?? "Undated"))].sort(),
    [sessions]
  );

  const activeSessions = useMemo(() => {
    if (!activeDateKey) return [];
    const q = search.toLowerCase();
    return sessions.filter(s => {
      if ((s.date ?? "Undated") !== activeDateKey) return false;
      if (trackF !== "All" && s.track !== trackF)  return false;
      if (q) return `${s.title} ${s.venue} ${s.instructor}`.toLowerCase().includes(q);
      return true;
    });
  }, [sessions, activeDateKey, search, trackF]);

  /* Live counts per date (for tab badge) */
  const liveCounts = useMemo(() => {
    const map = {};
    sessions.forEach(s => {
      const d = s.date ?? "Undated";
      if (!map[d]) map[d] = 0;
      if (liveStatus(s).isLive) map[d]++;
    });
    return map;
  }, [sessions, now]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AppLayout role="student" pageTitle="Event Schedule">
      {error && (
        <div className="mb-4">
          <AlertBanner variant="error" onClose={() => setError("")}>{error}</AlertBanner>
        </div>
      )}

      {/* Intro card */}
      <div className="card p-4 mb-5 flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-[#DBEAFE] flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-[#1E3A8A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-[#0F172A]">DART 2K26 – Full Event Schedule</p>
          <p className="text-xs text-[#64748B] mt-0.5">
            Browse sessions by day. Sessions marked{" "}
            <span className="font-semibold text-green-600">LIVE</span> are currently running.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : sessions.length === 0 ? (
        <EmptyState
          title="No sessions scheduled yet"
          message="The event schedule will appear here once sessions are added by the organiser."
        />
      ) : (
        <>
          {/* Day tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 mb-4" style={{ scrollbarWidth: "none" }}>
            {dates.map(d => {
              const isAct = d === activeDateKey;
              const live  = liveCounts[d] ?? 0;
              const today = isToday(d);
              return (
                <button key={d} onClick={() => setActiveDateKey(d)}
                  className={`
                    flex flex-col items-center px-4 py-2.5 rounded-xl border flex-shrink-0
                    text-sm font-medium transition-all duration-150
                    ${isAct
                      ? "bg-[#1E3A8A] text-white border-[#1E3A8A] shadow"
                      : "bg-white text-[#475569] border-[#E2E8F0] hover:text-[#0F172A] hover:border-[#BFDBFE]"
                    }
                  `}>
                  <span className="font-semibold text-xs">
                    {today ? "Today" : new Date(d + "T00:00:00").toLocaleDateString("en-GB", { weekday: "short" })}
                  </span>
                  <span className={`text-[10px] mt-0.5 ${isAct ? "text-blue-200" : "text-[#94A3B8]"}`}>
                    {new Date(d + "T00:00:00").toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
                  </span>
                  {live > 0 && (
                    <span className="mt-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-green-400 text-white leading-none">
                      {live} LIVE
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Search + Track filter */}
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]"
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1116.65 2a7.5 7.5 0 010 14.65z" />
              </svg>
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search sessions…"
                className="w-full pl-9 pr-4 py-2 border border-[#E2E8F0] rounded-lg text-sm
                  focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/15 bg-white" />
            </div>
            <select value={trackF} onChange={e => setTrackF(e.target.value)}
              className="border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm bg-white
                focus:outline-none focus:border-[#3B82F6]">
              {TRACKS.map(t => <option key={t} value={t}>{t === "All" ? "All Tracks" : t}</option>)}
            </select>
          </div>

          {/* Legend */}
          <Legend />

          {/* Date heading */}
          <div className="flex items-center gap-3 mb-3">
            <p className="text-sm font-bold text-[#1E3A8A]">
              {isToday(activeDateKey) ? "Today — " : ""}{fmtDate(activeDateKey)}
            </p>
            <div className="flex-1 h-px bg-[#E2E8F0]" />
          </div>

          {/* Sessions timeline */}
          {activeSessions.length === 0 ? (
            <p className="text-sm text-[#94A3B8] text-center py-8">
              No sessions match your filters for this day.
            </p>
          ) : (
            <div className="relative pl-0 sm:pl-[64px]">
              <div className="absolute left-[28px] top-0 bottom-0 w-px bg-[#E2E8F0] hidden sm:block" />
              <div className="space-y-3">
                {activeSessions.map((s, i) => {
                  const { isLive, isCompleted } = liveStatus(s);
                  return (
                    <div key={s.id ?? i} className="relative">
                      {/* Time (desktop) */}
                      <div className="hidden sm:flex absolute left-[-64px] top-4 flex-col items-end w-[44px]">
                        <span className="text-[#94A3B8] font-mono text-[10px]">{s.start_time}</span>
                      </div>
                      {/* Dot (desktop) */}
                      <div className="hidden sm:block absolute left-[-14px] top-[18px] z-10">
                        <div className={`w-2.5 h-2.5 rounded-full border-2 ${
                          isLive
                            ? "bg-green-400 border-green-500 shadow-sm shadow-green-300"
                            : isCompleted
                              ? "bg-[#CBD5E1] border-[#94A3B8]"
                              : "bg-[#1E3A8A] border-[#3B82F6]"
                        }`} />
                      </div>
                      <ScheduleCard
                        title={s.title}
                        description={s.description}
                        track={s.track}
                        startTime={s.start_time}
                        endTime={s.end_time}
                        venue={s.venue}
                        instructor={s.instructor}
                        type={s.type}
                        status={s.status}
                        isLive={isLive}
                        isCompleted={isCompleted}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </AppLayout>
  );
}
