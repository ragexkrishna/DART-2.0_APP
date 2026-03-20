import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSidebar } from "../context/useSidebar";
import shardaLogo from "../assets/sharda-logo.jpg";
import dartLogo   from "../assets/Dart_logo.jpeg";

/* SVG icon library  no external dependency */
const Icons = {
  dashboard: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5 flex-shrink-0">
      <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  ),
  attendance: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5 flex-shrink-0">
      <path d="M9 11l2 2 4-4" /><rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  ),
  students: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5 flex-shrink-0">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  ticket: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5 flex-shrink-0">
      <path d="M2 9V7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4z" />
      <line x1="12" y1="7" x2="12" y2="17" strokeDasharray="2 2" />
    </svg>
  ),
  schedule: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5 flex-shrink-0">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
      <path d="M8 14h1M12 14h1M16 14h1M8 18h1M12 18h1" />
    </svg>
  ),
  profile: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5 flex-shrink-0">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  ),
  logout: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5 flex-shrink-0">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  feedback: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5 flex-shrink-0">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      <line x1="9" y1="10" x2="15" y2="10" />
      <line x1="9" y1="14" x2="13" y2="14" />
    </svg>
  ),
  leaderboard: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5 flex-shrink-0">
      <rect x="2"   y="14" width="5" height="7" rx="1" />
      <rect x="9.5" y="9"  width="5" height="12" rx="1" />
      <rect x="17"  y="5"  width="5" height="16" rx="1" />
    </svg>
  ),
  chevronLeft: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  ),
  chevronRight: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <path d="M9 18l6-6-6-6" />
    </svg>
  ),
  hamburger: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <line x1="3" y1="6"  x2="21" y2="6"  />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
  close: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  announcements: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5 flex-shrink-0">
      <path d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.158M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
    </svg>
  ),
};

/*  Nav configs  */
const ADMIN_NAV = [
  { label: "Dashboard",         to: "/admin",              icon: "dashboard"  },
  { label: "Students",          to: "/admin/students",     icon: "students"   },
  { label: "Attendance",        to: "/admin/attendance",   icon: "attendance" },
  { label: "Tickets",           to: "/admin/tickets",      icon: "ticket"     },
  { label: "Schedule",          to: "/admin/schedule",     icon: "schedule"   },
  { label: "Feedback",          to: "/admin/feedback",      icon: "feedback"    },
  { label: "Leaderboard",       to: "/admin/leaderboard",   icon: "leaderboard" },
  { label: "Profile",           to: "/admin/profile",       icon: "profile"     },
];

const STUDENT_NAV = [
  { label: "Dashboard",       to: "/student",                icon: "dashboard"     },
  { label: "My Attendance",   to: "/student/attendance",    icon: "attendance"    },
  { label: "My Tickets",      to: "/student/tickets",       icon: "ticket"        },
  { label: "Schedule",        to: "/student/schedule",      icon: "schedule"      },
  { label: "Feedback",        to: "/student/feedback",      icon: "feedback"      },
  { label: "Leaderboard",     to: "/student/leaderboard",   icon: "leaderboard"   },
  { label: "Announcements",   to: "/student/announcements", icon: "announcements" },
  { label: "Profile",         to: "/student/profile",       icon: "profile"       },
];

/*  Single nav item  */
function NavItem({ item, collapsed, onClick }) {
  const { pathname } = useLocation();
  const isActive = pathname === item.to;

  return (
    <Link
      to={item.to}
      onClick={onClick}
      title={collapsed ? item.label : undefined}
      className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
        transition-all duration-200 cursor-pointer group overflow-hidden
        ${isActive
          ? "bg-gradient-to-r from-[var(--color-nav-active-bg)] to-transparent text-[#0EA5E9] font-semibold"
          : "text-[var(--color-text-muted)] hover:text-[#0EA5E9] hover:bg-[var(--color-nav-hover-bg)]"
        }
        ${collapsed ? "justify-center" : ""}`}
    >
      {isActive && !collapsed && (
        <span className="absolute left-0 top-[15%] bottom-[15%] w-[4px] bg-gradient-to-b from-[#0EA5E9] to-[#8B5CF6] rounded-r-full shadow-[2px_0_8px_rgba(14,165,233,0.5)]" />
      )}
      <span className={`relative z-10 ${isActive ? "text-[#0EA5E9]" : "text-[var(--color-text-dim)] group-hover:text-[#0EA5E9]"}`}>
        {Icons[item.icon]}
      </span>
      {!collapsed && <span className="truncate relative z-10">{item.label}</span>}
      {collapsed && (
        <span className="absolute left-full ml-3 px-2.5 py-1.5 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] text-xs
          font-medium rounded-lg opacity-0 pointer-events-none whitespace-nowrap z-50
          group-hover:opacity-100 transition-opacity duration-200 shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
          {item.label}
        </span>
      )}
    </Link>
  );
}

/* -- Sidebar inner content -- */
function SidebarContent({ role, collapsed, onClose }) {
  const navigate  = useNavigate();
  const navItems  = role === "admin" ? ADMIN_NAV : STUDENT_NAV;
  const name      = localStorage.getItem("name") || (role === "admin" ? "Administrator" : "Student");
  const initial   = name.charAt(0).toUpperCase();
  const photo     = localStorage.getItem("photo") || "";
  const roleLabel = role === "admin" ? "Administrator" : "Student";

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className={`h-full flex flex-col bg-[rgba(255,255,255,0.8)] backdrop-blur-xl border-r border-[var(--color-border)]
      transition-all duration-300 overflow-hidden shadow-[1px_0_12px_rgba(0,0,0,0.02)]
      ${collapsed ? "w-[72px]" : "w-64"}`}>

      {/* Brand header */}
      <div className={`flex items-center flex-shrink-0 border-b border-[var(--color-border)]
        ${collapsed ? "justify-center px-3 h-16" : "gap-3 px-4 h-16"}`}>
        {!collapsed ? (
          <>
            <img src={shardaLogo} alt="Sharda University"
              className="h-8 w-auto object-contain flex-shrink-0 opacity-90" />
            <div className="w-px h-8 bg-white/25 flex-shrink-0" />
            <img
              src={dartLogo}
              alt="DART Workshop"
              className="h-9 w-auto object-contain flex-shrink-0"
              style={{ filter: "drop-shadow(0 1px 6px rgba(0,0,0,0.30))" }}
            />
          </>
        ) : (
          <img
            src={dartLogo}
            alt="DART"
            className="h-8 w-auto object-contain"
            style={{ filter: "drop-shadow(0 1px 4px rgba(0,0,0,0.30))" }}
          />
        )}
      </div>

      {/* Nav section */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto overflow-x-hidden">
        {!collapsed && (
          <p className="px-3 mb-3 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-dim)]">
            Navigation
          </p>
        )}
        {navItems.map((item) => (
          <NavItem key={item.to} item={item} collapsed={collapsed} onClick={onClose} />
        ))}
      </nav>

      {/* User footer */}
      <div className="flex-shrink-0 border-t border-[var(--color-border)] p-2 space-y-1">
        {!collapsed ? (
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[var(--color-hover)]
            transition-colors cursor-pointer" onClick={() => navigate(role === "admin" ? "/admin/profile" : "/student/profile")}>
            {photo ? (
              <img src={photo} alt="Profile" className="w-8 h-8 rounded-full object-cover flex-shrink-0 border border-[var(--color-border)]" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#1E3A8A] flex items-center justify-center
                text-white text-xs font-bold flex-shrink-0">
                {initial}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-[var(--color-text)] text-sm font-medium truncate">{name}</p>
              <p className="text-[var(--color-text-dim)] text-xs truncate">{roleLabel}</p>
            </div>
          </div>
        ) : (
          <button title="Profile" onClick={() => navigate(role === "admin" ? "/admin/profile" : "/student/profile")}
            className="w-full flex justify-center py-2.5 hover:bg-[var(--color-hover)] rounded-lg transition-colors">
            {photo ? (
              <img src={photo} alt="Profile" className="w-7 h-7 rounded-full object-cover border border-[var(--color-border)]" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-[#1E3A8A] flex items-center
                justify-center text-white text-xs font-bold">
                {initial}
              </div>
            )}
          </button>
        )}
        <button
          onClick={logout}
          title={collapsed ? "Sign Out" : undefined}
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium
            text-[#DC2626] hover:bg-[#FEE2E2] transition-all duration-150
            ${collapsed ? "justify-center" : ""}`}
        >
          {Icons.logout}
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );
}

/* -- Main exported component -- */
export default function Sidebar({ role }) {
  const { collapsed, toggle, mobileOpen, closeMobile, openMobile } = useSidebar();

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className="lg:hidden fixed top-3 left-3 z-50 p-2 rounded-lg
          bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-muted)]
          hover:bg-[var(--color-hover)] hover:text-[#1E3A8A] transition-colors shadow-sm"
        onClick={openMobile}
        aria-label="Open menu"
      >
        {Icons.hamburger}
      </button>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/30" onClick={closeMobile} />
      )}

      {/* Mobile drawer */}
      <div className={`lg:hidden fixed inset-y-0 left-0 z-50 transition-transform duration-300
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <SidebarContent role={role} collapsed={false} onClose={closeMobile} />
        <button
          className="absolute top-3 right-[-40px] p-2 rounded-r-lg
            bg-[var(--color-surface)] border-y border-r border-[var(--color-border)] text-[var(--color-text-muted)]
            hover:text-[#1E3A8A] transition-colors"
          onClick={closeMobile}
        >
          {Icons.close}
        </button>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-col h-screen sticky top-0 flex-shrink-0">
        <button
          onClick={toggle}
          className={`absolute top-[100px] z-30 flex items-center justify-center
            w-6 h-6 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)]
            text-[var(--color-text-dim)] hover:text-[#1E3A8A] hover:border-[#BFDBFE]
            transition-all duration-200 shadow-sm
            ${collapsed ? "left-[60px]" : "left-[244px]"}`}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? Icons.chevronRight : Icons.chevronLeft}
        </button>
        <SidebarContent role={role} collapsed={collapsed} onClose={undefined} />
      </div>
    </>
  );
}