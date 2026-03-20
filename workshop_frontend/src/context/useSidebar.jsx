import { useContext } from "react";
import { SidebarCtx } from "./SidebarContext";

export function useSidebar() {
  const ctx = useContext(SidebarCtx);
  if (!ctx) throw new Error("useSidebar must be used inside SidebarProvider");
  return ctx;
}
