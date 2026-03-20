import { useState, useEffect, useMemo, useCallback } from "react";
import AppLayout from "../../components/AppLayout";
import AlertBanner from "../../components/ui/AlertBanner";
import EmptyState  from "../../components/ui/EmptyState";
import ScheduleCard, { SESSION_TYPES, TRACK_CLR, STATUS_CLR } from "../../components/ui/ScheduleCard";
import api from "../../api/axios";

/* ── helpers ─────────────────────────────────────────────── */
const token = () => localStorage.getItem("token");
const authH  = () => ({ headers: { Authorization: `Bearer ${token()}` } });

const TRACKS   = ["Common", "Drone", "Robotics", "IoT"];
const STATUSES = ["Upcoming", "Ongoing", "Completed"];
const TYPES    = Object.keys(SESSION_TYPES);

const EMPTY_FORM = {
  title: "", description: "", track: "Common", day: 1, date: "",
  start_time: "", end_time: "", venue: "", instructor: "",
  type: "workshop", status: "Upcoming",
};

function fmtDate(d) {
  if (!d) return "";
  const dt = new Date(d);
  return dt.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

/* ── Skeleton ────────────────────────────────────────────── */
function SkeletonRow() {
  return (
    <div className="animate-pulse flex items-center gap-4 px-5 py-4 border-b border-[var(--color-border)] bg-[var(--color-surface2)]">
      <div className="h-3 bg-[var(--color-border)] rounded w-32" />
      <div className="h-3 bg-[var(--color-border)] rounded w-24" />
      <div className="h-3 bg-[var(--color-border)] rounded w-20 ml-auto" />
      <div className="h-3 bg-[var(--color-border)] rounded w-16" />
    </div>
  );
}

/* ── Modal ───────────────────────────────────────────────── */
function ScheduleModal({ session, onClose, onSaved }) {
  const isEdit = !!session?.id;
  const [form, setForm]   = useState(isEdit ? { ...session } : { ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [err, setErr]     = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    if (!form.title.trim())      return "Title is required.";
    if (!form.date)              return "Date is required.";
    if (!form.start_time)        return "Start time is required.";
    if (!form.end_time)          return "End time is required.";
    if (form.start_time >= form.end_time)
      return "End time must be after start time.";
    return null;
  };

  const submit = async (e) => {
    e.preventDefault();
    const msg = validate();
    if (msg) { setErr(msg); return; }
    setErr(""); setSaving(true);
    try {
      if (isEdit) {
        await api.put(`/admin/schedules/${session.id}`, form, authH());
      } else {
        await api.post("/admin/schedules", form, authH());
      }
      onSaved();
    } catch (e) {
      const msg = e?.response?.data?.error || e?.message || "Failed to save. Please try again.";
      console.log("[AdminSchedule] save error:", e?.response?.data || e.message);
      setErr(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020617]/80 backdrop-blur-md"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="glass-panel rounded-2xl shadow-[0_8px_32px_rgba(14,165,233,0.3)] w-full max-w-2xl max-h-[90vh] flex flex-col border border-[#0EA5E9]/30">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)] bg-gradient-to-r from-[var(--color-surface2)] to-transparent rounded-t-2xl">
          <h2 className="text-lg font-bold text-[#0EA5E9] tracking-wide">
            {isEdit ? "EDIT SESSION" : "ADD NEW SESSION"}
          </h2>
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#94A3B8]
              hover:bg-[var(--color-hover)] hover:text-[#0EA5E9] transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={submit} className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {err && (
            <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2.5">
              {err}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Title *</label>
            <input value={form.title} onChange={e => set("title", e.target.value)}
              className="w-full border border-[var(--color-border)] bg-[var(--color-surface2)] text-[var(--color-text-main)] rounded-lg px-3 py-2 text-sm focus:outline-none
                focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9] focus:shadow-[0_0_8px_rgba(14,165,233,0.3)] transition-all"
              placeholder="Session title" />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Description</label>
            <textarea value={form.description} onChange={e => set("description", e.target.value)}
              rows={2}
              className="w-full border border-[var(--color-border)] bg-[var(--color-surface2)] text-[var(--color-text-main)] rounded-lg px-3 py-2 text-sm focus:outline-none
                focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9] focus:shadow-[0_0_8px_rgba(14,165,233,0.3)] transition-all resize-none"
              placeholder="Brief description (optional)" />
          </div>

          {/* Day */}
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Day</label>
            <select value={form.day} onChange={e => set("day", Number(e.target.value))}
              className="w-full border border-[var(--color-border)] bg-[var(--color-surface2)] text-[var(--color-text-main)] rounded-lg px-3 py-2 text-sm focus:outline-none
                focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9] focus:shadow-[0_0_8px_rgba(14,165,233,0.3)] transition-all">
              <option value={1}>Day 1</option>
              <option value={2}>Day 2</option>
              <option value={3}>Day 3</option>
              <option value={4}>Day 4</option>
              <option value={5}>Day 5</option>
              <option value={6}>Day 6</option>
              <option value={7}>Day 7</option>
            </select>
          </div>

          {/* Track + Type (2-col) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Track</label>
              <select value={form.track} onChange={e => set("track", e.target.value)}
                className="w-full border border-[var(--color-border)] bg-[var(--color-surface2)] text-[var(--color-text-main)] rounded-lg px-3 py-2 text-sm focus:outline-none
                  focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9] focus:shadow-[0_0_8px_rgba(14,165,233,0.3)] transition-all">
                {TRACKS.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Session Type</label>
              <select value={form.type} onChange={e => set("type", e.target.value)}
                className="w-full border border-[var(--color-border)] bg-[var(--color-surface2)] text-[var(--color-text-main)] rounded-lg px-3 py-2 text-sm focus:outline-none
                  focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9] focus:shadow-[0_0_8px_rgba(14,165,233,0.3)] transition-all capitalize">
                {TYPES.map(t => (
                  <option key={t} value={t} className="capitalize bg-[#0F172A] text-[#f8fafc]">
                    {SESSION_TYPES[t].label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date + Status (2-col) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Date *</label>
              <input type="date" value={form.date} onChange={e => set("date", e.target.value)}
                className="w-full border border-[var(--color-border)] bg-[var(--color-surface2)] text-[var(--color-text-main)] rounded-lg px-3 py-2 text-sm focus:outline-none
                  focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9] focus:shadow-[0_0_8px_rgba(14,165,233,0.3)] transition-all" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Status</label>
              <select value={form.status} onChange={e => set("status", e.target.value)}
                className="w-full border border-[var(--color-border)] bg-[var(--color-surface2)] text-[var(--color-text-main)] rounded-lg px-3 py-2 text-sm focus:outline-none
                  focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9] focus:shadow-[0_0_8px_rgba(14,165,233,0.3)] transition-all">
                {STATUSES.map(s => <option key={s} className="bg-[#0F172A] text-[#f8fafc]">{s}</option>)}
              </select>
            </div>
          </div>

          {/* Times (2-col) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Start Time *</label>
              <input type="time" value={form.start_time} onChange={e => set("start_time", e.target.value)}
                className="w-full border border-[var(--color-border)] bg-[var(--color-surface2)] text-[var(--color-text-main)] rounded-lg px-3 py-2 text-sm focus:outline-none
                  focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9] focus:shadow-[0_0_8px_rgba(14,165,233,0.3)] transition-all" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1">End Time *</label>
              <input type="time" value={form.end_time} onChange={e => set("end_time", e.target.value)}
                className="w-full border border-[var(--color-border)] bg-[var(--color-surface2)] text-[var(--color-text-main)] rounded-lg px-3 py-2 text-sm focus:outline-none
                  focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9] focus:shadow-[0_0_8px_rgba(14,165,233,0.3)] transition-all" />
            </div>
          </div>

          {/* Venue + Instructor (2-col) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Venue</label>
              <input value={form.venue} onChange={e => set("venue", e.target.value)}
                className="w-full border border-[var(--color-border)] bg-[var(--color-surface2)] text-[var(--color-text-main)] rounded-lg px-3 py-2 text-sm focus:outline-none
                  focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9] focus:shadow-[0_0_8px_rgba(14,165,233,0.3)] transition-all"
                placeholder="e.g. Lab 3 / Main Hall" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Instructor / Speaker</label>
              <input value={form.instructor} onChange={e => set("instructor", e.target.value)}
                className="w-full border border-[var(--color-border)] bg-[var(--color-surface2)] text-[var(--color-text-main)] rounded-lg px-3 py-2 text-sm focus:outline-none
                  focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9] focus:shadow-[0_0_8px_rgba(14,165,233,0.3)] transition-all"
                placeholder="Full name" />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[var(--color-border)] bg-[var(--color-surface2)] rounded-b-2xl">
          <button onClick={onClose}
            className="btn-ghost px-4 py-2 text-sm font-medium">
            Cancel
          </button>
          <button onClick={submit} disabled={saving}
            className="btn-primary px-5 py-2 text-sm font-semibold shadow-[0_0_15px_rgba(14,165,233,0.4)] transition-all">
            {saving ? "Saving…" : isEdit ? "Save Changes" : "Add Session"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Delete Confirm Modal ─────────────────────────────────── */
function DeleteConfirm({ session, onClose, onDeleted }) {
  const [busy, setBusy] = useState(false);

  const confirm = async () => {
    setBusy(true);
    try {
      await api.delete(`/admin/schedules/${session.id}`, authH());
      onDeleted();
    } catch (e) {
      console.log("[AdminSchedule] delete error:", e?.response?.data || e.message);
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020617]/80 backdrop-blur-md"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="glass-panel rounded-2xl shadow-[0_8px_32px_rgba(239,68,68,0.2)] w-full max-w-md p-6 border border-rose-500/30">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center flex-shrink-0 border border-rose-500/20">
            <svg className="w-5 h-5 text-rose-500 drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-rose-400 tracking-wide text-base">Delete Session?</h3>
            <p className="text-sm text-[#94A3B8] mt-0.5">
              "<span className="font-semibold text-white">{session.title}</span>" will be permanently removed.
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onClose}
            className="btn-ghost px-4 py-2 text-sm font-medium">
            Cancel
          </button>
          <button onClick={confirm} disabled={busy}
            className="px-5 py-2 rounded-lg text-sm font-bold text-white
              bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 shadow-[0_0_15px_rgba(225,29,72,0.4)] disabled:opacity-50 transition-all">
            {busy ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══ AdminSchedule ═══════════════════════════════════════════ */
export default function AdminSchedule() {
  const [sessions, setSessions] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const [search,   setSearch]   = useState("");
  const [trackF,   setTrackF]   = useState("All");
  const [statusF,  setStatusF]  = useState("All");
  const [modal,    setModal]    = useState(null); // null | { mode: "add"|"edit", session? }
  const [delTarget, setDelTarget] = useState(null);

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const res = await api.get("/admin/schedules", authH());
      const data = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.schedules) ? res.data.schedules : [];
      console.log("[AdminSchedule] loaded", data.length, "sessions:", data);
      // Sort by date then start_time
      data.sort((a, b) => {
        const dateComp = (a.date ?? "").localeCompare(b.date ?? "");
        if (dateComp !== 0) return dateComp;
        return (a.start_time ?? "").localeCompare(b.start_time ?? "");
      });
      setSessions(data);
    } catch (e) {
      console.log("[AdminSchedule] load error:", e?.response?.data || e.message);
      setError(e?.response?.data?.error ?? "Failed to load schedule.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  /* Filtered list */
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return sessions.filter(s => {
      if (trackF  !== "All" && s.track  !== trackF)  return false;
      if (statusF !== "All" && s.status !== statusF) return false;
      if (q) {
        const hay = `${s.title} ${s.venue} ${s.instructor} ${s.track}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [sessions, search, trackF, statusF]);

  /* Group by date */
  const grouped = useMemo(() => {
    const map = {};
    filtered.forEach(s => {
      const d = s.date ?? "Undated";
      if (!map[d]) map[d] = [];
      map[d].push(s);
    });
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  const handleSaved = () => {
    setModal(null);
    load();
  };

  const handleDeleted = () => {
    setDelTarget(null);
    load();
  };

  return (
    <AppLayout role="admin" pageTitle="Schedule Management">
      {/* Error banner */}
      {error && (
        <div className="mb-4">
          <AlertBanner variant="error" onClose={() => setError("")}>{error}</AlertBanner>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        {/* Search */}
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0EA5E9]"
            fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1116.65 2a7.5 7.5 0 010 14.65z" />
          </svg>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search sessions, venue, instructor…"
            className="w-full pl-9 pr-4 py-2 border border-[var(--color-border)] bg-[var(--color-surface2)] text-[var(--color-text-main)] rounded-lg text-sm
              focus:outline-none focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9] focus:shadow-[0_0_8px_rgba(14,165,233,0.3)] transition-all" />
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-shrink-0">
          <select value={trackF} onChange={e => setTrackF(e.target.value)}
            className="border border-[var(--color-border)] bg-[var(--color-surface2)] text-[var(--color-text-main)] rounded-lg px-3 py-2 text-sm
              focus:outline-none focus:border-[#0EA5E9] hover:border-[#0EA5E9] transition-colors">
            <option value="All" className="bg-[#0F172A] text-[#f8fafc]">All Tracks</option>
            {TRACKS.map(t => <option key={t} className="bg-[#0F172A] text-[#f8fafc]">{t}</option>)}
          </select>
          <select value={statusF} onChange={e => setStatusF(e.target.value)}
            className="border border-[var(--color-border)] bg-[var(--color-surface2)] text-[var(--color-text-main)] rounded-lg px-3 py-2 text-sm
              focus:outline-none focus:border-[#0EA5E9] hover:border-[#0EA5E9] transition-colors">
            <option value="All" className="bg-[#0F172A] text-[#f8fafc]">All Status</option>
            {STATUSES.map(s => <option key={s} className="bg-[#0F172A] text-[#f8fafc]">{s}</option>)}
          </select>
          <button
            onClick={() => setModal({ mode: "add" })}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold
              text-white bg-gradient-to-r from-[#0EA5E9] to-[#3B82F6] hover:from-[#3B82F6] hover:to-[#2563EB] shadow-[0_0_15px_rgba(14,165,233,0.4)] transition-all flex-shrink-0">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Add Session
          </button>
        </div>
      </div>

      {/* Count badge */}
      {!loading && (
        <p className="text-xs text-[#64748B] mb-4">
          Showing <span className="font-semibold text-[#1E3A8A]">{filtered.length}</span> session
          {filtered.length !== 1 ? "s" : ""} of {sessions.length} total
        </p>
      )}

      {/* Content */}
      {loading ? (
        <div className="card overflow-hidden">
          {[...Array(5)].map((_, i) => <SkeletonRow key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title={sessions.length === 0 ? "No sessions yet" : "No matching sessions"}
          message={
            sessions.length === 0
              ? "Add your first schedule session to get started."
              : "Try adjusting the search or filters."
          }
          action={sessions.length === 0 ? (
            <button
              onClick={() => setModal({ mode: "add" })}
              className="btn-primary px-4 py-2 text-sm">
              Add Session
            </button>
          ) : undefined}
        />
      ) : (
        <div className="space-y-6">
          {grouped.map(([date, items]) => (
            <section key={date}>
              {/* Date header */}
              <div className="flex items-center gap-3 mb-4 mt-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-gradient-to-r from-[#0ea5e9]/20 to-transparent border-l-2 border-[#0EA5E9]">
                  <svg className="w-4 h-4 text-[#0EA5E9]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm font-bold text-white tracking-wide">{fmtDate(date)}</span>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-[var(--color-border)] to-transparent" />
                <span className="text-xs text-[#0EA5E9] font-medium font-mono bg-[var(--color-surface2)] px-2 py-0.5 rounded border border-[#0EA5E9]/30">{items.length} sessions</span>
              </div>

              {/* Session cards with admin actions */}
              <div className="space-y-2.5">
                {items.map(s => {
                  const now = new Date();
                  const today = now.toISOString().slice(0, 10);
                  const isToday = s.date === today;
                  const nowTime = now.toTimeString().slice(0, 5);
                  const isLive = isToday && nowTime >= s.start_time && nowTime <= s.end_time;
                  const isCompleted = s.status === "Completed" ||
                    (isToday && nowTime > s.end_time) ||
                    (!isToday && s.date < today);

                  return (
                    <div key={s.id} className="group/row relative">
                      <ScheduleCard
                        title={s.title}
                        description={s.description}
                        track={s.track}
                        startTime={s.start_time}
                        endTime={s.end_time}
                        venue={s.venue}
                        instructor={s.instructor}
                        type={s.type}
                        status={s.status}
                        isLive={isLive}
                        isCompleted={isCompleted}
                      />
                      {/* Action overlay */}
                      <div className="absolute top-3 right-3 flex gap-1.5
                        opacity-0 group-hover/row:opacity-100 transition-opacity">
                        <button
                          onClick={() => setModal({ mode: "edit", session: s })}
                          className="p-1.5 rounded-lg bg-[var(--color-surface2)] border border-[var(--color-border)] shadow-sm
                            text-[#94A3B8] hover:text-[#0EA5E9] hover:border-[#0EA5E9] hover:bg-[var(--color-hover)] transition-colors"
                          title="Edit">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setDelTarget(s)}
                          className="p-1.5 rounded-lg bg-[var(--color-surface2)] border border-red-500/30 shadow-sm
                            text-[#94A3B8] hover:text-red-500 hover:border-red-500 hover:bg-red-500/10 transition-colors"
                          title="Delete">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* Modals */}
      {modal?.mode === "add"  && <ScheduleModal onClose={() => setModal(null)} onSaved={handleSaved} />}
      {modal?.mode === "edit" && (
        <ScheduleModal session={modal.session} onClose={() => setModal(null)} onSaved={handleSaved} />
      )}
      {delTarget && (
        <DeleteConfirm session={delTarget} onClose={() => setDelTarget(null)} onDeleted={handleDeleted} />
      )}
    </AppLayout>
  );
}
