import { useEffect, useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../../components/AppLayout";
import StatCard from "../../components/ui/StatCard";
import api from "../../api/axios";
import { QRCodeCanvas } from "qrcode.react";
import { computeLeaderboard } from "../../utils/leaderboard";

const TOTAL_SESSIONS = 11;
const EVENT_DATE = new Date("2026-03-20T09:00:00");

const SESSION_TYPE_BADGE = {
  ceremony:    { cls: "bg-[#2563EB] text-white",  label: "Ceremony"    },
  workshop:    { cls: "bg-[#7C3AED] text-white",  label: "Workshop"    },
  competition: { cls: "bg-[#EA580C] text-white",  label: "Competition" },
  evaluation:  { cls: "bg-[#059669] text-white",  label: "Evaluation"  },
};

const TIPS = [
  "Bring your student ID and registration QR code to every session.",
  "Maintain 75% attendance to qualify for the Certificate of Participation.",
  "The Drone Racing qualifier is on Day 2 — practice at Lab F from March 10.",
  "Submit your IoT project documentation at least 24 hours before evaluation.",
  "Visit the Help Desk at Main Lobby if you need to raise a support ticket.",
  "Consistency is key — showing up is half the battle toward your certificate.",
  "Review session notes within 24 hours to retain significantly more information.",
  "Work with your team — collaborative learning improves both attendance and outcomes.",
  "Stay hydrated and take short breaks between sessions to stay sharp and focused.",
  "Ask questions freely — curiosity and engagement are the foundations of innovation.",
  "Prepare a brief summary after each session; it helps during the final evaluation.",
  "Network with participants from other tracks — cross-discipline ideas lead to breakthroughs.",
];

function useCountdown(target) {
  const calc = useCallback(() => {
    const diff = target - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, over: true };
    return {
      days:    Math.floor(diff / 86400000),
      hours:   Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000)  / 60000),
      seconds: Math.floor((diff % 60000)    / 1000),
      over: false,
    };
  }, [target]);
  const [t, setT] = useState(calc);
  useEffect(() => { const id = setInterval(() => setT(calc()), 1000); return () => clearInterval(id); }, [calc]);
  return t;
}

export default function StudentDashboard() {
  const [attendance,   setAttendance]   = useState([]);
  const [tickets,      setTickets]      = useState([]);
  const [sessions,     setSessions]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [lbStudents,   setLbStudents]   = useState([]);
  const [lbAllAtt,     setLbAllAtt]     = useState([]);
  const [lbFeedbacks,  setLbFeedbacks]  = useState([]);
  const countdown = useCountdown(EVENT_DATE.getTime());
  const [tipIdx, setTipIdx] = useState(() => new Date().getDate() % TIPS.length);

  const name      = localStorage.getItem("name") || "Participant";
  const studentId = localStorage.getItem("roll_number");

  useEffect(() => {
    const id = setInterval(() => setTipIdx((i) => (i + 1) % TIPS.length), 7000);
    return () => clearInterval(id);
  }, []);

  const [studentAnnouncements, setStudentAnnouncements] = useState([]);
  const [activeTipText, setactiveTipText] = useState(null);

  useEffect(() => {
    const token   = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
    setLoading(true);
    Promise.all([
      studentId ? api.get(`/student/attendance`, { headers }) : Promise.resolve({ data: [] }),
      api.get("/student/tickets", { headers }),
      api.get("/student/schedule", { headers }),
      api.get("/student/announcements", { headers }),
      api.get("/student/tips", { headers }),
    ]).then(([a, t, sc, ann, tp]) => {
      setAttendance(a.data);
      setTickets(t.data);
      const rawSessions = Array.isArray(sc.data) ? sc.data : [];
      rawSessions.sort((x, y) => {
        if ((x.day ?? 1) !== (y.day ?? 1)) return (x.day ?? 1) - (y.day ?? 1);
        return (x.start_time ?? "").localeCompare(y.start_time ?? "");
      });
      setSessions(rawSessions);
      
      // Announcements
      setStudentAnnouncements(ann.data.slice(0, 3));
      
      // Active Tip
      const active = tp.data.find(x => x.active);
      setactiveTipText(active ? active.text : null);

    }).catch((err) => {
      console.error("Student dashboard fetch failed", err);
    }).finally(() => setLoading(false));
  }, [studentId]);

  // Leaderboard preview data
  useEffect(() => {
    const token   = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
    Promise.all([
      api.get("/student/leaderboard-students",   { headers }),
      api.get("/student/leaderboard-attendance", { headers }),
      api.get("/student/leaderboard-feedbacks",  { headers }),
    ])
      .then(([s, a, f]) => { 
        setLbStudents(s.data); 
        setLbAllAtt(a.data);
        setLbFeedbacks(f.data);
      })
      .catch(() => {});
  }, []);

  const topThree = useMemo(
    () => computeLeaderboard(lbStudents, lbAllAtt, lbFeedbacks).slice(0, 3),
    [lbStudents, lbAllAtt, lbFeedbacks]
  );


  const total    = attendance.length;
  const present  = attendance.filter((a) => a.status === "present").length;
  const pct      = Math.round((present / 7) * 100);
  const openTkts = tickets.filter((t) => t.status === "open").length;

  const stats = [
    { label: "Attendance Rate",   value: loading ? "—" : `${pct}%`,  accent: pct >= 75 ? "emerald" : "amber", icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )},
    { label: "Days Attended",     value: loading ? "—" : `${present} / 7`, accent: "blue",   icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )},
    { label: "Open Tickets",      value: loading ? "—" : openTkts,   accent: "amber",  icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
      </svg>
    )},
    { label: "Sessions Total",    value: TOTAL_SESSIONS,                      accent: "purple", icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    )},
  ];


  const ANN_TYPE = {
    important: { cls: "bg-[#DC2626] text-white",   label: "Important" },
    reminder:  { cls: "bg-amber-500 text-white",   label: "Reminder"  },
    update:    { cls: "bg-[#2563EB] text-white",   label: "Update"    },
    live:      { cls: "bg-emerald-500 text-white", label: "Live"      },
    general:   { cls: "bg-[#475569] text-white",   label: "General"   },
  };

  return (
    <AppLayout role="student" pageTitle="Dashboard">

      {/* ── Tip of the Day ── Featured banner, top of page ─────────────────── */}
      <div
        role="status"
        aria-label="Tip of the Day"
        className="card mb-5 px-5 py-4 border-l-4 border-[rgba(255,255,255,0.5)] tech-band animate-slide-down"
      >
        <div className="flex items-start gap-4">
          {/* Lightbulb icon */}
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-[#0EA5E9] to-[#8B5CF6] flex items-center justify-center shadow-[0_4px_12px_rgba(14,165,233,0.3)]">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-3 mb-1.5">
              <p className="text-[#1E3A8A] text-xs font-bold uppercase tracking-widest">Tip of the Day</p>
              {!activeTipText && (
                <span className="text-[#CBD5E1] text-[10px] flex-shrink-0">{tipIdx + 1} / {TIPS.length}</span>
              )}
            </div>
            {activeTipText ? (
              <p className="text-[#0F172A] text-sm font-medium leading-relaxed animate-fade-in">
                {activeTipText}
              </p>
            ) : (
              <p key={tipIdx} className="text-[#0F172A] text-sm font-medium leading-relaxed animate-fade-in">
                {TIPS[tipIdx]}
              </p>
            )}
          </div>

          {/* Refresh / next tip button */}
          <button
            onClick={() => setTipIdx((i) => (i + 1) % TIPS.length)}
            title="Next tip"
            className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center
              text-[#94A3B8] hover:text-[#0EA5E9] hover:bg-[#E0F2FE] transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Greeting + countdown */}
      <div className="card p-5 mb-5 tech-band hover-lift animate-slide-down">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-gradient text-[20px] font-bold">Welcome, {name}</p>
            <p className="text-[#475569] text-[13px] font-bold">
              DART 2K26 | {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })} | Sharda University
            </p>
          </div>
          {!countdown.over ? (
            <div className="flex flex-col items-end gap-1">
              <p className="text-[#1E3A8A] text-[11px] font-bold uppercase tracking-widest mb-1">Event Countdown</p>
              <div className="flex items-center gap-2">
                {[{v: countdown.days,l:"D"},{v:countdown.hours,l:"H"},{v:countdown.minutes,l:"M"},{v:countdown.seconds,l:"S"}].map(({v,l}) => (
                <div key={l} className="countdown-unit min-w-0 px-2.5 py-1.5">
                  <p className="text-white font-mono font-bold text-base leading-none">
                    {String(v).padStart(2,"0")}
                  </p>
                  <p className="text-blue-200 text-[9px] uppercase tracking-widest mt-0.5">{l}</p>
                </div>
              ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-emerald-700 text-sm font-medium">Event is Live!</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Announcements widget ── */}
      <div className="card p-5 mb-5 hover-lift animate-fade-in" style={{ animationDelay: "80ms" }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 min-w-0">
            <svg className="w-4 h-4 text-[#0EA5E9] flex-shrink-0" xmlns="http://www.w3.org/2000/svg"
              fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.158M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
            <p className="section-label-gradient">Announcements</p>
          </div>
          <Link
            to="/student/announcements"
            className="relative z-10 flex-shrink-0 text-[#0EA5E9] text-xs font-medium
              hover:text-[#3B82F6] hover:underline transition-colors">
            View all
          </Link>
        </div>

        {/* Scrollable body */}
        <div
          className="space-y-2 ann-scroll-body"
          style={{
            maxHeight: "320px",
            overflowY: "auto",
            overflowX: "hidden",
            paddingRight: "6px",
          }}
        >
          {studentAnnouncements.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <svg className="w-8 h-8 text-[#CBD5E1]" xmlns="http://www.w3.org/2000/svg"
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.158M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
              <p className="text-[#94A3B8] text-sm">No announcements yet</p>
            </div>
          ) : (
            studentAnnouncements.map((a, i) => {
              const tc = ANN_TYPE[a.type] || ANN_TYPE.general;
              return (
                <div
                  key={a.id}
                  className="flex items-start gap-3 p-3 rounded-lg border border-[#E2E8F0]
                    bg-[#F8FAFC] hover:border-[#BFDBFE] hover:bg-white
                    transition-all duration-200 animate-fade-in"
                  style={{
                    borderLeft: `3px solid ${
                      a.type === "important" ? "#DC2626" :
                      a.type === "live"      ? "#059669" :
                      a.type === "reminder"  ? "#F59E0B" : "#2563EB"
                    }`,
                    animationDelay: `${i * 70}ms`,
                    transform: `translateY(0)`,
                    opacity: 1,
                  }}
                >
                  {/* Badge */}
                  <div className="flex items-center gap-1.5 flex-shrink-0 mt-0.5">
                    {a.type === "live" && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-[glow-pulse_2s_ease-in-out_infinite] flex-shrink-0" />
                    )}
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap shadow-sm ${tc.cls}`}>
                      {tc.label}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[#0F172A] text-sm font-semibold leading-snug truncate">
                      {a.title}
                    </p>
                    {a.description && (
                      <p className="text-[#475569] text-xs mt-0.5 truncate leading-relaxed">
                        {a.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Stats */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {stats.map((s, i) => (
          <div key={s.label} className="animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
            <StatCard label={s.label} value={s.value} accent={s.accent} icon={s.icon} />
          </div>
        ))}
      </section>

      {/* Certificate readiness bar */}
      <div className="card p-4 mb-5 animate-scale-in glass-panel">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-base text-[#0EA5E9]">{pct >= 75 ? "🎓" : "📊"}</span>
            <p className="text-[#0F172A] text-sm font-medium">Certificate Readiness</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-bold ${
              pct >= 75 ? "text-emerald-600" : pct >= 50 ? "text-amber-600" : "text-red-500"
            }`}>{pct}%</span>
            <span className="text-[#94A3B8] text-xs">(75% required)</span>
          </div>
        </div>
          <div className="progress-bar">
          <div
            className={`progress-bar-fill ${
              pct >= 75 ? "bg-gradient-to-r from-emerald-400 to-emerald-600 shadow-[0_0_8px_rgba(16,185,129,0.4)]" 
              : pct >= 50 ? "bg-gradient-to-r from-amber-400 to-amber-600 shadow-[0_0_8px_rgba(245,158,11,0.4)]" 
              : "bg-gradient-to-r from-red-400 to-red-600 shadow-[0_0_8px_rgba(239,68,68,0.4)]"
            }`}
            style={{ width: `${pct}%`, animationName: 'none' }}
          />
        </div>
        <div className="relative mt-1">
          <div className="absolute left-[75%] w-px h-2 bg-[#94A3B8]" />
          <p className="absolute left-[75%] translate-x-1 text-[10px] text-[#94A3B8] font-medium">
            {pct >= 75 ? "✓ Eligible" : `${75 - pct}% more needed`}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5 mb-5">

        {/* Quick navigation */}
        <div className="card p-5 hover-lift animate-slide-left">
          <p className="section-label mb-4">Quick Navigation</p>
          <div className="space-y-2">
            {[
              { href: "/student/attendance", label: "My Attendance",  icon: "✓", sub: `${present} / 7 days marked` },
              { href: "/student/tickets",    label: "My Tickets",     icon: "🎫", sub: `${tickets.length} total` },
              { href: "/student/schedule",   label: "Event Schedule", icon: "📅", sub: "3-day programme" },
              { href: "/profile",            label: "My Profile",     icon: "👤", sub: "Edit details" },
            ].map((item, i) => (
              <Link key={item.href} to={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg
                  bg-[var(--color-surface2)] border border-[var(--color-border)] hover:border-[#7DD3FC]
                  hover:bg-[var(--color-hover)] hover:shadow-[0_2px_8px_rgba(14,165,233,0.1)] transition-all group animate-fade-in"
                style={{ animationDelay: `${i * 60}ms` }}>
                <span className="text-base">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[#0F172A] text-sm font-medium group-hover:text-[#0EA5E9]
                    transition-colors">{item.label}</p>
                  <p className="text-[#94A3B8] text-xs pb-px">{item.sub}</p>
                </div>
                <svg
                  className="w-4 h-4 text-[#CBD5E1] group-hover:text-[#0EA5E9] transition-all
                  group-hover:translate-x-0.5"
                  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </div>

        {/* Upcoming sessions */}
        <div className="card p-5 lg:col-span-2 hover-lift animate-slide-right">
          <div className="flex items-center justify-between mb-4">
            <p className="section-label">Upcoming Sessions</p>
            <Link to="/student/schedule"
              className="text-[#0EA5E9] text-xs font-medium hover:text-[#3B82F6] hover:underline transition-colors">
              View all →
            </Link>
          </div>
          {loading ? (
            <div className="space-y-2.5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse h-12 bg-[var(--color-surface2)] rounded-lg" />
              ))}
            </div>
          ) : sessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 gap-2 text-center">
              <svg className="w-8 h-8 text-[#CBD5E1]" xmlns="http://www.w3.org/2000/svg"
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-[#94A3B8] text-sm font-medium">No upcoming sessions yet</p>
              <p className="text-[#CBD5E1] text-xs">Sessions will appear here once the admin schedules them.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {sessions.slice(0, 4).map((s, i) => {
                const badge = SESSION_TYPE_BADGE[s.type] || SESSION_TYPE_BADGE.workshop;
                return (
                  <div key={s._id || i}
                    className="flex items-start gap-3 px-3 py-2.5
                      border border-[var(--color-border)] rounded-lg bg-[var(--color-surface2)]
                      hover:border-[#7DD3FC] hover:shadow-[0_2px_8px_rgba(14,165,233,0.1)] hover:bg-white transition-all animate-fade-in"
                    style={{ animationDelay: `${i * 70}ms` }}>
                    <div className="flex-shrink-0 w-14 text-center">
                      <p className="text-gradient font-mono text-xs font-bold">
                        {s.start_time || "—"}
                      </p>
                      <p className="text-[#94A3B8] text-[10px]">
                        {s.day ? `Day ${s.day}` : s.date ? s.date.slice(5) : ""}
                      </p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[#0F172A] text-sm font-medium truncate">{s.title}</p>
                      {s.venue && (
                        <p className="text-[#94A3B8] text-xs truncate">{s.venue}</p>
                      )}
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] shadow-sm font-semibold flex-shrink-0 ${badge.cls}`}>
                      {badge.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Leaderboard Preview ───*/}
      {topThree.length > 0 && (
        <div className="card hover-lift p-5 mb-5 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-base text-[#0EA5E9]">🏆</span>
              <p className="section-label-gradient">Top Students</p>
            </div>
            <Link
              to="/student/leaderboard"
              className="text-[#0EA5E9] text-xs font-medium hover:text-[#3B82F6] hover:underline transition-colors">
              View full leaderboard →
            </Link>
          </div>
          <div className="space-y-2">
            {topThree.map((entry, idx) => {
              const MEDAL = ["🥇", "🥈", "🥉"];
              const isMe  = String(entry.id) === String(studentId);
              return (
                <div
                  key={entry.id}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all
                    ${
                      isMe
                        ? "border-[#7DD3FC] bg-[var(--color-nav-active-bg)] shadow-[0_2px_8px_rgba(14,165,233,0.15)]"
                        : "border-[var(--color-border)] bg-[var(--color-surface2)] hover:border-[#7DD3FC] hover:shadow-[0_2px_8px_rgba(14,165,233,0.1)] hover:bg-white"
                    }`}
                >
                  <span className="text-2xl flex-shrink-0">{MEDAL[idx]}</span>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0EA5E9] to-[#8B5CF6] shadow-sm
                    flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {entry.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-[#0F172A] text-sm font-medium truncate">{entry.name}</p>
                      {isMe && (
                        <span className="px-1.5 py-0.5 bg-gradient-to-r from-[#0EA5E9] to-[#3B82F6] text-white text-[10px]
                          font-bold rounded-full shadow-sm flex-shrink-0">You</span>
                      )}
                    </div>
                    <p className="text-[#94A3B8] text-xs">{entry.track !== "—" ? entry.track : "General"}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-gradient font-bold text-sm tracking-wide">{entry.score}</p>
                    <p className="text-[#94A3B8] text-[10px]">pts</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </AppLayout>
  );
}
