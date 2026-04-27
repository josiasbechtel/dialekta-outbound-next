"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { useDashboard } from "@/hooks/use-dashboard";
import { navItems } from "@/lib/config/navigation";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const { loadDemoData, resetSystem, leads, upcomingAppointments } = useDashboard();
  const salesBadgeCount = leads.filter((lead) => ["interest", "callback"].includes(lead.status)).length;

  return (
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

        <nav className="bottom-nav">
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
      </div>
    </div>
  );
}
