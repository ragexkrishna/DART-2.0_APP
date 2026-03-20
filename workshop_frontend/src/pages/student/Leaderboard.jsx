import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../../components/AppLayout";
import api from "../../api/axios";
import { computeLeaderboard } from "../../utils/leaderboard";

const MEDAL = ["🥇", "🥈", "🥉"];

// Visual layout: 2nd (left), 1st (center), 3rd (right)
const PODIUM_STYLES = [
  { bg: "from-slate-50 to-gray-100",   border: "border-slate-300",  text: "text-slate-600",  order: "sm:order-1" },
  { bg: "from-amber-50 to-yellow-100", border: "border-amber-300",  text: "text-amber-700",  order: "sm:order-2" },
  { bg: "from-orange-50 to-amber-100", border: "border-orange-300", text: "text-orange-600", order: "sm:order-3" },
];

export default function Leaderboard() {
  const [students, setStudents] = useState([]);
  const [allAtt,   setAllAtt]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");

  const studentId = localStorage.getItem("roll_number");

  useEffect(() => {
    const token   = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
    Promise.all([
      api.get("/student/leaderboard-students",   { headers }),
      api.get("/student/leaderboard-attendance", { headers }),
    ])
      .then(([s, a]) => { setStudents(s.data); setAllAtt(a.data); })
      .catch(() => setError("Failed to load leaderboard data."))
      .finally(() => setLoading(false));
  }, []);

  const ranked = useMemo(() => computeLeaderboard(students, allAtt), [students, allAtt]);

  const myRank = ranked.findIndex((r) => String(r.id) === String(studentId)) + 1;

  // Podium visual order: slot 0 = 2nd place, slot 1 = 1st place, slot 2 = 3rd place
  const podiumEntries = ranked.length >= 3
    ? [ranked[1], ranked[0], ranked[2]]
    : ranked.slice(0, 3);

  const podiumRealRanks = ranked.length >= 3 ? [2, 1, 3] : [1, 2, 3];

  return (
    <AppLayout role="student" pageTitle="Leaderboard">

      {/* Page header */}
      <div className="card p-5 mb-5 gold-band animate-slide-down">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <p className="text-[#1E3A8A] text-xl font-bold">🏆 Leaderboard</p>
            <p className="text-[#475569] text-sm mt-0.5">
              Rankings based on attendance (70 pts max), feedback participation (+10 pts), and rating quality (+10 pts).
            </p>
          </div>
          {myRank > 0 && (
            <div className="flex-shrink-0 px-4 py-2.5 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] text-center">
              <p className="text-[10px] text-[#64748B] uppercase tracking-widest font-semibold">Your Rank</p>
              <p className="text-[#1E3A8A] text-2xl font-bold">#{myRank}</p>
            </div>
          )}
        </div>
      </div>

      {loading && (
        <div className="card p-10 text-center text-[#94A3B8] animate-fade-in">
          <div className="skeleton h-4 w-48 mx-auto mb-3 rounded" />
          <div className="skeleton h-4 w-36 mx-auto rounded" />
        </div>
      )}

      {error && (
        <div className="card p-6 text-center text-red-600 text-sm animate-fade-in">{error}</div>
      )}

      {!loading && !error && ranked.length === 0 && (
        <div className="card p-10 text-center text-[#94A3B8]">No students registered yet.</div>
      )}

      {!loading && !error && ranked.length > 0 && (
        <>
          {/* ── Podium (top 3) ─────────────────────────────────── */}
          {ranked.length >= 2 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5 animate-scale-in">
              {podiumEntries.map((entry, visIdx) => {
                const realRank = podiumRealRanks[visIdx];
                const style    = PODIUM_STYLES[visIdx];
                const isMe     = String(entry.id) === String(studentId);

                return (
                  <div
                    key={entry.id}
                    className={`${style.order} relative bg-gradient-to-b ${style.bg} border-2 ${style.border}
                      rounded-2xl p-5 text-center transition-all
                      ${realRank === 1 ? "shadow-lg sm:scale-105" : "shadow"}
                      ${isMe ? "ring-2 ring-offset-2 ring-[#2563EB]" : ""}`}
                  >
                    {isMe && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5
                        bg-[#2563EB] text-white text-[10px] font-bold rounded-full whitespace-nowrap z-10">
                        You
                      </span>
                    )}
                    <div className="text-4xl mb-2">{MEDAL[realRank - 1]}</div>
                    <div className="w-12 h-12 rounded-full bg-white border-2 border-white shadow-sm
                      flex items-center justify-center mx-auto mb-2 text-[#1E3A8A] font-bold text-lg">
                      {entry.name.charAt(0).toUpperCase()}
                    </div>
                    <p className="text-[#0F172A] font-bold text-sm leading-snug">{entry.name}</p>
                    <p className={`text-xs font-medium mt-0.5 mb-3 ${style.text}`}>
                      {entry.track !== "—" ? entry.track : "General"}
                    </p>
                    <div className="text-2xl font-bold text-[#1E3A8A]">{entry.score}</div>
                    <p className="text-[11px] text-[#64748B]">points</p>
                    <div className="mt-3 flex justify-center items-center gap-3 text-[11px] text-[#475569]">
                      <span>{entry.present}/{entry.total} sessions</span>
                      <span className={`font-semibold ${entry.attPct >= 75 ? "text-emerald-600" : "text-amber-600"}`}>
                        {entry.attPct}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── Full rankings table ─────────────────────────────── */}
          <div className="card p-5 animate-fade-in">
            <div className="flex items-center justify-between mb-3">
              <p className="section-label">All Rankings</p>
              <span className="text-[#64748B] text-xs">{ranked.length} participants</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[#64748B] text-xs uppercase tracking-wider border-b border-[#E2E8F0]">
                    <th className="pb-2 pr-4 font-semibold w-12">Rank</th>
                    <th className="pb-2 pr-4 font-semibold">Name</th>
                    <th className="pb-2 pr-4 font-semibold hidden sm:table-cell">Track</th>
                    <th className="pb-2 pr-4 font-semibold hidden sm:table-cell">Attendance</th>
                    <th className="pb-2 font-semibold text-right">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {ranked.map((entry, idx) => {
                    const isMe = String(entry.id) === String(studentId);
                    return (
                      <tr
                        key={entry.id}
                        className={`dart-tr transition-colors ${isMe ? "bg-[#EFF6FF]" : ""}`}
                      >
                        <td className="py-2.5 pr-4">
                          {idx < 3
                            ? <span className="text-xl">{MEDAL[idx]}</span>
                            : <span className="text-[#64748B] font-mono text-xs">#{idx + 1}</span>
                          }
                        </td>
                        <td className="py-2.5 pr-4">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-[#DBEAFE] border border-[#BFDBFE]
                              flex items-center justify-center text-[#1E3A8A] text-xs font-bold flex-shrink-0">
                              {entry.name.charAt(0).toUpperCase()}
                            </div>
                            <span className={`text-sm ${isMe ? "text-[#1E3A8A] font-semibold" : "text-[#0F172A]"}`}>
                              {entry.name}
                            </span>
                            {isMe && (
                              <span className="px-1.5 py-0.5 bg-[#2563EB] text-white text-[10px]
                                font-bold rounded-full flex-shrink-0">
                                You
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-2.5 pr-4 text-[#64748B] text-xs hidden sm:table-cell">
                          {entry.track}
                        </td>
                        <td className="py-2.5 pr-4 hidden sm:table-cell">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden max-w-[60px]">
                              <div
                                className={`h-full rounded-full ${entry.attPct >= 75 ? "bg-emerald-500" : "bg-amber-500"}`}
                                style={{ width: `${entry.attPct}%` }}
                              />
                            </div>
                            <span className="text-xs text-[#64748B]">{entry.attPct}%</span>
                          </div>
                        </td>
                        <td className="py-2.5 text-right">
                          <span className="font-bold text-[#1E3A8A]">{entry.score}</span>
                          <span className="text-[#94A3B8] text-xs ml-1">pts</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </AppLayout>
  );
}
