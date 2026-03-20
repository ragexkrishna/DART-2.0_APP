import { useEffect, useState, useMemo } from "react";
import AppLayout from "../../components/AppLayout";
import api from "../../api/axios";
import { computeLeaderboard } from "../../utils/leaderboard";

const MEDAL = ["🥇", "🥈", "🥉"];

const PODIUM_STYLES = [
  { bg: "from-[#0ea5e9]/20 to-[#0284c7]/10", border: "border-[#0EA5E9]/50", shadow: "shadow-[0_0_20px_rgba(14,165,233,0.3)]", text: "text-[#38bdf8]", order: "sm:order-1" },
  { bg: "from-[#f59e0b]/20 to-[#d97706]/10", border: "border-[#f59e0b]/50", shadow: "shadow-[0_0_30px_rgba(245,158,11,0.4)]", text: "text-[#fbbf24]", order: "sm:order-2" },
  { bg: "from-[#8b5cf6]/20 to-[#7c3aed]/10", border: "border-[#8b5cf6]/50", shadow: "shadow-[0_0_20px_rgba(139,92,246,0.3)]", text: "text-[#a78bfa]", order: "sm:order-3" },
];

export default function AdminLeaderboard() {
  const [students, setStudents] = useState([]);
  const [allAtt,   setAllAtt]   = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");

  useEffect(() => {
    const token   = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
    Promise.all([
      api.get("/admin/students",   { headers }),
      api.get("/admin/attendance", { headers }),
      api.get("/admin/feedbacks",  { headers }),
    ])
      .then(([s, a, f]) => { 
        setStudents(s.data); 
        setAllAtt(a.data); 
        setFeedbacks(f.data);
      })
      .catch(() => setError("Failed to load leaderboard data."))
      .finally(() => setLoading(false));
  }, []);

  const ranked = useMemo(() => computeLeaderboard(students, allAtt, feedbacks), [students, allAtt, feedbacks]);


  const podiumEntries  = ranked.length >= 3 ? [ranked[1], ranked[0], ranked[2]] : ranked.slice(0, 3);
  const podiumRealRanks = ranked.length >= 3 ? [2, 1, 3] : [1, 2, 3];

  return (
    <AppLayout role="admin" pageTitle="Leaderboard">

      {/* Page header */}
      <div className="card p-5 mb-5 tech-band animate-slide-down hover-lift">
        <div>
          <p className="text-gradient text-xl font-bold uppercase tracking-widest">🏆 Student Leaderboard</p>
          <p className="text-[#94A3B8] text-sm mt-1">
            Rankings based on attendance (70 pts max), feedback participation (+10 pts), and rating quality (+10 pts).
          </p>
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

                return (
                  <div
                    key={entry.id}
                    className={`${style.order} bg-gradient-to-b ${style.bg} border ${style.border} ${realRank === 1 ? style.shadow : ""}
                      rounded-2xl p-5 text-center transition-all duration-300 hover:-translate-y-2 backdrop-blur-sm
                      ${realRank === 1 ? "sm:scale-[1.02] z-10" : "opacity-90 hover:opacity-100"}`}
                  >
                    <div className="text-4xl mb-3 drop-shadow-md">{MEDAL[realRank - 1]}</div>
                    <div className={`w-14 h-14 rounded-full bg-[var(--color-surface)] border-2 ${style.border}
                      flex items-center justify-center mx-auto mb-3 text-white font-bold text-xl drop-shadow-lg`}>
                      {entry.name.charAt(0).toUpperCase()}
                    </div>
                    <p className="text-white font-bold text-sm leading-snug tracking-wide">{entry.name}</p>
                    <p className={`text-xs font-medium mt-1 mb-4 ${style.text} tracking-wider uppercase`}>
                      {entry.track !== "—" ? entry.track : "General"}
                    </p>
                    <div className={`text-3xl font-black ${style.text} drop-shadow-md`}>{entry.score}</div>
                    <p className="text-[10px] text-[#94A3B8] uppercase tracking-widest mt-0.5">points</p>
                    <div className="mt-4 pt-3 border-t border-[var(--color-border)] flex justify-center items-center gap-3 text-[11px] text-[#94A3B8]">
                      <span>{entry.present}/{entry.total} sessions</span>
                      <span className={`font-bold ${entry.attPct >= 75 ? "text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]" : "text-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]"}`}>
                        {entry.attPct}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── Full rankings table ─────────────────────────────── */}
          <div className="card p-5 animate-fade-in hover-lift">
            <div className="flex items-center justify-between mb-4">
              <p className="section-label-gradient">All Rankings</p>
              <span className="text-[#94A3B8] text-xs font-mono bg-[var(--color-surface2)] px-2 py-1 rounded border border-[var(--color-border)]">{ranked.length} participants</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[#94A3B8] text-[11px] font-bold uppercase tracking-wider border-b border-[var(--color-border)] bg-gradient-to-r from-[var(--color-surface2)] to-transparent">
                    <th className="py-3 px-2 w-12 text-center rounded-tl-lg">Rank</th>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4 hidden sm:table-cell">Attendance</th>
                    <th className="py-3 px-4 hidden md:table-cell">Feedback</th>
                    <th className="py-3 px-4 text-right rounded-tr-lg">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                  {ranked.map((entry, idx) => (
                    <tr key={entry.id} className="dart-tr hover:bg-[var(--color-hover)] transition-colors group">
                      <td className="py-3 px-2 text-center">
                        {idx < 3
                          ? <span className="text-xl drop-shadow-sm">{MEDAL[idx]}</span>
                          : <span className="text-[#475569] font-mono text-xs font-bold group-hover:text-[#0EA5E9] transition-colors">#{idx + 1}</span>
                        }
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0EA5E9] to-[#3B82F6] shadow-sm
                            flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {entry.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-[var(--color-text-main)] text-sm font-semibold group-hover:text-[#0EA5E9] transition-colors">{entry.name}</p>
                            <p className="text-[#94A3B8] text-[10px] font-mono mt-0.5">ID: {entry.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 hidden sm:table-cell">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-[var(--color-surface2)] border border-[var(--color-border)] rounded-full overflow-hidden max-w-[60px]">
                            <div
                              className={`h-full rounded-full transition-all ${entry.attPct >= 75 ? "bg-gradient-to-r from-emerald-500 to-emerald-400 shadow-[0_0_5px_rgba(16,185,129,0.5)]" : "bg-gradient-to-r from-amber-500 to-amber-400 shadow-[0_0_5px_rgba(245,158,11,0.5)]"}`}
                              style={{ width: `${entry.attPct}%` }}
                            />
                          </div>
                          <span className="text-xs text-[#94A3B8] font-mono">{entry.attPct}%</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 hidden md:table-cell">
                        {entry.hasFeedback
                          ? <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded text-[10px] font-bold uppercase tracking-wider">Submitted</span>
                          : <span className="px-2 py-0.5 bg-[var(--color-surface2)] text-[#64748B] border border-[var(--color-border)] rounded text-[10px] font-bold uppercase tracking-wider">None</span>
                        }
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="font-bold text-[#0EA5E9] text-base font-mono">{entry.score}</span>
                        <span className="text-[#64748B] text-[10px] uppercase tracking-widest ml-1">pts</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </AppLayout>
  );
}
