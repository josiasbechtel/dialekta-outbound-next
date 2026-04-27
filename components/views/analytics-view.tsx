"use client";

import { SectionTitle } from "@/components/ui/section-title";
import { useDashboard } from "@/hooks/use-dashboard";

export function AnalyticsView() {
  const { analytics, exportAllCsv, exportBranchCsv } = useDashboard();

  return (
    <section className="view active">
      <article className="card big-kpi">
        <div className="big-number">{analytics.conversion}%</div>
        <div className="big-label">Termin-Quote</div>
      </article>

      <div className="analytics-grid">
        <article className="analytics-tile">
          <b>{analytics.total}</b>
          <span>Leads</span>
        </article>
        <article className="analytics-tile">
          <b>{analytics.done}</b>
          <span>Erledigt</span>
        </article>
        <article className="analytics-tile">
          <b>{analytics.open}</b>
          <span>Offen</span>
        </article>
      </div>

      <article className="card">
        <SectionTitle icon="fa-solid fa-chart-bar" title="Verteilung" />
        {analytics.byStatus.length === 0 ? (
          <div className="empty-state"><p>Noch keine Daten verfügbar.</p></div>
        ) : (
          analytics.byStatus.map((item) => (
            <div className="bar-row" key={item.status}>
              <div className="bar-head">
                <span>{item.label}</span>
                <span>
                  {item.count} ({item.pct}%)
                </span>
              </div>
              <div className="bar-track">
                <div
                  className={`bar-fill ${
                    item.status === "appointment"
                      ? "success"
                      : item.status === "interest"
                        ? "info"
                        : item.status === "callback"
                          ? "warning"
                          : item.status === "no_interest" || item.status === "not_responsible"
                            ? "danger"
                            : ""
                  }`}
                  style={{ width: `${item.pct}%` }}
                />
              </div>
            </div>
          ))
        )}
      </article>

      <article className="card">
        <SectionTitle icon="fa-solid fa-download" title="Listen-Verwaltung & Export" />
        {analytics.byBranch.length === 0 ? (
          <div className="empty-state"><p>Noch keine Listen importiert.</p></div>
        ) : (
          analytics.byBranch.map((branch) => (
            <div className="export-row" key={branch.branch}>
              <div>
                <strong>{branch.branch}</strong>
                <p>
                  {branch.done}/{branch.total} angerufen | {branch.appointments} Termine
                </p>
              </div>
              <button className="icon-btn" type="button" onClick={() => exportBranchCsv(branch.branch)}>
                <i className="fa-solid fa-download" aria-hidden="true" />
              </button>
            </div>
          ))
        )}
        <button className="btn btn-primary wide-btn" type="button" onClick={exportAllCsv}>
          <i className="fa-solid fa-file-csv" aria-hidden="true" />
          Vollständiges CRM Backup (.csv)
        </button>
      </article>
    </section>
  );
}
