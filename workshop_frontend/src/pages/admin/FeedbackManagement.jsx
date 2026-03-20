import { useState } from "react";
import AppLayout from "../../components/AppLayout";
import Badge from "../../components/ui/Badge";
import AlertBanner from "../../components/ui/AlertBanner";

const TRACKS  = ["All", "Drone Racing", "Robotics", "IoT Innovation", "General Workshop"];
const RATINGS = ["All", "5", "4", "3", "2", "1"];
const starStr = (n) => "★".repeat(n);

/* Feedback detail modal */
function FeedbackModal({ feedback: f, onClose, onMarkReviewed, onMarkImportant, onDelete }) {
  if (!f) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}>
      <div className="absolute inset-0 bg-[#020617]/80 backdrop-blur-md" />
      <div className="relative glass-panel rounded-2xl shadow-[0_8px_32px_rgba(14,165,233,0.3)] w-full max-w-lg
        animate-scale-in overflow-hidden border border-[#0EA5E9]/30"
        onClick={(e) => e.stopPropagation()}>

        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)] bg-gradient-to-r from-[var(--color-surface2)] to-transparent">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0EA5E9] to-[#3B82F6] flex items-center justify-center
              text-white font-bold text-base flex-shrink-0 shadow-[0_0_10px_rgba(14,165,233,0.4)]">
              {(f.studentName || "—").charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-[var(--color-text-main)] font-bold text-sm leading-tight tracking-wide">{f.studentName}</p>
              <p className="text-[#94A3B8] font-mono text-[10px] mt-0.5">ID: {f.studentId || "—"}</p>
            </div>
            {f.important && (
              <span className="ml-2 bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[9px] font-bold
                px-2 py-0.5 rounded uppercase tracking-widest flex-shrink-0 shadow-[0_0_8px_rgba(251,191,36,0.3)]">
                Important
              </span>
            )}
          </div>
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[#94A3B8]
              hover:text-[#0EA5E9] hover:bg-[var(--color-hover)] transition-colors flex-shrink-0">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal body */}
        <div className="px-6 py-5 space-y-5">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Workshop Track", value: f.track },
              { label: "Status", value: (
                <Badge variant={f.status === "reviewed" || f.status === "resolved" ? "success" : "info"} className="shadow-sm border border-[var(--color-border)]">
                  {f.status === "reviewed" || f.status === "resolved" ? "Reviewed" : "Open"}
                </Badge>
              )},
              { label: "Rating", value: <span className="text-amber-400 drop-shadow-md">{starStr(f.rating)} <span className="text-[#94A3B8] font-mono text-[10px] ml-1">({f.rating}/5)</span></span> },
              { label: "Submitted", value: <span className="font-mono text-xs">{new Date(f.createdAt).toLocaleDateString("en-GB", {
                  day: "numeric", month: "short", year: "numeric"
                })}</span>},
            ].map(({ label, value }) => (
              <div key={label} className="bg-[var(--color-surface2)] border border-[var(--color-border)] rounded-lg p-3 hover:border-[#0EA5E9]/50 transition-colors">
                <p className="text-[#0EA5E9] text-[9px] font-bold uppercase tracking-widest mb-1.5 opacity-80">
                  {label}
                </p>
                <div className="text-[var(--color-text-main)] text-sm font-semibold">{value}</div>
              </div>
            ))}
          </div>

          <div>
            <p className="text-[#0EA5E9] text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
              Feedback Comment
            </p>
            <div className="bg-[#0F172A]/50 rounded-lg p-4 border border-[var(--color-border)] shadow-inner">
              <p className="text-[#cbd5e1] text-sm leading-relaxed">{f.text}</p>
            </div>
          </div>
        </div>

        {/* Admin actions */}
        <div className="flex flex-wrap gap-3 px-6 pb-6 pt-2">
          {f.status !== "reviewed" && f.status !== "resolved" && (
            <button onClick={() => { onMarkReviewed(f.id); onClose(); }}
              className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-emerald-400 border border-emerald-500/50 bg-emerald-500/10 hover:bg-emerald-500/20 hover:border-emerald-400 rounded-lg transition-all shadow-[0_0_10px_rgba(16,185,129,0.2)]">
              Mark Reviewed
            </button>
          )}
          <button onClick={() => { onMarkImportant(f.id); onClose(); }}
            className={`px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-lg border transition-all ${
                f.important
                  ? "bg-amber-500/20 text-amber-400 border-amber-500/50 hover:bg-amber-500/30 shadow-[0_0_10px_rgba(251,191,36,0.3)]"
                  : "bg-[var(--color-surface2)] text-[#94A3B8] border-[var(--color-border)] hover:border-amber-500/50 hover:text-amber-400 hover:bg-amber-500/10"
              }`}>
            {f.important ? "Remove Impt" : "Mark Impt"}
          </button>
          <div className="flex-1" />
          <button onClick={() => { onDelete(f.id); onClose(); }}
            className="px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-lg border border-rose-500/50 text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 hover:border-rose-400 hover:shadow-[0_0_10px_rgba(244,63,94,0.3)] transition-all flex items-center gap-2">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FeedbackManagement() {
  const [feedback,     setFeedback]     = useState(() => {
    try {
      const raw = localStorage.getItem("dart_feedback");
      const data = raw ? JSON.parse(raw) : [];
      return data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch {
      return [];
    }
  });
  const [trackFilter,  setTrackFilter]  = useState("All");
  const [ratingFilter, setRatingFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [search,       setSearch]       = useState("");
  const [success,      setSuccess]      = useState("");
  const [selected,     setSelected]     = useState(null); // modal

  const save = (list) => {
    setFeedback(list);
    localStorage.setItem("dart_feedback", JSON.stringify(list));
  };

  const markReviewed  = (id) => { save(feedback.map((f) => f.id === id ? { ...f, status: "reviewed" } : f)); setSuccess("Marked as reviewed."); };
  const markImportant = (id) => { save(feedback.map((f) => f.id === id ? { ...f, important: !f.important } : f)); };
  const deleteFeedback = (id) => { save(feedback.filter((f) => f.id !== id)); setSuccess("Feedback deleted."); };

  const filtered = feedback.filter((f) => {
    const matchTrack   = trackFilter  === "All" || f.track         === trackFilter;
    const matchRating  = ratingFilter === "All" || String(f.rating) === ratingFilter;
    const matchStatus  = statusFilter === "All"
      || (statusFilter === "important" && f.important)
      || (statusFilter !== "important" && (f.status === statusFilter || (statusFilter === "reviewed" && f.status === "resolved")));
    const matchSearch  = !search
      || f.studentName?.toLowerCase().includes(search.toLowerCase())
      || String(f.studentId || "").includes(search);
    return matchTrack && matchRating && matchStatus && matchSearch;
  });

  const totalCount     = feedback.length;
  const reviewedCount  = feedback.filter((f) => f.status === "reviewed" || f.status === "resolved").length;
  const importantCount = feedback.filter((f) => f.important).length;
  const avgRating      = feedback.length
    ? (feedback.reduce((s, f) => s + f.rating, 0) / feedback.length).toFixed(1)
    : "—";

  return (
    <AppLayout role="admin" pageTitle="Feedback Management">
      {selected && (
        <FeedbackModal feedback={selected} onClose={() => setSelected(null)}
          onMarkReviewed={markReviewed} onMarkImportant={markImportant}
          onDelete={deleteFeedback} />
      )}

      {success && (
        <div className="mb-5">
          <AlertBanner variant="success" onClose={() => setSuccess("")}>{success}</AlertBanner>
        </div>
      )}

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Responses", value: totalCount,     color: "text-[#0EA5E9] drop-shadow-[0_0_8px_rgba(14,165,233,0.5)]",   border: "border-l-[#0EA5E9]" },
          { label: "Reviewed",        value: reviewedCount,  color: "text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]", border: "border-l-emerald-400" },
          { label: "Important",       value: importantCount, color: "text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]",   border: "border-l-amber-400" },
          { label: "Avg. Rating",     value: avgRating,      color: "text-purple-400 drop-shadow-[0_0_8px_rgba(192,132,252,0.5)]",  border: "border-l-purple-400", suffix: <span className="text-xl text-purple-400/70 ml-1">★</span> },
        ].map((s) => (
          <div key={s.label} className={`card p-5 hover-lift border-l-4 ${s.border} bg-gradient-to-br from-[var(--color-surface2)] to-[#020617]`}>
            <p className="text-[#94A3B8] text-[10px] font-bold uppercase tracking-widest mb-2 opacity-80">{s.label}</p>
            <p className={`text-3xl font-black font-mono tracking-tight ${s.color}`}>
              {s.value}
              {s.suffix && s.suffix}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6 border-[#0EA5E9]/20 hover-lift shadow-[0_4px_20px_rgba(14,165,233,0.05)]">
        <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0EA5E9]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" placeholder="Search by student name or ID ..." value={search}
              onChange={(e) => setSearch(e.target.value)} className="dart-input pl-9 w-full text-sm py-2" />
          </div>
          <select value={trackFilter}  onChange={(e) => setTrackFilter(e.target.value)}  className="dart-input sm:w-44 text-sm py-2">
            {TRACKS.map((t) => <option key={t} value={t} className="bg-[#0F172A] text-[#f8fafc]">{t}</option>)}
          </select>
          <select value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)} className="dart-input sm:w-36 text-sm py-2">
            {RATINGS.map((r) => (
              <option key={r} value={r} className="bg-[#0F172A] text-[#f8fafc]">{r === "All" ? "All Ratings" : `${r} ★`}</option>
            ))}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="dart-input sm:w-40 text-sm py-2">
            {[
              { v: "All",       l: "All Status"  },
              { v: "open",      l: "Open"        },
              { v: "reviewed",  l: "Reviewed"    },
              { v: "important", l: "Important" },
            ].map(({ v, l }) => <option key={v} value={v} className="bg-[#0F172A] text-[#f8fafc]">{l}</option>)}
          </select>
        </div>
      </div>

      {/* Feedback card grid */}
      {filtered.length === 0 ? (
        <div className="card p-12 text-center animate-fade-in border-dashed border-[var(--color-border)] bg-[var(--color-surface2)] opacity-70">
          <svg className="w-12 h-12 text-[#475569] mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
          <p className="text-[var(--color-text-main)] font-bold tracking-wide text-lg">No feedback found</p>
          <p className="text-[#94A3B8] text-sm mt-2">
            {feedback.length === 0 ? "No feedback has been submitted yet." : "Try adjusting your filters."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((f, i) => (
            <div key={f.id} onClick={() => setSelected(f)}
              className="card p-5 cursor-pointer hover:shadow-[0_8px_30px_rgba(14,165,233,0.15)] hover:-translate-y-1
                transition-all duration-300 hover:border-[#0EA5E9]/50 group relative bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface2)] animate-scale-in"
              style={{ animationDelay: `${i * 0.05}s` }}>

              {f.important && (
                <div className="absolute top-0 right-0 overflow-hidden w-16 h-16 rounded-tr-xl">
                  <div className="absolute top-0 right-0 w-[141%] h-6 bg-amber-500 text-black text-[9px] font-bold uppercase tracking-widest flex items-center justify-center transform rotate-45 translate-x-[30%] translate-y-[-10%] shadow-[0_0_10px_rgba(251,191,36,0.6)]">
                    Impt
                  </div>
                </div>
              )}

              {/* Student row */}
              <div className="flex items-center justify-between gap-3 mb-4 pr-6">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0EA5E9] to-[#3B82F6] flex items-center justify-center
                    text-white font-bold text-base flex-shrink-0 shadow-[0_0_10px_rgba(14,165,233,0.3)] group-hover:scale-110 transition-transform duration-300">
                    {(f.studentName || "—").charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[var(--color-text-main)] font-bold text-sm truncate tracking-wide group-hover:text-[#0EA5E9] transition-colors">{f.studentName}</p>
                    <p className="text-[#94A3B8] font-mono text-[10px]">ID: {f.studentId || "—"}</p>
                  </div>
                </div>
                <Badge variant={(f.status === "reviewed" || f.status === "resolved") ? "success" : "info"} className="shadow-sm border border-[var(--color-border)]">
                  {(f.status === "reviewed" || f.status === "resolved") ? "Reviewed" : "Open"}
                </Badge>
              </div>

              {/* Track + rating */}
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <span className="bg-[var(--color-surface2)] border border-[var(--color-border)] text-[#94A3B8] text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded shadow-sm">
                  {f.track}
                </span>
                <span className="bg-[#f59e0b]/10 border border-[#f59e0b]/30 text-[#fbbf24] text-[11px] font-bold px-2 py-1 rounded shadow-sm drop-shadow-[0_0_5px_rgba(245,158,11,0.3)] flex items-center gap-1.5 object-cover">
                  {starStr(f.rating)} <span className="font-mono text-amber-500/70">{f.rating}/5</span>
                </span>
              </div>

              {/* Comment preview */}
              <div className="bg-[#0F172A]/30 p-3 rounded-lg border border-[var(--color-border)] min-h-[70px]">
                <p className="text-[#cbd5e1] text-xs leading-relaxed line-clamp-3 italic opacity-90">"{f.text}"</p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--color-border)]">
                <p className="text-[#64748B] font-mono text-[10px] flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {new Date(f.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric", month: "short", year: "numeric",
                  })}
                </p>
                <div className="flex items-center gap-1.5 text-[#0EA5E9] text-[10px] font-bold tracking-widest uppercase
                  opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                  Manage <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  );
}

