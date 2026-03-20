import { useEffect, useState, useCallback } from "react";
import AppLayout from "../../components/AppLayout";
import StatCard from "../../components/ui/StatCard";
import EmptyState from "../../components/ui/EmptyState";
import api from "../../api/axios";

const EVENT_DATE = new Date("2026-03-20T09:00:00");

const TRACKS = [
  { name: "Drone Racing",         color: "bg-blue-500",    seats: "0/150", pct: 0 },
  { name: "Robotics Challenge",   color: "bg-emerald-500", seats: "0/120",  pct: 0 },
  { name: "IoT Innovation",       color: "bg-amber-500",   seats: "0/130",  pct: 0 },
];

const QUICK_ACTIONS = [
  { label: "Manage Students",  href: "/admin/students",    icon: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
  )},
  { label: "Support Tickets",  href: "/admin/tickets",     icon: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
      d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
  )},
  { label: "Event Schedule",   href: "/admin/schedule",    icon: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  )},
];

const TYPE_CONFIG = {
  important: { label: "Important", cls: "bg-[#DC2626] text-white"   },
  reminder:  { label: "Reminder",  cls: "bg-amber-500 text-white"   },
  update:    { label: "Update",    cls: "bg-[#2563EB] text-white"   },
  live:      { label: "Live",      cls: "bg-emerald-500 text-white" },
  general:   { label: "General",   cls: "bg-[#475569] text-white"   },
};

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

export default function AdminDashboard() {
  const [students,   setStudents]   = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [tickets,    setTickets]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const countdown = useCountdown(EVENT_DATE.getTime());

  /* ── Announcement state ── */
  const [announcements, setAnnouncements] = useState([]);
  const [showAForm,  setShowAForm]  = useState(false);
  const [editingA,   setEditingA]   = useState(null);
  const [aForm,      setAForm]      = useState({ title: "", description: "", type: "general", visibility: "all" });

  /* ── Tip state ── */
  const [tips,       setTips]       = useState([]);
  const [showTForm,  setShowTForm]  = useState(false);
  const [newTipText, setNewTipText] = useState("");

  const fetchAnnouncements = useCallback(async () => {
    const token = localStorage.getItem("token");
    try {
      const r = await api.get("/admin/announcements", { headers: { Authorization: `Bearer ${token}` } });
      setAnnouncements(r.data);
    } catch (err) { console.error("Failed to fetch announcements", err); }
  }, []);

  const fetchTips = useCallback(async () => {
    const token = localStorage.getItem("token");
    try {
      const r = await api.get("/admin/tips", { headers: { Authorization: `Bearer ${token}` } });
      setTips(r.data);
    } catch (err) { console.error("Failed to fetch tips", err); }
  }, []);

  const submitAnnouncement = async () => {
    if (!aForm.title.trim()) return;
    const token = localStorage.getItem("token");
    try {
      if (editingA !== null) {
        await api.put(`/admin/announcements/${editingA}`, aForm, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await api.post("/admin/announcements", aForm, { headers: { Authorization: `Bearer ${token}` } });
      }
      fetchAnnouncements();
      setAForm({ title: "", description: "", type: "general", visibility: "all" });
      setShowAForm(false);
      setEditingA(null);
    } catch (err) { console.error("Failed to submit announcement", err); }
  };

  const deleteAnnouncement = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await api.delete(`/admin/announcements/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchAnnouncements();
    } catch (err) { console.error("Failed to delete announcement", err); }
  };

  const startEditA = (a) => {
    setAForm({ title: a.title, description: a.description, type: a.type, visibility: a.visibility || "all" });
    setEditingA(a.id);
    setShowAForm(true);
  };

  const addTip = async () => {
    if (!newTipText.trim()) return;
    const token = localStorage.getItem("token");
    try {
      await api.post("/admin/tips", { text: newTipText.trim() }, { headers: { Authorization: `Bearer ${token}` } });
      setNewTipText("");
      fetchTips();
    } catch (err) { console.error("Failed to add tip", err); }
  };

  const deleteTip = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await api.delete(`/admin/tips/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchTips();
    } catch (err) { console.error("Failed to delete tip", err); }
  };

  const setActiveTip = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await api.patch(`/admin/tips/${id}/active`, {}, { headers: { Authorization: `Bearer ${token}` } });
      fetchTips();
    } catch (err) { console.error("Failed to set active tip", err); }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
    setLoading(true);
    Promise.all([
      api.get("/admin/students",   { headers }),
      api.get("/admin/attendance", { headers }),
      api.get("/admin/tickets",    { headers }),
      api.get("/admin/announcements", { headers }),
      api.get("/admin/tips", { headers }),
    ]).then(([s, a, t, ann, tp]) => {
      setStudents(s.data);
      setAttendance(a.data);
      setTickets(t.data);
      setAnnouncements(ann.data);
      setTips(tp.data);
    }).catch((err) => {
      console.error("Dashboard data fetch failed", err);
    }).finally(() => setLoading(false));
  }, []);

  const presentToday = attendance.filter((a) => {
    const today = new Date().toISOString().slice(0, 10);
    return a.date === today && a.status === "present";
  }).length;

  const openTickets = tickets.filter((t) => t.status === "open").length;

  /* Daily attendance for the past 5 days (derived from records) */
  const attendanceByDay = (() => {
    const map = {};
    attendance.forEach((r) => {
      if (!map[r.date]) map[r.date] = { present: 0, total: 0 };
      map[r.date].total++;
      if (r.status === "present") map[r.date].present++;
    });
    return Object.entries(map)
      .sort(([a],[b]) => a.localeCompare(b))
      .slice(-5)
      .map(([date, v]) => ({ date: date.slice(5), pct: v.total > 0 ? Math.round((v.present / v.total) * 100) : 0 }));
  })();

  const stats = [
    { label: "Registered",    value: loading ? "—" : students.length, accent: "blue",    icon:(
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )},
    { label: "Present Today", value: loading ? "—" : presentToday,    accent: "emerald", icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )},
    { label: "Open Tickets",  value: loading ? "—" : openTickets,     accent: "amber",   icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
      </svg>
    )},
    { label: "Tracks Active", value: "3",                              accent: "purple",  icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    )},
  ];

  return (
    <AppLayout role="admin" pageTitle="Dashboard">

      {/* Event Countdown Banner */}
      <div className="card tech-band hover-lift p-4 mb-5 animate-slide-down flex flex-col sm:flex-row
        items-center justify-between gap-4">
        <div>
          <p className="text-gradient text-[18px] font-bold uppercase tracking-widest mb-0.5">Event Countdown</p>
          <p className="text-[#475569] text-[13px] font-bold">
              DART 2K26 | {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })} | Sharda University
            </p>
        </div>
        {!countdown.over ? (
          <div className="flex items-center gap-2">
            {[{v: countdown.days, l:"Days"},{v: countdown.hours, l:"Hrs"},{v: countdown.minutes, l:"Min"},{v: countdown.seconds, l:"Sec"}].map(({v,l}) => (
              <div key={l} className="countdown-unit">
                <p className="text-white font-mono font-bold text-lg leading-none">
                  {String(v).padStart(2,"0")}
                </p>
                <p className="text-blue-200 text-[9px] uppercase tracking-widest mt-0.5">{l}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-[glow-pulse_2s_ease-in-out_infinite]" />
            <span className="text-emerald-500 text-sm font-bold shadow-sm">Event is Live!</span>
          </div>
        )}
      </div>

      {/* Stats */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {stats.map((s, i) => (
          <div key={s.label} className="animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
            <StatCard label={s.label} value={s.value} accent={s.accent} icon={s.icon} />
          </div>
        ))}
      </section>

      <div className="grid lg:grid-cols-3 gap-5 mb-5">
        {/* Quick Actions */}
        <div className="card p-5 hover-lift animate-fade-in delay-100">
          <p className="section-label-gradient mb-4">Quick Actions</p>
          <div className="grid grid-cols-2 gap-2.5">
            {QUICK_ACTIONS.map((qa) => (
              <a key={qa.label} href={qa.href}
                className="flex flex-col items-center gap-2 p-3 rounded-lg
                  bg-[var(--color-surface2)] border border-[var(--color-border)] hover:border-[#0EA5E9]
                  hover:bg-[var(--color-hover)] hover:shadow-[0_2px_8px_rgba(14,165,233,0.1)] cursor-pointer transition-all group text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#0EA5E9]
                  group-hover:text-[#3B82F6] transition-colors" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">{qa.icon}</svg>
                <span className="text-[#94A3B8] text-[11px] font-medium leading-tight group-hover:text-[#0EA5E9]
                  transition-colors">{qa.label}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Competition Tracks */}
        <div className="card p-5 hover-lift animate-fade-in delay-150">
          <p className="section-label mb-4">Competition Tracks</p>
          <div className="space-y-4">
            {TRACKS.map((t, i) => (
              <div key={t.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${t.color} drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]`} />
                    <p className="text-[#0F172A] font-medium text-sm">{t.name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#94A3B8] text-xs pb-px">{t.seats}</span>
                    <span className="text-[#0EA5E9] text-xs font-mono font-bold tracking-wide">{t.pct}%</span>
                  </div>
                </div>
                <div className="h-2 bg-[var(--color-surface2)] border border-[var(--color-border)] rounded-full overflow-hidden">
                  <div className={`h-full ${t.color} rounded-full opacity-90`}
                    style={{ width: `${t.pct}%`, transition: `width 0.9s ease ${i * 150}ms` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Event Info */}
        <div className="card p-5 animate-fade-in delay-200">
          <p className="section-label mb-4">Event Details</p>
          <div className="space-y-3">
            {[
              { k: "Event",       v: "DART 2K26"               },
              { k: "Dates",       v: "March 20-26, 2026"       },
              { k: "Venue",       v: "Sharda University"       },
              { k: "Location",    v: "Greater Noida, U.P."     },
              { k: "Organizer",   v: "School of Engineering and Technology" },
              { k: "Total Seats", v: "400 participants"        },
            ].map(({ k, v }) => (
              <div key={k} className="flex items-start justify-between gap-2">
                <span className="text-[#475569] text-xs">{k}</span>
                <span className="text-[#0F172A] text-xs text-right">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Announcements + Attendance trend  */}
      <div className="grid lg:grid-cols-2 gap-5 mb-5">

        {/* Announcements */}
        <div className="card p-5 hover-lift animate-slide-left">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#0EA5E9]" xmlns="http://www.w3.org/2000/svg"
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                  d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.158M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
              <p className="section-label-gradient">Announcements</p>
            </div>
            <button
              onClick={() => { setShowAForm((v) => !v); setEditingA(null); setAForm({ title: "", description: "", type: "general", visibility: "all" }); }}
              className="btn-primary py-1 px-3 text-[11px]">
              {showAForm && editingA === null ? "✕ Cancel" : "+ New"}
            </button>
          </div>

          {showAForm && (
            <div className="mb-4 p-4 bg-[#F8FAFC] rounded-xl border border-[#BFDBFE] space-y-3
              transition-all duration-300">
              <input
                className="dart-input text-sm"
                placeholder="Title *"
                value={aForm.title}
                onChange={(e) => setAForm((f) => ({ ...f, title: e.target.value }))}
              />
              <textarea
                className="dart-input text-sm resize-none"
                rows={2}
                placeholder="Description (optional)"
                value={aForm.description}
                onChange={(e) => setAForm((f) => ({ ...f, description: e.target.value }))}
              />
              <div className="grid grid-cols-2 gap-2">
                <select className="dart-input text-sm" value={aForm.type}
                  onChange={(e) => setAForm((f) => ({ ...f, type: e.target.value }))}>
                  <option value="general">General</option>
                  <option value="important">Important</option>
                  <option value="reminder">Reminder</option>
                  <option value="update">Update</option>
                  <option value="live">Live</option>
                </select>
                <select className="dart-input text-sm" value={aForm.visibility}
                  onChange={(e) => setAForm((f) => ({ ...f, visibility: e.target.value }))}>
                  <option value="all">All</option>
                  <option value="student">Students Only</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={() => { setShowAForm(false); setEditingA(null); }}
                  className="btn-ghost py-1.5 px-4 text-xs">Cancel</button>
                <button onClick={submitAnnouncement}
                  className="btn-primary py-1.5 px-4 text-xs">
                  {editingA !== null ? "Update" : "Post"}
                </button>
              </div>
            </div>
          )}

          <div className="space-y-2 ann-scroll-body" style={{ maxHeight: "320px", overflowY: "auto", overflowX: "hidden", paddingRight: "6px" }}>
            {announcements.length === 0 ? (
              <p className="text-[#94A3B8] text-xs text-center py-6">No announcements yet. Post one above.</p>
            ) : (
              announcements.map((a, i) => {
                const tc = TYPE_CONFIG[a.type] || TYPE_CONFIG.general;
                return (
                  <div key={a.id}
                    className="p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface2)]
                      hover:border-[#0EA5E9] hover:shadow-[0_2px_10px_rgba(14,165,233,0.1)] transition-all duration-200 animate-fade-in"
                    style={{ animationDelay: `${i * 60}ms` }}>
                    <div className="flex items-start gap-2 mb-1">
                      {a.type === "live" && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-[glow-pulse_2s_ease-in-out_infinite] flex-shrink-0 mt-1" />
                      )}
                      <span className={`px-2 py-0.5 rounded text-[10px] shadow-sm font-bold flex-shrink-0 ${tc.cls}`}>
                        {tc.label}
                      </span>
                      <p className="text-[#0F172A] text-xs font-medium flex-1 leading-snug">{a.title}</p>
                      <span className="text-[#94A3B8] text-[10px] flex-shrink-0">
                        {a.visibility === "student" ? "Students" : "All"}
                      </span>
                    </div>
                    {a.description && (
                      <p className="text-[#475569] text-xs leading-relaxed ml-5 mb-1.5">{a.description}</p>
                    )}
                    <div className="flex gap-3 justify-end">
                      <button onClick={() => startEditA(a)}
                        className="text-[#475569] hover:text-[#1E3A8A] text-[10px] font-medium transition-colors">
                        Edit
                      </button>
                      <button onClick={() => deleteAnnouncement(a.id)}
                        className="text-[#475569] hover:text-red-600 text-[10px] font-medium transition-colors">
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Attendance trend chart */}
        <div className="card p-5 hover-lift animate-slide-right">
          <p className="section-label-gradient mb-4">Attendance Trend (Last 5 Days)</p>
          {attendanceByDay.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-24 gap-2">
              <p className="text-[#475569] text-xs">No attendance records yet</p>
            </div>
          ) : (
            <div className="flex items-end justify-around gap-2 h-24">
              {attendanceByDay.map(({ date, pct }) => (
                <div key={date} className="flex flex-col items-center gap-1 flex-1 group">
                  <span className="text-[#0EA5E9] text-[10px] font-mono font-bold tracking-wide transition-transform group-hover:-translate-y-1">{pct}%</span>
                  <div className="w-full bg-[var(--color-surface2)] border border-[var(--color-border)] border-b-0 rounded-t overflow-hidden relative"
                    style={{ height: "56px" }}>
                    <div
                      className={`w-full absolute bottom-0 transition-all ${
                        pct >= 75 ? "bg-gradient-to-t from-emerald-600/80 to-emerald-400 group-hover:from-emerald-500 group-hover:to-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]" : pct >= 50 ? "bg-gradient-to-t from-amber-600/80 to-amber-400 group-hover:from-amber-500 group-hover:to-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.3)]" : "bg-gradient-to-t from-rose-700/80 to-rose-500 group-hover:from-rose-600 group-hover:to-rose-400 shadow-[0_0_10px_rgba(225,29,72,0.3)]"
                      }`}
                      style={{ height: `${pct}%`, transition: "height 0.9s ease" }}
                    />
                  </div>
                  <span className="text-[#94A3B8] text-[9px] group-hover:text-[#0EA5E9] transition-colors">{date}</span>
                </div>
              ))}
            </div>
          )}
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[#E2E8F0]">
            {[{c:"bg-emerald-600",l:">= 75%"},{c:"bg-amber-600",l:"50-74%"},{c:"bg-rose-700",l:"<50%"}].map(({c,l}) => (
              <div key={l} className="flex items-center gap-1.5">
                <div className={`w-2.5 h-2.5 rounded-sm ${c}`} />
                <span className="text-[#475569] text-[10px]">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tip of the Day Management */}
      <div className="card hover-lift p-5 mb-5 animate-fade-in glass-panel">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-base text-[#0EA5E9]">💡</span>
            <p className="section-label-gradient">Tip of the Day Management</p>
          </div>
          <button onClick={() => setShowTForm((v) => !v)}
            className="btn-ghost py-1 px-3 text-[11px]">
            {showTForm ? "✕ Cancel" : "+ Add Tip"}
          </button>
        </div>

        {showTForm && (
          <div className="mb-4 flex gap-2 transition-all duration-300">
            <input
              className="dart-input flex-1 text-sm bg-white"
              placeholder="Enter tip text for students…"
              value={newTipText}
              onChange={(e) => setNewTipText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTip()}
            />
            <button onClick={addTip} className="btn-primary py-2 px-4 text-sm flex-shrink-0">Add</button>
          </div>
        )}

        {tips.length === 0 ? (
          <p className="text-[#94A3B8] text-xs text-center py-4">
            No tips added yet. Add one to display to students on their dashboard.
          </p>
        ) : (
          <div className="space-y-2">
            {tips.map((tip) => (
              <div key={tip.id}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 ${
                  tip.active
                    ? "border-[#0EA5E9] bg-[var(--color-nav-active-bg)] shadow-[0_2px_8px_rgba(14,165,233,0.1)]"
                    : "border-[var(--color-border)] bg-[var(--color-surface2)] hover:border-[#7DD3FC] hover:shadow-[0_2px_8px_rgba(14,165,233,0.05)]"
                }`}>
                <div className="flex-1 min-w-0">
                  <p className="text-[#0F172A] text-sm leading-relaxed font-medium">{tip.text}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  {tip.active ? (
                    <span className="text-[11px] font-bold text-white shadow-sm uppercase tracking-wide
                      bg-gradient-to-r from-[#0EA5E9] to-[#3B82F6] px-2 py-0.5 rounded">Active</span>
                  ) : (
                    <button onClick={() => setActiveTip(tip.id)}
                      className="text-[11px] text-[#475569] hover:text-[#0EA5E9] font-medium transition-colors">
                      Set Active
                    </button>
                  )}
                  <button onClick={() => deleteTip(tip.id)}
                    className="text-[11px] text-[#475569] hover:text-red-500 font-medium transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent students */}
      <div className="card hover-lift p-5 animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <p className="section-label-gradient">Recently Registered</p>
          <a href="/admin/students" className="text-[#0EA5E9] text-xs font-medium hover:text-[#3B82F6] hover:underline transition-colors">
            View all
          </a>
        </div>
        {loading ? (
          <div className="space-y-2">
            {[1,2,3].map((i) => <div key={i} className="skeleton h-9 rounded-lg" />)}
          </div>
        ) : students.length === 0 ? (
          <EmptyState icon="📭" title="No registrations yet" message="Students who register will appear here." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-gradient-to-r from-[var(--color-surface2)] to-transparent">
                  <th className="text-left py-2 px-4 text-[#94A3B8] text-xs font-bold uppercase tracking-wider">Name</th>
                  <th className="text-left py-2 px-4 text-[#94A3B8] text-xs font-bold uppercase tracking-wider">Email</th>
                  <th className="text-left py-2 px-4 text-[#94A3B8] text-xs font-bold uppercase tracking-wider hidden sm:table-cell">ID</th>
                </tr>
              </thead>
              <tbody>
                {students.slice(0, 6).map((s, i) => (
                  <tr key={s.id} className="dart-tr animate-fade-in group"
                    style={{ animationDelay: `${i * 50}ms` }}>
                    <td className="py-2.5 px-4 text-[#0F172A] font-medium group-hover:text-[#0EA5E9] transition-colors">{s.name}</td>
                    <td className="py-2.5 px-4 text-[#475569] text-xs">{s.email}</td>
                    <td className="py-2.5 px-4 text-[#94A3B8] font-mono text-xs hidden sm:table-cell">#{s.id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
