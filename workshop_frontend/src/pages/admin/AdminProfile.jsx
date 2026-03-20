import { useState, useRef } from "react";
import AppLayout from "../../components/AppLayout";
import AlertBanner from "../../components/ui/AlertBanner";
import Badge from "../../components/ui/Badge";

export default function AdminProfile() {
  const role        = "admin";
  const storedName  = localStorage.getItem("name")  || "";
  const storedEmail = localStorage.getItem("email") || "";

  const [name,       setName]       = useState(storedName);
  const [email,      setEmail]      = useState(storedEmail);
  const [university, setUniversity] = useState(localStorage.getItem("university") || "");
  const [success,    setSuccess]    = useState("");
  const [error,      setError]      = useState("");
  const [saving,     setSaving]     = useState(false);
  const [photo,      setPhoto]      = useState(localStorage.getItem("photo") || "");
  const fileRef = useRef(null);

  const initial = (name || email || "A").charAt(0).toUpperCase();

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      localStorage.setItem("photo", dataUrl);
      setPhoto(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(""); setSaving(true);
    try {
      localStorage.setItem("name",       name);
      localStorage.setItem("email",      email);
      localStorage.setItem("university", university);
      setSuccess("Profile updated successfully.");
    } catch {
      setError("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppLayout role={role} pageTitle="Admin Profile">
      <div className="max-w-2xl space-y-5">

        {/* Avatar + role card */}
        <div className="card p-5 flex items-center gap-4 hover-lift">
          <div className="relative flex-shrink-0">
            {photo ? (
              <img src={photo} alt="Profile" className="w-16 h-16 rounded-full object-cover
                border-2 border-[#0EA5E9] shadow-[0_4px_12px_rgba(14,165,233,0.3)]" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#0EA5E9] to-[#8B5CF6] shadow-[0_4px_12px_rgba(14,165,233,0.3)] flex items-center
                justify-center text-white font-bold text-2xl border-2 border-[var(--color-surface)]">
                {initial}
              </div>
            )}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full
                bg-[#0EA5E9] flex items-center justify-center border-2 border-[var(--color-surface)]
                hover:bg-[#3B82F6] shadow-sm transition-colors"
              title="Upload profile photo">
              <svg className="w-3 h-3 text-white" xmlns="http://www.w3.org/2000/svg"
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                  d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-[#0F172A] font-semibold text-base truncate">
              {name || "Unnamed Admin"}
            </p>
            <p className="text-[#475569] text-sm truncate">{email || "-"}</p>
            {university && (
              <p className="text-[#475569] text-xs mt-0.5 truncate">{university}</p>
            )}
          </div>

          <div className="flex-shrink-0">
            <Badge variant="info">Faculty</Badge>
          </div>
        </div>

        {/* Profile form */}
        <div className="card p-5 hover-lift">
          <p className="section-label-gradient mb-5">Personal Information</p>

          {success && <div className="mb-5"><AlertBanner variant="success" onClose={() => setSuccess("")}>{success}</AlertBanner></div>}
          {error   && <div className="mb-5"><AlertBanner variant="error"   onClose={() => setError("")}>{error}</AlertBanner></div>}

          <form onSubmit={saveProfile} className="space-y-4">
            <div>
              <label className="block text-[#94A3B8] text-[11px] font-semibold
                uppercase tracking-widest mb-1.5">Full Name</label>
              <input className="dart-input" type="text" placeholder="Your full name"
                value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div>
              <label className="block text-[#94A3B8] text-[11px] font-semibold
                uppercase tracking-widest mb-1.5">Email Address</label>
              <input className="dart-input" type="email" placeholder="your@email.com"
                value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div>
              <label className="block text-[#94A3B8] text-[11px] font-semibold
                uppercase tracking-widest mb-1.5">Organization / Department</label>
              <input className="dart-input" type="text"
                placeholder="e.g. Sharda University, Department of ECE"
                value={university} onChange={(e) => setUniversity(e.target.value)} />
            </div>

            <div>
              <label className="block text-[#94A3B8] text-[11px] font-semibold
                uppercase tracking-widest mb-1.5">Role</label>
              <div className="dart-input flex items-center gap-2 !cursor-default select-none border-dashed border-[var(--color-border)] bg-[var(--color-surface2)] opacity-70">
                <Badge variant="info">Faculty</Badge>
                <span className="text-[#94A3B8] text-xs">(cannot be changed)</span>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button type="submit" disabled={saving} className="btn-primary px-6 py-2.5 text-sm">
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </form>
        </div>

        {/* Session / danger zone */}
        <div className="card p-5 border-rose-500/30 bg-rose-500/5 hover:border-rose-500/50 hover:shadow-[0_4px_15px_rgba(244,63,94,0.1)] transition-all">
          <p className="text-rose-500 font-bold uppercase tracking-widest text-xs mb-3">Session</p>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[#475569] text-sm">Sign out of this device</p>
              <p className="text-[#475569] text-xs mt-0.5">
                You will be redirected to the login page.
              </p>
            </div>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = "/login";
              }}
              className="btn-danger py-2 px-4 text-sm flex-shrink-0">
              Sign Out
            </button>
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
