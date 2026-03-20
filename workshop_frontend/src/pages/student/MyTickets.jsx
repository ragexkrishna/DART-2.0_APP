import { useEffect, useState, useCallback } from "react";
import AppLayout from "../../components/AppLayout";
import Badge from "../../components/ui/Badge";
import AlertBanner from "../../components/ui/AlertBanner";
import EmptyState from "../../components/ui/EmptyState";
import api from "../../api/axios";

const STATUS_VARIANT = { open: "warning", resolved: "success", closed: "neutral" };

/* Simple inline SVG QR placeholder */
function QRPlaceholder({ value }) {
  return (
    <div className="bg-[rgba(255,255,255,0.8)] backdrop-blur-md p-3 rounded-lg inline-block border border-[rgba(14,165,233,0.3)] shadow-[0_0_15px_rgba(14,165,233,0.15)]">
      <svg width="80" height="80" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
        {/* corner markers */}
        <rect x="1" y="1" width="7" height="7" fill="none" stroke="#000" strokeWidth="1.4"/>
        <rect x="3" y="3" width="3" height="3" fill="#000"/>
        <rect x="13" y="1" width="7" height="7" fill="none" stroke="#000" strokeWidth="1.4"/>
        <rect x="15" y="3" width="3" height="3" fill="#000"/>
        <rect x="1" y="13" width="7" height="7" fill="none" stroke="#000" strokeWidth="1.4"/>
        <rect x="3" y="15" width="3" height="3" fill="#000"/>
        {/* data pattern — derived from value length */}
        {Array.from({ length: 16 }).map((_, i) => {
          const shouldFill = (value.charCodeAt(i % value.length) + i) % 3 !== 0;
          const x = 9 + (i % 4) * 3;
          const y = 1 + Math.floor(i / 4) * 3;
          return shouldFill
            ? <rect key={i} x={x} y={y} width="2" height="2" fill="#000" />
            : null;
        })}
        {Array.from({ length: 12 }).map((_, i) => {
          const shouldFill = (value.charCodeAt(i % value.length) + i * 7) % 2 === 0;
          const x = 1 + (i % 4) * 2;
          const y = 9 + Math.floor(i / 4) * 3;
          return shouldFill
            ? <rect key={`b${i}`} x={x} y={y} width="1.5" height="1.5" fill="#000" />
            : null;
        })}
      </svg>
      <p className="text-[#0F172A] text-[9px] font-mono text-center mt-1 leading-tight truncate max-w-[80px]">
        {value}
      </p>
    </div>
  );
}

export default function MyTickets() {
  const [tickets,  setTickets]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const [success,  setSuccess]  = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form,     setForm]     = useState({ title: "", description: "" });
  const [submitting, setSubmitting] = useState(false);
  const [expanded, setExpanded] = useState(null);

  const studentId = localStorage.getItem("roll_number");

  const load = useCallback(() => {
    const token = localStorage.getItem("token");
    api.get("/student/tickets", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => setTickets(r.data))
      .catch(() => setError("Failed to load tickets."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(""); setSubmitting(true);
    const token = localStorage.getItem("token");
    try {
      await api.post("/student/tickets",
        { student_id: studentId, name: localStorage.getItem("name"), title: form.title, description: form.description },
        { headers: { Authorization: `Bearer ${token}` } });
      setSuccess("Ticket submitted successfully.");
      setForm({ title: "", description: "" });
      setShowForm(false);
      load();
    } catch {
      setError("Failed to submit ticket. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppLayout role="student" pageTitle="My Tickets">

      {/* Header row */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-[#64748b] text-sm">
          {loading ? "—" : `${tickets.length} ticket${tickets.length !== 1 ? "s" : ""}`}
        </p>
        <button onClick={() => setShowForm((v) => !v)} className="btn-primary py-2 px-4 text-sm">
          {showForm ? "Cancel" : "+ New Ticket"}
        </button>
      </div>

      {success && <div className="mb-5"><AlertBanner variant="success" onClose={() => setSuccess("")}>{success}</AlertBanner></div>}
      {!loading && error && <div className="mb-5"><AlertBanner variant="error" onClose={() => setError("")}>{error}</AlertBanner></div>}

      {/* New ticket form */}
      {showForm && (
        <div className="card p-5 mb-5 animate-fade-in hover-lift border-t-2 border-t-[#0EA5E9]">
          <p className="section-label-gradient mb-4">Submit New Ticket</p>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-[#94A3B8] text-[11px] font-semibold
                uppercase tracking-widest mb-1.5">Subject</label>
              <input className="dart-input" type="text" placeholder="Brief description of your issue"
                value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                required />
            </div>
            <div>
              <label className="block text-[#94A3B8] text-[11px] font-semibold
                uppercase tracking-widest mb-1.5">Details</label>
              <textarea className="dart-input min-h-[90px] resize-y"
                placeholder="Provide as much detail as possible…"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="flex justify-end">
              <button type="submit" disabled={submitting} className="btn-primary px-6 text-sm">
                {submitting ? "Submitting…" : "Submit Ticket"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Ticket list */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map((i) => <div key={i} className="skeleton h-20 rounded-xl" />)}
        </div>
      ) : tickets.length === 0 ? (
        <EmptyState icon="🎫" title="No tickets yet"
          message="Submit a support ticket if you need assistance."
          action={<button onClick={() => setShowForm(true)}
            className="btn-primary px-5 py-2 text-sm mt-3">
            New Ticket
          </button>} />
      ) : (
        <div className="space-y-3">
          {tickets.map((t) => (
            <div key={t.id} className={`card overflow-hidden transition-all duration-300 ${expanded === t.id ? 'border-[#0EA5E9] shadow-[0_4px_20px_rgba(14,165,233,0.15)]' : 'hover-lift'}`}>
              {/* Summary row */}
              <div className="flex items-start gap-4 p-5 cursor-pointer hover:bg-[var(--color-surface2)] transition-colors"
                onClick={() => setExpanded(expanded === t.id ? null : t.id)}>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-[#0F172A] font-semibold text-sm">{t.title}</span>
                    <Badge variant={STATUS_VARIANT[t.status] || "neutral"}>{t.status}</Badge>
                  </div>
                  <p className="text-[#94A3B8] text-xs font-mono">ID: {t.id}</p>
                </div>

                <svg className={`w-4 h-4 text-[#0EA5E9] flex-shrink-0 mt-0.5 transition-transform duration-300 ${
                  expanded === t.id ? "rotate-180" : ""
                }`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* Expanded */}
              {expanded === t.id && (
                <div className="px-5 pb-5 border-t border-[var(--color-border)] pt-4
                  bg-gradient-to-b from-[var(--color-surface2)] to-transparent animate-fade-in flex flex-col sm:flex-row gap-5">
                  <div className="flex-1">
                    <p className="text-[#0EA5E9] text-[11px] font-bold
                      uppercase tracking-widest mb-2">Description</p>
                    <p className="text-[#475569] text-sm leading-relaxed p-3 bg-white rounded-lg border border-[var(--color-border)] shadow-sm">
                      {t.description || "No additional details provided."}
                    </p>
                  </div>
                  {/* QR code for ticket identification */}
                  <div className="flex-shrink-0 flex flex-col items-center gap-2">
                    <QRPlaceholder value={`DART-TKT-${t.id}-${t.student_id}`} />
                    <span className="px-2.5 py-1 bg-[#E0F2FE] text-[#0284C7] rounded-md text-[9px] font-bold uppercase tracking-wider border border-[#BAE6FD]">
                      Scan Ticket
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  );
}
