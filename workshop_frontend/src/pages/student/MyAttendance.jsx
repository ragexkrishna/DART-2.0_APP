import { useEffect, useState } from "react";
import AppLayout from "../../components/AppLayout";
import Badge from "../../components/ui/Badge";
import EmptyState from "../../components/ui/EmptyState";
import AlertBanner from "../../components/ui/AlertBanner";
import api from "../../api/axios";

const STUDENT_TIPS = [
  "Bring your student ID and registration QR code to every session.",
  "Maintain 75% attendance to qualify for the Certificate of Participation.",
  "Consistency is key — showing up is half the battle toward your certificate.",
  "Review your session notes within 24 hours to retain significantly more information.",
  "Work with your team — collaborative learning improves both attendance and outcomes.",
  "Submit your IoT project documentation at least 24 hours before evaluation.",
  "Raise a support ticket early if you face any issue — the Help Desk is here for you.",
  "The Drone Racing qualifier is on Day 2 — practice at Lab F from March 10.",
  "Stay hydrated and take short breaks between sessions to stay sharp and focused.",
  "Ask questions freely — curiosity and engagement are the foundations of innovation.",
  "Prepare a brief summary after each session; it helps during the final evaluation.",
  "Network with participants from other tracks — cross-discipline ideas lead to breakthroughs.",
];

const PROFESSOR_TIPS = [
  "Mark attendance promptly so students can track their eligibility in real time.",
  "Encourage participation — engaged students attend more consistently.",
  "Share session objectives at the very start to improve student focus.",
  "Follow up with at-risk students early rather than waiting until the end of the event.",
  "Use the ticket system to resolve student issues before they escalate.",
  "Provide timely feedback on project documentation — students rely on it for revision.",
  "A brief recap at the end of each session reinforces key takeaways effectively.",
  "Recognise consistent attendees — positive reinforcement drives ongoing engagement.",
  "Keep sessions on schedule to respect the students' overall learning flow.",
  "Collaborative problem-solving exercises increase both attendance and motivation.",
  "Check in with quieter students — they often have the most thoughtful insights.",
  "Align evaluation criteria with session objectives communicated on Day 1.",
];

/* SVG circular progress ring */
function AttendanceRing({ pct = 0 }) {
  const r = 42;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  const color = pct >= 75 ? "#10b981" : pct >= 50 ? "#f59e0b" : "#ef4444";

  return (
    <svg width="120" height="120" viewBox="0 0 100 100" className="rotate-[-90deg] drop-shadow-[0_0_8px_rgba(14,165,233,0.2)]">
      <circle cx="50" cy="50" r={r} fill="none" stroke="var(--color-border)" strokeWidth="8" />
      <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="8"
        strokeDasharray={c} strokeDashoffset={offset}
        strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.8s ease" }} />
      <text x="50" y="57" textAnchor="middle" fill={color}
        fontSize="18" fontWeight="700" className="rotate-90 origin-center"
        style={{ transform: "rotate(90deg)", transformOrigin: "50px 50px", fontSize: "18px" }}>
        {pct}%
      </text>
    </svg>
  );
}

export default function MyAttendance() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(() => !!localStorage.getItem("roll_number"));
  const [error,   setError]   = useState("");

  const role      = localStorage.getItem("role") || "student";
  const TIPS      = role === "admin" ? PROFESSOR_TIPS : STUDENT_TIPS;
  const [tipIdx, setTipIdx]   = useState(0);

  const studentId = localStorage.getItem("roll_number");

  useEffect(() => {
    const id = setInterval(() => setTipIdx((i) => (i + 1) % TIPS.length), 7000);
    return () => clearInterval(id);
  }, [TIPS.length]);

  useEffect(() => {
    if (!studentId) return;
    const token = localStorage.getItem("token");
    api.get(`/student/attendance`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => setRecords(r.data))
      .catch(() => setError("Could not load attendance records."))
      .finally(() => setLoading(false));
  }, [studentId]);

  const total   = records.length;
  const present = records.filter((r) => r.status === "present").length;
  const pct     = Math.round((present / 7) * 100);
  const status  = pct >= 75 ? "success" : pct >= 50 ? "warning" : "danger";
  const statusLabel = pct >= 75 ? "Good Standing" : pct >= 50 ? "At Risk" : "Low Attendance";

  return (
    <AppLayout role="student" pageTitle="My Attendance">

      {!loading && error && <div className="mb-5"><AlertBanner variant="error">{error}</AlertBanner></div>}

      {/* Summary card */}
      <div className="card p-6 mb-5 hover-lift glass-panel">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">

          {/* Ring */}
          <div className="flex-shrink-0 flex flex-col items-center gap-2">
            {loading ? (
              <div className="skeleton w-28 h-28 rounded-full" />
            ) : (
              <AttendanceRing pct={pct} />
            )}
            <Badge variant={status}>{statusLabel}</Badge>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 flex-1 w-full">
            {[
              { label: "Total Sessions", value: loading ? "—" : total   },
              { label: "Present",        value: loading ? "-" : present, cls: "text-[#10b981] drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]" },
              { label: "Absent",         value: loading ? "-" : total - present, cls: "text-[#ef4444] drop-shadow-[0_0_8px_rgba(239,68,68,0.3)]" },
            ].map(({ label, value, cls }) => (
              <div key={label} className="text-center p-3 bg-[var(--color-surface2)] border border-[var(--color-border)] rounded-xl hover:border-[#0EA5E9] hover:shadow-[0_2px_10px_rgba(14,165,233,0.1)] transition-all">
                <p className={`text-2xl font-bold ${cls || "text-[var(--color-text-main)]"}`}>{value}</p>
                <p className="text-[#94A3B8] text-xs mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {total > 0 && (
          <div className="mt-5 pt-4 border-t border-[var(--color-border)]">
            <div className="flex items-center justify-between text-xs text-[#94A3B8] mb-1.5 font-medium">
              <span>Attendance progress</span>
              <span className={pct >= 75 ? "text-emerald-500" : "text-amber-500"}>{pct}% (75% required)</span>
            </div>
            <div className="progress-bar">
              <div className={`progress-bar-fill ${
                pct >= 75 ? "bg-gradient-to-r from-emerald-400 to-emerald-600 shadow-[0_0_8px_rgba(16,185,129,0.4)]" : pct >= 50 ? "bg-gradient-to-r from-amber-400 to-amber-600 shadow-[0_0_8px_rgba(245,158,11,0.4)]" : "bg-gradient-to-r from-red-400 to-red-600 shadow-[0_0_8px_rgba(239,68,68,0.4)]"
              }`} style={{ width: `${pct}%`, animationName: 'none' }} />
            </div>
            <div className="relative mt-1">
              <div className="absolute left-[75%] w-px h-2 bg-[#94A3B8]" />
              <p className="absolute left-[75%] translate-x-1 text-[10px] text-[#94A3B8] font-medium">75% target</p>
          </div>
          </div>
        )}

        {/* Rotating tips */}
        <div className="mt-5 pt-4 border-t border-[var(--color-border)]">
          <p className="text-[#0EA5E9] text-[11px] font-bold uppercase tracking-widest mb-1.5">
            Attendance Tip
          </p>
          <p className="text-[#0F172A] text-sm leading-relaxed">
            {TIPS[tipIdx]}
          </p>
        </div>
      </div>

      {/* Attendance log */}
      <div className="card overflow-hidden hover-lift">
        <div className="px-5 py-4 border-b border-[var(--color-border)] bg-[var(--color-surface2)]">
          <p className="section-label-gradient">Attendance Log</p>
        </div>

        {loading ? (
          <div className="p-5 space-y-2">
            {[1,2,3,4,5].map((i) => <div key={i} className="skeleton h-9 rounded-lg" />)}
          </div>
        ) : records.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-[#94A3B8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-label="No attendance records" role="img">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              }
              title="No records yet"
              message="Your attendance will appear here after sessions are marked."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-gradient-to-r from-[var(--color-surface2)] to-transparent">
                  <th className="text-left py-3 px-4 text-[#94A3B8] text-xs font-bold uppercase tracking-wider">#</th>
                  <th className="text-left py-3 px-4 text-[#94A3B8] text-xs font-bold uppercase tracking-wider">Date</th>
                  <th className="text-left py-3 px-4 text-[#94A3B8] text-xs font-bold uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r, i) => (
                  <tr key={r.id || i} className="dart-tr">
                    <td className="py-3 px-4 text-[#475569]">{i + 1}</td>
                    <td className="py-3 px-4 text-[#475569] font-mono text-xs">{r.date}</td>
                    <td className="py-3 px-4">
                      <Badge variant={r.status === "present" ? "success" : "danger"}>
                        {r.status}
                      </Badge>
                    </td>
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
