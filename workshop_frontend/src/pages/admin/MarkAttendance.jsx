import { useEffect, useState } from "react";
import AppLayout from "../../components/AppLayout";
import AlertBanner from "../../components/ui/AlertBanner";
import EmptyState from "../../components/ui/EmptyState";
import api from "../../api/axios";

const TODAY = new Date().toISOString().slice(0, 10);

export default function MarkAttendance() {
  const [tab,       setTab]       = useState("qr");   // "qr" | "manual"
  const [students,  setStudents]  = useState([]);
  const [present,   setPresent]   = useState({});
  const [date,      setDate]      = useState(TODAY);
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);
  const [success,   setSuccess]   = useState("");
  const [error,     setError]     = useState("");
  const [scanning,  setScanning]  = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    api.get("/admin/students", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => {
        setStudents(r.data);
        const init = {};
        r.data.forEach((s) => { init[s.id] = false; });
        setPresent(init);
      })
      .catch(() => setError("Failed to load students."))
      .finally(() => setLoading(false));
  }, []);

  const toggle = (id) =>
    setPresent((p) => ({ ...p, [id]: !p[id] }));

  const markAllPresent = () => {
    const next = {};
    students.forEach((s) => { next[s.id] = true; });
    setPresent(next);
  };

  const clearAll = () => {
    const next = {};
    students.forEach((s) => { next[s.id] = false; });
    setPresent(next);
  };

  const save = async () => {
    setError(""); setSuccess(""); setSaving(true);
    const token   = localStorage.getItem("token");
    const payload = students.map((s) => ({
      student_id: s.id,
      date,
      status: present[s.id] ? "present" : "absent",
    }));
    try {
      await api.post("/admin/attendance/bulk", payload,
        { headers: { Authorization: `Bearer ${token}` } });
      setSuccess("Attendance saved successfully.");
    } catch {
      setError("Failed to save attendance. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const presentCount = Object.values(present).filter(Boolean).length;

  return (
    <AppLayout role="admin" pageTitle="Mark Attendance">
      <div className="mb-5 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl flex items-center gap-3">
        <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-blue-200 text-xs leading-relaxed">
          <span className="font-bold">Google Sheets Sync Active:</span> Attendance is now managed via the 
          <a href="https://docs.google.com/spreadsheets/d/1a7Z0U1XhYJHlmoBTQQc1pcFTScKvJTexCRZPfb98DVE/edit#gid=0" 
             target="_blank" rel="noopener noreferrer" className="mx-1 text-blue-400 hover:text-blue-300 underline font-semibold">
            Attendance Sheet
          </a>. 
          Manual marking here is temporarily disabled to prevent data inconsistency.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-[var(--color-surface2)] border border-[var(--color-border)] rounded-xl w-fit mb-5 shadow-sm">
        {[["qr", "QR Scanner"], ["manual", "Manual Entry"]].map(([v, label]) => (
          <button key={v} onClick={() => setTab(v)}
            className={`px-5 py-1.5 rounded-lg text-sm font-bold transition-all duration-300 ${
              tab === v
                ? "bg-gradient-to-r from-[#0EA5E9] to-[#3B82F6] text-white shadow-[0_0_15px_rgba(14,165,233,0.4)]"
                : "text-[#94A3B8] hover:text-[#0EA5E9] hover:bg-[var(--color-hover)]"
            }`}>
            {label}
          </button>
        ))}
      </div>

      {success && <div className="mb-5"><AlertBanner variant="success" onClose={() => setSuccess("")}>{success}</AlertBanner></div>}
      {error   && <div className="mb-5"><AlertBanner variant="error"   onClose={() => setError("")}>{error}</AlertBanner></div>}

      {tab === "qr" ? (
        /* QR Scanner UI */
        <div className="max-w-lg animate-fade-in">
          <div className="card p-6 text-center hover-lift border-[#0EA5E9]/30 border-t-[#0EA5E9] border-t-2 shadow-[0_8px_32px_rgba(14,165,233,0.1)]">
            <p className="text-gradient font-bold uppercase tracking-widest mb-6 text-lg">Scan Student QR Code</p>

            {/* Camera frame */}
            <div className="qr-frame mx-auto mb-6 border-2 border-[#0EA5E9]/50 shadow-[inset_0_0_20px_rgba(14,165,233,0.2)] bg-[#0F172A]/80 flex items-center justify-center relative overflow-hidden">
              {scanning ? (
                <div className="w-full h-full flex flex-col items-center justify-center gap-3 relative">
                  {/* Animated scan line */}
                  <div className="absolute inset-x-4 h-0.5 bg-[#38bdf8] shadow-[0_0_15px_#38bdf8] rounded-full
                    qr-scan-line" />
                  <svg className="w-10 h-10 text-[#0EA5E9] drop-shadow-[0_0_8px_rgba(14,165,233,0.8)] animate-pulse" xmlns="http://www.w3.org/2000/svg"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="text-[#38bdf8] font-mono text-xs shadow-sm">CAMERA FEED ACTIVE&hellip;</p>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                  <svg className="w-10 h-10 text-[#475569] drop-shadow-md" xmlns="http://www.w3.org/2000/svg"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                  <p className="text-[#64748B] font-mono text-[10px] tracking-widest uppercase">Scanner Inactive</p>
                </div>
              )}
            </div>

            <button onClick={() => setScanning((v) => !v)}
              className={scanning ? "btn-danger px-6 py-2 shadow-[0_0_15px_rgba(239,68,68,0.4)]" : "btn-primary px-6 py-2 shadow-[0_0_15px_rgba(14,165,233,0.4)]"}>
              {scanning ? "Stop Scanner" : "Start Camera"}
            </button>

            <p className="text-[#94A3B8] text-xs mt-4 leading-relaxed max-w-sm mx-auto">
              Point the camera at a student's attendance QR code.<br />
              The system will mark them present automatically.
            </p>

            <div className="mt-6 pt-4 border-t border-[var(--color-border)] text-left bg-[#0F172A]/50 p-4 rounded-lg border border-[#1E293B]">
              <p className="text-[#0EA5E9] text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Note
              </p>
              <p className="text-[#94A3B8] text-xs leading-relaxed">
                QR scanner integration requires a browser with
                camera permissions. For bulk marking, use the
                <button onClick={() => setTab("manual")}
                  className="text-[#38bdf8] hover:text-[#7dd3fc] ml-1 font-semibold underline decoration-dashed underline-offset-2 transition-colors">
                  Manual Entry
                </button> tab.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Manual Entry */
        <div className="animate-fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5 card p-4 border-[#0EA5E9]/20 hover-lift shadow-sm">
            <div className="flex-1">
              <label className="block text-[#0EA5E9] text-[11px] font-bold
                uppercase tracking-widest mb-1.5 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                Session Date
              </label>
              <input className="dart-input py-2 text-sm max-w-[200px]" type="date"
                value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="bg-[var(--color-surface2)] border border-[var(--color-border)] px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_5px_#34d399] animate-pulse"></div>
                <span className="text-[#94A3B8] text-sm font-mono">
                  <span className="text-emerald-400 font-bold drop-shadow-sm">{presentCount}</span> / {students.length} present
                </span>
              </div>
              <button disabled className="btn-ghost py-1.5 px-3 text-sm text-[#94A3B8] cursor-not-allowed opacity-50">
                All Present
              </button>
              <button disabled className="btn-ghost py-1.5 px-3 text-sm text-[#94A3B8] cursor-not-allowed opacity-50">
                Clear
              </button>

            </div>
          </div>

          <div className="card overflow-hidden mb-6 hover-lift border-[#0EA5E9]/20 shadow-[0_4px_20px_rgba(14,165,233,0.05)]">
            {loading ? (
              <div className="p-5 space-y-3">
                {[1,2,3,4,5].map((i) => (
                  <div key={i} className="skeleton h-12 rounded-lg bg-[var(--color-surface2)] border border-[var(--color-border)]" />
                ))}
              </div>
            ) : students.length === 0 ? (
              <div className="p-10 border-t border-[var(--color-border)] text-center">
                <EmptyState icon="👥" title="No students found"
                  message="Register students to mark attendance." />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--color-border)] bg-gradient-to-r from-[var(--color-surface2)] to-transparent">
                      <th className="text-left py-4 px-5 text-[#94A3B8] text-[11px] font-bold uppercase tracking-widest">Student</th>
                      <th className="text-left py-4 px-5 text-[#94A3B8] text-[11px] font-bold uppercase tracking-widest hidden sm:table-cell">Email</th>
                      <th className="text-center py-4 px-5 text-[#94A3B8] text-[11px] font-bold uppercase tracking-widest">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border)]">
                    {students.map((s) => (
                      <tr key={s.id} className="dart-tr group hover:bg-[var(--color-hover)] transition-colors">

                        <td className="py-3 px-5">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-full flex items-center
                              justify-center text-sm font-bold flex-shrink-0 transition-all duration-300 shadow-sm border ${
                              present[s.id]
                                ? "bg-gradient-to-br from-emerald-500 to-emerald-400 text-white shadow-[0_0_10px_rgba(52,211,153,0.5)] border-emerald-400 scale-105"
                                : "bg-[var(--color-surface2)] text-[#64748B] border-[var(--color-border)] group-hover:border-[#0EA5E9]/50 group-hover:text-[#0EA5E9]"
                            }`}>
                              {s.name.charAt(0).toUpperCase()}
                            </div>
                            <span className={`font-semibold transition-colors ${present[s.id] ? "text-emerald-400 drop-shadow-[0_0_2px_rgba(52,211,153,0.3)]" : "text-[var(--color-text-main)] group-hover:text-[#0EA5E9]"}`}>{s.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-5 text-[#64748b] text-xs hidden sm:table-cell font-mono group-hover:text-[#94A3B8] transition-colors">{s.email}</td>
                        <td className="py-3 px-5 text-center">
                          <button disabled
                            className={`w-12 h-6 rounded-full transition-all duration-300 flex-shrink-0 relative inline-block border cursor-not-allowed ${
                              present[s.id] ? "bg-emerald-500 border-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-[var(--color-surface2)] border-[var(--color-border)] opacity-50"
                            }`}>
                            <span className={`absolute top-0.5 w-4 h-4 rounded-full
                              transition-all duration-300 shadow bg-[#f8fafc] ${present[s.id] ? "left-7 shadow-[0_0_5px_white]" : "left-0.5 opacity-50"}`} />
                          </button>

                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <button disabled
              className="px-8 py-3 text-sm font-bold tracking-wide transition-all flex items-center gap-2 bg-[var(--color-surface2)] text-[#475569] border border-[var(--color-border)] cursor-not-allowed opacity-50">
              <svg className="w-5 h-5 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
              MARKING HANDLED IN GOOGLE SHEETS
            </button>

          </div>
        </div>
      )}
    </AppLayout>
  );
}
