"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useRef } from "react";
import { useDashboard } from "@/hooks/use-dashboard";
import { navItems } from "@/lib/config/navigation";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { loadDemoData, resetSystem, leads, upcomingAppointments, currentCallId, liveQueue } = useDashboard();
  const salesBadgeCount = leads.filter((lead) => ["interest", "callback"].includes(lead.status)).length;
  const lastAutoRedirectCallIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!currentCallId || liveQueue.length === 0) {
      lastAutoRedirectCallIdRef.current = null;
      return;
    }

    if (lastAutoRedirectCallIdRef.current === currentCallId) return;

    lastAutoRedirectCallIdRef.current = currentCallId;
    if (pathname !== "/live") {
      router.push("/live");
    }
  }, [currentCallId, liveQueue.length, pathname, router]);

  const bottomNav = (
    <nav
      className="bottom-nav"
      style={{
        position: "fixed",
        left: "50%",
        right: "auto",
        bottom: 0,
        width: "100%",
        maxWidth: "480px",
        transform: "translateX(-50%)",
        zIndex: 90,
        flexShrink: 0,
      }}
    >
      {navItems.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-btn ${isActive ? "active" : ""} ${
              item.badge &&
              ((item.href === "/sales" && salesBadgeCount > 0) ||
                (item.href === "/appointments" && upcomingAppointments > 0))
                ? "badge-nav has-items"
                : ""
            }`}
          >
            <i className={item.icon} aria-hidden="true" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      <div className="app-frame">
        <div className="app">
          <header className="topbar">
            <div className="brand-title">KI Outbound</div>
            <div className="top-actions">
              <Link className="icon-btn" href="/results" title="Verlauf (Logbuch)">
                <i className="fa-solid fa-clock" aria-hidden="true" />
              </Link>
              <button className="icon-btn magic" type="button" title="Demo-Daten laden" onClick={loadDemoData}>
                <i className="fa-solid fa-wand-magic-sparkles" aria-hidden="true" />
              </button>
              <button className="icon-btn" type="button" title="Alles zurücksetzen" onClick={resetSystem}>
                <i className="fa-solid fa-rotate-right" aria-hidden="true" />
              </button>
            </div>
          </header>

          <main className="main-content">{children}</main>
        </div>
      </div>
      {bottomNav}
    </>
  );
}
