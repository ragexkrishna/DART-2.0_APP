import { useState, useRef } from "react";
import AppLayout from "../components/AppLayout";
import AlertBanner from "../components/ui/AlertBanner";
import Badge from "../components/ui/Badge";

export default function Profile() {
  const role      = localStorage.getItem("role") || "student";
  const storedName  = localStorage.getItem("name")  || "";
  const storedEmail = localStorage.getItem("email") || "";

  const [name,        setName]        = useState(storedName);
  const [email,       setEmail]       = useState(storedEmail);
  const [university,  setUniversity]  = useState(localStorage.getItem("university") || "");
  const [currentPwd,  setCurrentPwd]  = useState("");
  const [newPwd,      setNewPwd]      = useState("");
  const [confirmPwd,  setConfirmPwd]  = useState("");
  const [success,     setSuccess]     = useState("");
  const [pwdSuccess,  setPwdSuccess]  = useState("");
  const [error,       setError]       = useState("");
  const [pwdError,    setPwdError]    = useState("");
  const [saving,      setSaving]      = useState(false);
  const [showPwd,     setShowPwd]     = useState(false);
  const [photo,       setPhoto]       = useState(localStorage.getItem("photo") || "");
  const fileRef = useRef(null);

  const initial = (name || email || "U").charAt(0).toUpperCase();

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
      // Persist to localStorage (no dedicated /profile endpoint yet)
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

  const changePassword = (e) => {
    e.preventDefault();
    setPwdError(""); setPwdSuccess("");
    if (!currentPwd) { setPwdError("Enter your current password."); return; }
    if (newPwd.length < 6) { setPwdError("New password must be at least 6 characters."); return; }
    if (newPwd !== confirmPwd) { setPwdError("New passwords do not match."); return; }
    // In a full implementation this would call an API endpoint
    setPwdSuccess("Password changed. (Pending backend integration.)");
    setCurrentPwd(""); setNewPwd(""); setConfirmPwd("");
  };

  return (
    <AppLayout role={role} pageTitle="My Profile">
      <div className="max-w-2xl space-y-5">

        {/* Avatar + role card */}
        <div className="card p-5 flex items-center gap-4">
          <div className="relative flex-shrink-0">
            {photo ? (
              <img src={photo} alt="Profile" className="w-16 h-16 rounded-full object-cover
                border-2 border-[#E2E8F0]" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-[#DBEAFE] flex items-center
                justify-center text-blue-700 font-bold text-2xl border-2 border-[#E2E8F0]">
                {initial}
              </div>
            )}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full
                bg-[#1E3A8A] flex items-center justify-center border border-white
                hover:bg-[#1D4ED8] transition-colors"
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
              {name || "Unnamed User"}
            </p>
            <p className="text-[#475569] text-sm truncate">{email || "-"}</p>
            {university && (
              <p className="text-[#475569] text-xs mt-0.5 truncate">{university}</p>
            )}
          </div>

          <div className="flex-shrink-0">
            <Badge variant={role === "admin" ? "info" : "neutral"}>
              {role === "admin" ? "Admin" : "Student"}
            </Badge>
          </div>
        </div>

        {/* Profile form */}
        <div className="card p-5">
          <p className="section-label mb-5">Personal Information</p>

          {success && <div className="mb-5"><AlertBanner variant="success" onClose={() => setSuccess("")}>{success}</AlertBanner></div>}
          {error   && <div className="mb-5"><AlertBanner variant="error"   onClose={() => setError("")}>{error}</AlertBanner></div>}

          <form onSubmit={saveProfile} className="space-y-4">
            <div>
              <label className="block text-[#64748b] text-[11px] font-semibold
                uppercase tracking-widest mb-1.5">Full Name</label>
              <input className="dart-input" type="text" placeholder="Your full name"
                value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div>
              <label className="block text-[#64748b] text-[11px] font-semibold
                uppercase tracking-widest mb-1.5">Email Address</label>
              <input className="dart-input" type="email" placeholder="your@email.com"
                value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div>
              <label className="block text-[#64748b] text-[11px] font-semibold
                uppercase tracking-widest mb-1.5">University / College</label>
              <input className="dart-input" type="text"
                placeholder="e.g. Sharda University, Greater Noida"
                value={university} onChange={(e) => setUniversity(e.target.value)} />
            </div>

            <div>
              <label className="block text-[#64748b] text-[11px] font-semibold
                uppercase tracking-widest mb-1.5">Role</label>
              <div className="dart-input flex items-center gap-2 !cursor-default select-none">
                <Badge variant={role === "admin" ? "info" : "neutral"}>
                  {role === "admin" ? "Faculty" : "Student / Participant"}
                </Badge>
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

        {/* Change password */}
        <div className="card p-5">
          <p className="section-label mb-5">Change Password</p>

          {pwdSuccess && <div className="mb-5"><AlertBanner variant="success" onClose={() => setPwdSuccess("")}>{pwdSuccess}</AlertBanner></div>}
          {pwdError   && <div className="mb-5"><AlertBanner variant="error"   onClose={() => setPwdError("")}>{pwdError}</AlertBanner></div>}

          <form onSubmit={changePassword} className="space-y-4">
            <div>
              <label className="block text-[#64748b] text-[11px] font-semibold
                uppercase tracking-widest mb-1.5">Current Password</label>
              <div className="relative">
                <input className="dart-input pr-16"
                  type={showPwd ? "text" : "password"}
                  placeholder="Your current password"
                  value={currentPwd}
                  onChange={(e) => setCurrentPwd(e.target.value)} />
                <button type="button" tabIndex={-1}
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2
                    text-[#475569] hover:text-[#94a3b8] text-[10px] font-bold
                    tracking-widest uppercase transition-colors">
                  {showPwd ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[#64748b] text-[11px] font-semibold
                uppercase tracking-widest mb-1.5">New Password</label>
              <input className="dart-input"
                type={showPwd ? "text" : "password"}
                placeholder="Min. 6 characters"
                value={newPwd}
                onChange={(e) => setNewPwd(e.target.value)} />
            </div>

            <div>
              <label className="block text-[#64748b] text-[11px] font-semibold
                uppercase tracking-widest mb-1.5">Confirm New Password</label>
              <input className={`dart-input ${
                confirmPwd && confirmPwd !== newPwd ? "border-rose-700/60" : ""
              }`}
                type={showPwd ? "text" : "password"}
                placeholder="Repeat new password"
                value={confirmPwd}
                onChange={(e) => setConfirmPwd(e.target.value)} />
              {confirmPwd && confirmPwd !== newPwd && (
                <p className="text-red-600 text-xs mt-1">Passwords do not match</p>
              )}
            </div>

            <div className="flex justify-end pt-1">
              <button type="submit"
                disabled={!!confirmPwd && confirmPwd !== newPwd}
                className="btn-ghost px-6 py-2.5 text-sm">
                Update Password
              </button>
            </div>
          </form>
        </div>

        {/* Danger zone */}
        <div className="card p-5 border-red-200">
          <p className="section-label text-red-500 mb-3">Session</p>
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
