/**
 * AppLayout - shell used by BOTH admin and student layouts.
 * Wraps the SidebarProvider so sidebar state is scoped per role shell.
 */
import Sidebar from "./Sidebar";
import { SidebarProvider } from "../context/SidebarContext";
import { useNavigate, useLocation } from "react-router-dom";
import { PageTransition } from "./motion";
import dartLogo from "../assets/Dart_logo.jpeg";

/* -- Top navigation bar -- */
function TopBar({ role, pageTitle }) {
  const navigate    = useNavigate();
  const name        = localStorage.getItem("name") || (role === "admin" ? "Administrator" : "Student");
  const initial     = name.charAt(0).toUpperCase();
  const photo       = localStorage.getItem("photo") || "";
  const roleDisplay = role === "admin" ? "Admin" : "Student";
  const roleColor = role === "admin"
    ? "bg-[#1E3A8A] text-white"
    : "bg-[#7C3AED] text-white";

  return (
    <header className="flex-shrink-0 h-16 flex items-center justify-between
      px-5 border-b border-[var(--color-border)] bg-[rgba(255,255,255,0.7)]
      backdrop-blur-md sticky top-0 z-20 lg:pl-5 pl-14 shadow-sm
      transition-colors duration-200">

      {/* Page title */}
      <div className="flex items-center gap-2.5">
        <img
          src={dartLogo}
          alt="DART"
          className="h-8 w-auto object-contain flex-shrink-0"
          style={{ filter: "drop-shadow(0 1px 4px rgba(0,0,0,0.18))" }}
        />
        <h2 className="text-[#0F172A] font-semibold text-base">{pageTitle}</h2>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3 ml-auto">
        {/* Live indicator for admin */}
        {role === "admin" && (
          <span className="hidden sm:flex items-center gap-1.5 text-[10px] font-semibold uppercase
            tracking-widest text-white bg-[#16A34A]
            px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live
          </span>
        )}

        {/* Role badge */}
        <span className={`hidden sm:inline text-[10px] font-semibold uppercase tracking-widest
          px-2.5 py-1 rounded-full ${roleColor}`}>
          {roleDisplay}
        </span>

        {/* Profile avatar */}
        <button
          onClick={() => navigate(role === "admin" ? "/admin/profile" : "/student/profile")}
          title="Profile Settings"
          className="w-9 h-9 rounded-full flex items-center justify-center
            text-xs font-bold flex-shrink-0 overflow-hidden
            transition-all hover:scale-105 hover:shadow-md border border-[var(--color-border)]"
        >
          {photo ? (
            <img src={photo} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <span className="w-full h-full flex items-center justify-center
              bg-gradient-to-br from-[#0EA5E9] to-[#8B5CF6] text-white">{initial}</span>
          )}
        </button>
      </div>
    </header>
  );
}

/* -- Inner shell (needs sidebar context) -- */
function LayoutShell({ role, pageTitle, children }) {
  const location = useLocation();
  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      <Sidebar role={role} />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <TopBar role={role} pageTitle={pageTitle} />
        <main className="flex-1 overflow-y-auto">
          <div className="p-5 lg:p-6">
            <PageTransition locationKey={location.pathname}>
              {children}
            </PageTransition>
          </div>
        </main>
      </div>
    </div>
  );
}

/* -- Exported wrapper -- */
export default function AppLayout({ role, pageTitle = "DART 2K26", children }) {
  return (
    <SidebarProvider>
      <LayoutShell role={role} pageTitle={pageTitle}>
        {children}
      </LayoutShell>
    </SidebarProvider>
  );
}
