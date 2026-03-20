import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import api from "../api/axios";
import AlertBanner from "../components/ui/AlertBanner";
import shardaLogo from "../assets/sharda-logo.jpg";
import shardaWorkshop from "../assets/sharda_workshop.png";

/* ── Password strength helper ── */
function getPwdStrength(pwd) {
  if (!pwd) return { score: 0, label: "", color: "" };
  let score = 0;
  if (pwd.length >= 6)  score++;
  if (pwd.length >= 10) score++;
  if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd) && /[^A-Za-z0-9]/.test(pwd)) score++;
  const map = [
    { label: "Too short", color: "bg-red-500"    },
    { label: "Weak",      color: "bg-orange-400" },
    { label: "Fair",      color: "bg-yellow-400" },
    { label: "Good",      color: "bg-blue-400"   },
    { label: "Strong",    color: "bg-emerald-500" },
  ];
  return { score, ...map[score] };
}

/* ── Field wrapper with label ── */
function Field({ label, children }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[#64748b] text-[11px] font-semibold uppercase tracking-widest">
        {label}
      </label>
      {children}
    </div>
  );
}

export default function Register() {
  const [form, setForm] = useState({
    name: "", email: "", university: "", phone: "", password: "", confirm: "", role: "student",
  });
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const navigate = useNavigate();

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  /* ── All existing API logic preserved exactly ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/auth/register", {
        name:     form.name,
        email:    form.email,
        password: form.password,
        role:     form.role,
      });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1800);
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const strength = getPwdStrength(form.password);
  const pwdMismatch = form.confirm && form.confirm !== form.password;

  return (
    <Motion.div
      className="min-h-screen flex bg-[#F8FAFC]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      {/* ── LEFT BRANDING PANEL ── */}
      <Motion.div
        className="hidden lg:flex lg:w-[44%] xl:w-[46%] flex-col justify-between
          p-12 bg-[#1E3A8A] relative overflow-hidden"
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{
          backgroundImage: `url(${shardaWorkshop})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark blue gradient overlay — dims photo for text readability */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(135deg, rgba(10,18,40,0.82) 0%, rgba(30,58,138,0.76) 100%)",
          }} />

        {/* Subtle grid */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px)," +
              "linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)",
            backgroundSize: "48px 48px",
          }} />

        {/* Radial overlay */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(circle at top right, rgba(15,23,42,0.45), transparent 55%)",
          }} />

        {/* Logo row */}
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-10">
            <img
              src={shardaLogo}
              alt="Sharda University"
              className="h-20 md:h-24 xl:h-28 w-auto object-contain pointer-events-none rounded-md bg-white p-2"
            />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 border border-white/30
                flex items-center justify-center text-white font-bold text-sm select-none">
                D
              </div>
              <div>
                <p className="text-white font-bold text-base leading-tight">DART 2K26</p>
              </div>
            </div>
          </div>

          <h1 className="text-3xl xl:text-4xl font-bold text-white leading-snug mb-4">
            Join the Future of<br />Tech Innovation
          </h1>
          <p className="text-blue-200 text-sm leading-relaxed max-w-sm">
            Register for the annual Drone, Robotics &amp; IoT Workshop — a premier
            inter-university competition at Sharda University.
          </p>
        </div>

        {/* Bottom feature pills */}
        <div className="relative z-10 space-y-3">
          {[
            { icon: "🛸", text: "Drone Racing &amp; Aerial Challenges" },
            { icon: "🤖", text: "Robotics Design Competition" },
            { icon: "📡", text: "IoT Innovation Showcase" },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-3">
              <span className="text-xl">{icon}</span>
              <span className="text-blue-100 text-sm" dangerouslySetInnerHTML={{ __html: text }} />
            </div>
          ))}
          <p className="text-blue-300 text-xs mt-4 pt-4 border-t border-white/10">
            Sharda University · Greater Noida · March 2026
          </p>
        </div>
      </Motion.div>

      {/* ── RIGHT FORM PANEL ── */}
      <div className="flex-1 flex items-start justify-center overflow-y-auto py-10 px-4 sm:px-8">
        <Motion.div
          className="w-full max-w-[480px]"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1, ease: "easeOut" }}
        >
          {/* Mobile logo row */}
          <div className="flex lg:hidden items-center justify-between mb-8">
            <img src={shardaLogo} alt="Sharda University"
              className="h-14 sm:h-16 w-auto object-contain rounded-md bg-white p-2" />
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#1E3A8A] flex items-center
                justify-center text-white font-bold text-sm select-none">D</div>
              <div>
                <p className="text-[#0F172A] font-bold text-sm leading-tight">DART 2K26</p>
                <p className="text-[#64748b] text-[10px] uppercase tracking-widest">Workshop</p>
              </div>
            </div>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-[0_4px_32px_rgba(30,58,138,0.08)]
            border border-[#E2E8F0] p-8">

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-[#0F172A] leading-tight">
                Register Account
              </h2>
              <p className="text-[#64748b] text-sm mt-1">
                Register as a DART 2K26 participant
              </p>
            </div>

            {success ? (
              <Motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <AlertBanner variant="success">
                  Registered Successfully! Redirecting to sign in…
                </AlertBanner>
              </Motion.div>
            ) : (
              <>
                {error && (
                  <div className="mb-5">
                    <AlertBanner variant="error" onClose={() => setError("")}>{error}</AlertBanner>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">

                  {/* Row: Name + Role */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Full Name">
                      <input
                        className="dart-input transition-all duration-200
                          focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A]"
                        type="text"
                        placeholder="Your full name"
                        value={form.name}
                        onChange={set("name")}
                        required
                      />
                    </Field>

                    <Field label="Role">
                      <select
                        className="dart-input transition-all duration-200
                          focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A]"
                        value={form.role}
                        onChange={set("role")}
                      >
                        <option value="student">Student / Participant</option>
                        <option value="admin">Faculty</option>
                      </select>
                    </Field>
                  </div>

                  {/* Email */}
                  <Field label="Email Address">
                    <input
                      className="dart-input transition-all duration-200
                        focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A]"
                      type="email"
                      placeholder="you@university.edu"
                      value={form.email}
                      onChange={set("email")}
                      required
                      autoComplete="email"
                    />
                  </Field>

                  {/* Row: University + Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="University / College">
                      <input
                        className="dart-input transition-all duration-200
                          focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A]"
                        type="text"
                        placeholder="e.g. Sharda University"
                        value={form.university}
                        onChange={set("university")}
                      />
                    </Field>

                    <Field label="Phone Number">
                      <input
                        className="dart-input transition-all duration-200
                          focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A]"
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={form.phone}
                        onChange={set("phone")}
                      />
                    </Field>
                  </div>

                  {/* Password */}
                  <Field label="Password">
                    <div className="relative">
                      <input
                        className="dart-input pr-16 transition-all duration-200
                          focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A]"
                        type={showPwd ? "text" : "password"}
                        placeholder="Min. 6 characters"
                        value={form.password}
                        onChange={set("password")}
                        required
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShowPwd((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2
                          text-[#475569] hover:text-[#94a3b8] text-[10px] font-bold
                          tracking-widest uppercase transition-colors select-none"
                      >
                        {showPwd ? "Hide" : "Show"}
                      </button>
                    </div>

                    {/* Password strength bars */}
                    {form.password && (
                      <Motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 space-y-1"
                      >
                        <div className="flex gap-1">
                          {[1, 2, 3, 4].map((i) => (
                            <div
                              key={i}
                              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                                i <= strength.score ? strength.color : "bg-[#E2E8F0]"
                              }`}
                            />
                          ))}
                        </div>
                        <p className={`text-[11px] font-medium ${
                          strength.score <= 1 ? "text-red-500" :
                          strength.score === 2 ? "text-yellow-600" :
                          strength.score === 3 ? "text-blue-500" : "text-emerald-600"
                        }`}>
                          {strength.label}
                        </p>
                      </Motion.div>
                    )}
                  </Field>

                  {/* Confirm Password */}
                  <Field label="Confirm Password">
                    <input
                      className={`dart-input transition-all duration-200
                        focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A]
                        ${pwdMismatch ? "border-red-400 focus:ring-red-200 focus:border-red-500" : ""}`}
                      type={showPwd ? "text" : "password"}
                      placeholder="Repeat your password"
                      value={form.confirm}
                      onChange={set("confirm")}
                      required
                      autoComplete="new-password"
                    />
                    {pwdMismatch && (
                      <Motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-red-500 text-xs mt-1"
                      >
                        Passwords do not match
                      </Motion.p>
                    )}
                  </Field>

                  {/* Submit */}
                  <Motion.button
                    type="submit"
                    disabled={loading || !!pwdMismatch}
                    whileHover={{ scale: loading ? 1 : 1.015 }}
                    whileTap={{ scale: loading ? 1 : 0.985 }}
                    className="btn-primary w-full py-3 text-sm font-semibold mt-2
                      disabled:opacity-60 disabled:cursor-not-allowed
                      transition-all duration-200"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10"
                            stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Registering account…
                      </span>
                    ) : "Register"}
                  </Motion.button>

                </form>
              </>
            )}
          </div>

          <p className="text-center mt-5 text-sm text-[#64748b]">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#1E3A8A] hover:text-[#1D4ED8] font-semibold transition-colors"
            >
              Sign in
            </Link>
          </p>
        </Motion.div>
      </div>
    </Motion.div>
  );
}
