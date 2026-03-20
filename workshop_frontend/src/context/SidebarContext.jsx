import { createContext, useState, useEffect } from "react";

export const SidebarCtx = createContext(null);

export function SidebarProvider({ children }) {
  // Default: open on desktop, closed on mobile
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebarCollapsed");
    if (saved !== null) return JSON.parse(saved);
    return window.innerWidth < 1024;
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggle = () => {
    setCollapsed((v) => {
      localStorage.setItem("sidebarCollapsed", JSON.stringify(!v));
      return !v;
    });
  };

  const closeMobile = () => setMobileOpen(false);
  const openMobile  = () => setMobileOpen(true);

  // Close mobile drawer on resize to desktop
  useEffect(() => {
    const handler = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return (
    <SidebarCtx.Provider value={{ collapsed, toggle, mobileOpen, closeMobile, openMobile }}>
      {children}
    </SidebarCtx.Provider>
  );
}
