import { useState, useEffect, useMemo } from "react";
import AppLayout from "../../components/AppLayout";
import AlertBanner from "../../components/ui/AlertBanner";
import api from "../../api/axios";



const starStr = (n) => "★".repeat(n);


const EMOJI_MAP = {
  1: { emoji: "😞", label: "Very Bad"  },
  2: { emoji: "😕", label: "Poor"      },
  3: { emoji: "😐", label: "Okay"      },
  4: { emoji: "🙂", label: "Good"      },
  5: { emoji: "😄", label: "Excellent" },
};

function StarRating({ rating, onChange }) {
  const [hovered, setHovered] = useState(0);
  const active = hovered || rating;
  return (
    <div className="flex items-center gap-0.5 flex-wrap">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="p-1 transition-transform duration-100 hover:scale-125 focus:outline-none"
          aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
        >
          <span className={`text-4xl leading-none transition-colors duration-150 ${
            star <= active ? "text-amber-400" : "text-[#E2E8F0]"
          }`}>★</span>
        </button>
      ))}
      {active > 0 && (
        <div className="ml-3 flex items-center gap-2">
          <span className="text-2xl" role="img" aria-label={EMOJI_MAP[active].label}>
            {EMOJI_MAP[active].emoji}
          </span>
          <span className="text-[#1E3A8A] text-sm font-semibold">
            {EMOJI_MAP[active].label}
          </span>
        </div>
      )}
    </div>
  );
}

export default function Feedback() {
  const [existingFeedback, setExistingFeedback] = useState(null);
  const [rating,  setRating]  = useState(0);
  const [text,    setText]    = useState("");
  const [success, setSuccess] = useState("");
  const [error,   setError]   = useState("");
  const [saving,  setSaving]  = useState(false);
  const [loading, setLoading] = useState(true);


  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    api.get("/student/feedback", { headers })
      .then(res => setExistingFeedback(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");

    if (!rating)      return setError("Please select a rating.");
    if (!text.trim()) return setError("Please enter your feedback before submitting.");

    setSaving(true);
    try {
      const res = await api.post("/student/feedback", {
        rating,
        text: text.trim()
      }, { headers });
      
      setSuccess("Thank you! Your feedback has been submitted successfully.");

      setExistingFeedback(res.data);
      setRating(0); setTrack(""); setText("");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to submit feedback. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AppLayout role="student" pageTitle="Workshop Feedback">
        <div className="max-w-2xl animate-pulse">
           <div className="card h-32 mb-5" />
           <div className="card h-64" />
        </div>
      </AppLayout>
    );
  }


  /* â”€â”€ Already submitted â€“ read-only confirmation view â”€â”€ */
  if (existingFeedback) {
    return (
      <AppLayout role="student" pageTitle="Workshop Feedback">
        <div className="max-w-2xl">
          <div className="card p-6 mb-5">
            <p className="section-label mb-1">Share Your Experience</p>
            <p className="text-[#64748b] text-sm">
              Your feedback helps us improve DART 2K26 workshops. All responses are reviewed by the organizing team.
            </p>
          </div>

          <div className="card p-8 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-[#DCFCE7] flex items-center
              justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[#16A34A]" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-[#0F172A] font-bold text-lg mb-1">Feedback Submitted</p>
            <p className="text-[#64748b] text-sm mb-6">
              You have already submitted your feedback.
            </p>

            {/* Read-only summary */}
            <div className="text-left bg-[#F8FAFC] rounded-xl p-5 border border-[#E2E8F0] space-y-4">
              <div>
                <p className="text-[#64748b] text-[11px] font-semibold uppercase tracking-widest mb-1">
                  Workshop Track
                </p>
                <p className="text-[#0F172A] text-sm font-medium">{existingFeedback.track}</p>
              </div>
              <div>
                <p className="text-[#64748b] text-[11px] font-semibold uppercase tracking-widest mb-1">
                  Rating
                </p>
                <p className="text-[#0F172A] text-sm">
                  {starStr(existingFeedback.rating)} &nbsp;({existingFeedback.rating}/5)
                </p>
              </div>
              <div>
                <p className="text-[#64748b] text-[11px] font-semibold uppercase tracking-widest mb-1">
                  Your Comment
                </p>
                <p className="text-[#475569] text-sm leading-relaxed">{existingFeedback.text}</p>
              </div>
              <div>
                <p className="text-[#64748b] text-[11px] font-semibold uppercase tracking-widest mb-1">
                  Submitted On
                </p>
                <p className="text-[#94A3B8] text-xs">
                  {new Date(existingFeedback.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric", month: "long", year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  /* â”€â”€ Normal form â”€â”€ */
  return (
    <AppLayout role="student" pageTitle="Workshop Feedback">
      {success && (
        <div className="mb-5">
          <AlertBanner variant="success" onClose={() => setSuccess("")}>{success}</AlertBanner>
        </div>
      )}
      {error && (
        <div className="mb-5">
          <AlertBanner variant="error" onClose={() => setError("")}>{error}</AlertBanner>
        </div>
      )}

      <div className="max-w-2xl">
        <div className="card p-6 mb-5">
          <p className="section-label mb-1">Share Your Experience</p>
          <p className="text-[#64748b] text-sm">
            Your feedback helps us improve DART 2K26 workshops. All responses are reviewed by the organizing team.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card p-6 space-y-6">
          {/* Rating */}
          <div>
            <label className="block text-[#64748b] text-[11px] font-semibold uppercase tracking-widest mb-3">
              Overall Rating
            </label>
            <StarRating rating={rating} onChange={setRating} />
            {rating > 0 && (
              <p className="text-[#1E3A8A] text-xs mt-2 font-medium">Selected: {rating} / 5</p>
            )}
          </div>

          {/* Feedback text */}

          <div>
            <label className="block text-[#64748b] text-[11px] font-semibold uppercase tracking-widest mb-1.5">
              Your Feedback
            </label>
            <textarea value={text} onChange={(e) => setText(e.target.value)} rows={5}
              maxLength={500} placeholder="Share your thoughts about the sessions, instructors, facilities..."
              className="dart-input resize-none" />
            <p className="text-[#94A3B8] text-xs mt-1">{text.length} / 500 characters</p>
          </div>

          <button type="submit" disabled={saving} className="btn-primary w-full py-2.5 text-sm">
            {saving ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>
      </div>
    </AppLayout>
  );
}

