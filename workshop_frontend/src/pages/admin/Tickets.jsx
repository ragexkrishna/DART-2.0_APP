import { useEffect, useState } from "react";
import AppLayout from "../../components/AppLayout";
import Badge from "../../components/ui/Badge";
import AlertBanner from "../../components/ui/AlertBanner";
import EmptyState from "../../components/ui/EmptyState";
import api from "../../api/axios";

const STATUS_VARIANT = { open: "warning", resolved: "success", closed: "neutral" };

export default function AdminTickets() {
  const [tickets,  setTickets]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const [filter,   setFilter]   = useState("all");
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    api.get("/admin/tickets", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => setTickets(r.data))
      .catch((err) => {
        setError(
          err?.response?.data?.message
            || (err?.response ? `Error ${err.response.status}: Failed to load tickets.`
            : "Network error — could not load tickets. Check your connection.")
        );
      })
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    const token = localStorage.getItem("token");
    try {
      await api.patch(`/admin/tickets/${id}`, { status },
        { headers: { Authorization: `Bearer ${token}` } });
      setTickets((ts) => ts.map((t) => (t.id === id ? { ...t, status } : t)));
    } catch (err) {
      if (!err.response) setError("Network error — could not update ticket status.");
    }
  };

  const filtered = filter === "all"
    ? tickets
    : tickets.filter((t) => t.status === filter);

  const counts = {
    all:      tickets.length,
    open:     tickets.filter((t) => t.status === "open").length,
    resolved: tickets.filter((t) => t.status === "resolved").length,
    closed:   tickets.filter((t) => t.status === "closed").length,
  };

  return (
    <AppLayout role="admin" pageTitle="Support Tickets">

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-5">
        {[["all","All"],["open","Open"],["resolved","Resolved"],["closed","Closed"]].map(([v,l]) => (
          <button key={v} onClick={() => setFilter(v)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              filter === v
                ? "bg-gradient-to-r from-[#0EA5E9] to-[#3B82F6] text-white shadow-[0_2px_8px_rgba(14,165,233,0.3)]"
                : "bg-[var(--color-surface2)] border border-[var(--color-border)] text-[#94A3B8] hover:text-[#0EA5E9] hover:border-[#0EA5E9] hover:bg-[var(--color-hover)]"
            }`}>
            {l}
            <span className={`text-xs font-mono px-1.5 py-0.5 rounded shadow-sm ${
              filter === v ? "bg-white/20 text-white" : "bg-[var(--color-surface)] text-[#94A3B8] border border-[var(--color-border)]"
            }`}>{counts[v]}</span>
          </button>
        ))}
      </div>

      {error && <div className="mb-5"><AlertBanner variant="error">{error}</AlertBanner></div>}

      <div className="card overflow-hidden hover-lift">
        {loading ? (
          <div className="p-5 space-y-2">
            {[1,2,3,4].map((i) => <div key={i} className="skeleton h-14 rounded-lg" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8">
            <EmptyState icon="🎫" title="No tickets" message="No support tickets match this filter." />
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-border)]">
            {filtered.map((t) => (
              <div key={t.id} className="transition-colors duration-300">
                {/* Row */}
                <div
                  className={`flex items-start gap-3 px-4 py-3 hover:bg-[var(--color-hover)]
                    cursor-pointer transition-colors ${expanded === t.id ? 'bg-[var(--color-surface2)]' : ''}`}
                  onClick={() => setExpanded(expanded === t.id ? null : t.id)}>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="text-[#0F172A] font-semibold text-sm truncate">
                        {t.title}
                      </span>
                      <Badge variant={STATUS_VARIANT[t.status] || "neutral"}>
                        {t.status}
                      </Badge>
                    </div>
                    <p className="text-[#94A3B8] text-xs">
                      {t.student_name && <span className="font-medium text-[#475569]">{t.student_name}</span>}
                      {t.student_name && " · "}ID: <span className="font-mono text-[#0EA5E9]">{t.student_id}</span>
                    </p>
                  </div>

                  {/* Chevron */}
                  <svg className={`w-4 h-4 text-[#0EA5E9] flex-shrink-0 mt-0.5 transition-transform duration-300 ${
                    expanded === t.id ? "rotate-180" : ""
                  }`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {/* Expanded */}
                {expanded === t.id && (
                  <div className="px-4 pb-4 bg-gradient-to-b from-[var(--color-surface2)] to-transparent border-t border-[var(--color-border)] animate-fade-in">
                    <p className="text-[#475569] text-sm leading-relaxed mt-4 p-3 bg-white rounded-lg border border-[var(--color-border)] shadow-sm mb-4">
                      {t.description || "No description provided."}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {t.status !== "resolved" && (
                        <button onClick={() => updateStatus(t.id, "resolved")}
                          className="btn-success py-1.5 px-4 text-xs font-bold shadow-sm">
                          Mark Resolved
                        </button>
                      )}
                      {t.status !== "closed" && (
                        <button onClick={() => updateStatus(t.id, "closed")}
                          className="btn-ghost py-1.5 px-4 text-xs font-bold border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm hover:border-[#0EA5E9] hover:text-[#0EA5E9]">
                          Close Ticket
                        </button>
                      )}
                      {t.status !== "open" && (
                        <button onClick={() => updateStatus(t.id, "open")}
                          className="btn-warning py-1.5 px-4 text-xs font-bold shadow-sm">
                          Reopen
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
