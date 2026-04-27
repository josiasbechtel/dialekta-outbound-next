"use client";

import { EmptyState } from "@/components/ui/empty-state";
import { SectionTitle } from "@/components/ui/section-title";
import { useDashboard } from "@/hooks/use-dashboard";
import { statusMeta } from "@/lib/dashboard-data";

export function ResultsView() {
  const { historyLeads, searchTerm, setSearchTerm, openDetail } = useDashboard();

  return (
    <section className="view active view-results">
      <div className="sticky-header">
        <SectionTitle icon="fa-solid fa-clock-rotate-left" title="Anruf-Verlauf" />
        <input
          className="search-input"
          type="text"
          placeholder="Suchen nach Firma, Name, Ort..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </div>

      {historyLeads.length === 0 ? (
        <EmptyState icon="fa-solid fa-list-ul" text="Noch keine Anrufeinträge vorhanden." />
      ) : (
        <div className="results-stack">
          {historyLeads.map((lead) => (
            <article className="result-item clickable" key={lead.id} onClick={() => openDetail(lead.id)}>
              <div className="result-topline">
                <div>
                  <div className="company-text">
                    <i className="fa-solid fa-building" aria-hidden="true" />
                    <span>{lead.company}</span>
                  </div>
                  <div className="result-name-line">
                    <span className="result-name">
                      {lead.ansprechpartnerName || `${lead.firstName} ${lead.lastName}`}
                    </span>
                    <span className="result-meta">
                      <i className="fa-solid fa-phone" aria-hidden="true" />
                      {lead.ansprechpartnerPhone || lead.phone}
                    </span>
                    <span className="result-meta">
                      <i className="fa-solid fa-location-dot" aria-hidden="true" />
                      {lead.location}
                    </span>
                  </div>
                </div>
                <span className={`badge ${statusMeta[lead.status].className}`}>
                  {statusMeta[lead.status].label}
                </span>
              </div>
              {lead.summary ? <p className="result-summary">{lead.summary}</p> : null}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
