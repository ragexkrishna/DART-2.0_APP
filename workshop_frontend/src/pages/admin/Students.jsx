import { useEffect, useState, useMemo } from "react";
import AppLayout from "../../components/AppLayout";
import Badge from "../../components/ui/Badge";
import EmptyState from "../../components/ui/EmptyState";
import AlertBanner from "../../components/ui/AlertBanner";
import api from "../../api/axios";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState("");
  const [error,    setError]    = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    api.get("/admin/students", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => setStudents(r.data))
      .catch((err) => { if (!err.response) setError("Failed to load students."); })
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return students;
    const q = search.toLowerCase();
    return students.filter(
      (s) => s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q)
    );
  }, [students, search]);

  /* CSV export */
  const exportCSV = () => {
    const rows = [["ID", "Name", "Email"],
      ...students.map((s) => [s.id, s.name, s.email])];
    const csv  = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url; a.download = "participants.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AppLayout role="admin" pageTitle="Students">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0EA5E9]"
            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            className="w-full pl-9 pr-4 py-2 text-sm bg-[var(--color-surface2)] border border-[var(--color-border)] rounded-lg text-white focus:outline-none focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9] transition-all shadow-sm"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-4 sm:ml-auto">
          <span className="text-[#94A3B8] font-mono text-sm bg-[var(--color-surface2)] px-3 py-1.5 rounded-lg border border-[var(--color-border)] shadow-sm">
            {loading ? "—" : <><strong className="text-[#0EA5E9]">{filtered.length}</strong> / {students.length}</>}
          </span>
          <button onClick={exportCSV} disabled={students.length === 0}
            className="btn-ghost py-2 px-4 text-sm flex items-center gap-2 text-[#0EA5E9] hover:bg-[#0EA5E9]/10 border border-transparent hover:border-[#0EA5E9]/30 font-bold tracking-wide transition-all shadow-sm disabled:opacity-50">
            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            EXPORT CSV
          </button>
        </div>
      </div>

      {error && <div className="mb-5"><AlertBanner variant="error">{error}</AlertBanner></div>}

      <div className="card overflow-hidden hover-lift border-[#0EA5E9]/20 shadow-[0_4px_20px_rgba(14,165,233,0.05)] animate-fade-in">
        {loading ? (
          <div className="p-5 space-y-3">
            {[1,2,3,4,5].map((i) => (
              <div key={i} className="skeleton h-12 rounded-lg bg-[var(--color-surface2)] border border-[var(--color-border)]" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-10 border-t border-[var(--color-border)] text-center">
            <EmptyState icon="👥"
              title={search ? "No matches found" : "No students yet"}
              message={search ? "Try a different search term." : "Registered participants will appear here."} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-gradient-to-r from-[var(--color-surface2)] to-transparent">
                  <th className="text-left py-4 px-5 text-[#94A3B8] font-bold text-[11px] uppercase tracking-widest">#</th>
                  <th className="text-left py-4 px-5 text-[#94A3B8] font-bold text-[11px] uppercase tracking-widest">Name</th>
                  <th className="text-left py-4 px-5 text-[#94A3B8] font-bold text-[11px] uppercase tracking-widest">Email</th>
                  <th className="text-left py-4 px-5 text-[#94A3B8] font-bold text-[11px] uppercase tracking-widest hidden md:table-cell">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {filtered.map((s, i) => (
                  <tr key={s.id} className="dart-tr group hover:bg-[var(--color-hover)] transition-colors">
                    <td className="py-4 px-5 text-[#475569] font-mono font-bold group-hover:text-[#0EA5E9] transition-colors">{i + 1}</td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0EA5E9] to-[#3B82F6] flex items-center
                          justify-center text-white font-bold text-sm flex-shrink-0 shadow-[0_0_10px_rgba(14,165,233,0.3)] group-hover:scale-110 transition-transform duration-300">
                          {s.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-[var(--color-text-main)] font-semibold group-hover:text-[#0EA5E9] transition-colors">{s.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-5 text-[#94A3B8] text-xs font-mono group-hover:text-white transition-colors">{s.email}</td>
                    <td className="py-4 px-5 hidden md:table-cell">
                      <Badge variant="info" className="shadow-sm">Student</Badge>
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
