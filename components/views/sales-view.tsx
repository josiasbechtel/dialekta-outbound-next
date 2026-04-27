"use client";

import { EmptyState } from "@/components/ui/empty-state";
import { SectionTitle } from "@/components/ui/section-title";
import { useDashboard } from "@/hooks/use-dashboard";
import { statusMeta } from "@/lib/dashboard-data";

export function SalesView() {
  const {
    salesLeads,
    vertriebTab,
    toggleVertriebTab,
    exportSalesCsv,
    openDetail,
    markSalesDone,
  } = useDashboard();

  return (
    <section className="view active">
      <div className="header-row">
        <SectionTitle
          icon={vertriebTab === "archiv" ? "fa-solid fa-archive" : "fa-solid fa-user-tie"}
          title={vertriebTab === "archiv" ? "Archiv" : "Menschliche Übergabe"}
        />
        <div className="header-action-row">
          {vertriebTab === "hot" ? (
            <button className="btn btn-outline compact-btn" type="button" onClick={exportSalesCsv}>
              <i className="fa-solid fa-download" aria-hidden="true" />
              CSV
            </button>
          ) : null}
          <button
            className={`segmented-toggle ${vertriebTab === "archiv" ? "active" : ""}`}
            type="button"
            onClick={toggleVertriebTab}
          >
            <span>Archiv</span>
            <div className={`toggle-sm ${vertriebTab === "archiv" ? "on" : ""}`} />
          </button>
        </div>
      </div>
      <p className="sub-copy">
        {vertriebTab === "archiv"
          ? "Bereits erledigte oder entfernte Vertriebsleads."
          : "Leads mit Interesse oder Rückrufwunsch für die manuelle Übernahme."}
      </p>

      {salesLeads.length === 0 ? (
        <EmptyState
          icon={vertriebTab === "archiv" ? "fa-regular fa-folder-open" : "fa-regular fa-face-smile"}
          text={vertriebTab === "archiv" ? "Kein Vertriebsarchiv vorhanden." : "Aktuell keine Vertriebsleads offen."}
        />
      ) : (
        salesLeads.map((lead) => (
          <article className="result-item clickable" key={lead.id} onClick={() => openDetail(lead.id)}>
            <div className="result-topline">
              <div>
                <div className="company-text">
                  <i className="fa-solid fa-building" aria-hidden="true" />
                  <span>{lead.company}</span>
                </div>
                <div className="result-name-line">
                  <span className="result-name">{lead.ansprechpartnerName || `${lead.firstName} ${lead.lastName}`}</span>
                  <span className="result-meta">
                    <i className="fa-solid fa-phone" aria-hidden="true" />
                    {lead.ansprechpartnerPhone || lead.phone}
                  </span>
                </div>
              </div>
              <span className={`badge ${statusMeta[lead.status].className}`}>{statusMeta[lead.status].label}</span>
            </div>
            {vertriebTab === "hot" ? (
              <div className="queue-card-actions">
                <button
                  className="btn btn-outline"
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    markSalesDone(lead.id);
                  }}
                >
                  <i className="fa-solid fa-check" aria-hidden="true" />
                  Erledigt
                </button>
              </div>
            ) : null}
          </article>
        ))
      )}
    </section>
  );
}
