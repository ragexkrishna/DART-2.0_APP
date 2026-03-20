import { useEffect, useState } from "react";
import AppLayout from "../../components/AppLayout";
import api from "../../api/axios";

const ANN_TYPE = {
  important: { label: "Important", cls: "bg-red-100   text-red-700   border-red-200"   },
  reminder:  { label: "Reminder",  cls: "bg-amber-100 text-amber-700 border-amber-200" },
  update:    { label: "Update",    cls: "bg-blue-100  text-blue-700  border-blue-200"  },
  live:      { label: "Live",      cls: "bg-green-100 text-green-700 border-green-200" },
  general:   { label: "General",   cls: "bg-slate-100 text-slate-600 border-slate-200" },
};

const BORDER = {
  important: "#DC2626",
  live:      "#059669",
  reminder:  "#F59E0B",
  update:    "#2563EB",
  general:   "#94A3B8",
};

function fmtDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function StudentAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    api.get("/student/announcements", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => setAnnouncements(r.data))
      .catch((err) => console.error("Failed to load announcements", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppLayout role="student" pageTitle="Announcements">
      {/* Header card */}
      <div className="card p-4 mb-5 flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-[#DBEAFE] flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-[#1E3A8A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
              d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.158M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-[#0F172A]">All Announcements</p>
          <p className="text-xs text-[#64748B] mt-0.5">
            {loading ? "Loading..." : `${announcements.length} announcement${announcements.length !== 1 ? "s" : ""} from the DART 2K26 organiser.`}
          </p>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="skeleton h-24 rounded-xl" />)}
        </div>
      ) : announcements.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <svg className="w-12 h-12 text-[#CBD5E1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.158M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>
          <p className="text-[#94A3B8] font-medium">No announcements yet</p>
          <p className="text-[#CBD5E1] text-sm">Check back later for updates from the organiser.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {announcements.map((a, i) => {
            const tc = ANN_TYPE[a.type] || ANN_TYPE.general;
            return (
              <div
                key={a.id ?? i}
                className="card p-4 hover:border-[#BFDBFE] hover:bg-[#F8FAFC] transition-all duration-200 animate-fade-in"
                style={{
                  borderLeft: `4px solid ${BORDER[a.type] || BORDER.general}`,
                  animationDelay: `${i * 50}ms`,
                }}
              >
                {/* Top row: badges + meta */}
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  {a.type === "live" && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
                  )}
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${tc.cls}`}>
                    {tc.label}
                  </span>
                  {a.createdAt && (
                    <span className="text-[#94A3B8] text-[10px] ml-auto">{fmtDate(a.createdAt)}</span>
                  )}
                </div>

                {/* Title */}
                <p className="text-[#0F172A] text-sm font-semibold leading-snug">{a.title}</p>

                {/* Description */}
                {a.description && (
                  <p className="text-[#475569] text-xs mt-1.5 leading-relaxed">{a.description}</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </AppLayout>
  );
}
