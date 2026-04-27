import { EmptyState } from "@/components/ui/empty-state";
import { SectionTitle } from "@/components/ui/section-title";
import { resultLeads } from "@/lib/demo-data";

export function ResultsView() {
  return (
    <section className="view active view-results">
      <div className="sticky-header">
        <SectionTitle icon="fa-solid fa-clock-rotate-left" title="Anruf-Verlauf" />
        <input
          className="search-input"
          type="text"
          placeholder="Suchen nach Firma, Name, Ort..."
          readOnly
        />
      </div>

      <div className="results-stack">
        {resultLeads.map((lead) => (
          <article className="result-item clickable" key={lead.company}>
            <div className="result-topline">
              <div>
                <div className="company-text">
                  <i className="fa-solid fa-building" aria-hidden="true" />
                  <span>{lead.company}</span>
                </div>
                <div className="result-name-line">
                  <span className="result-name">{lead.name}</span>
                  <span className="result-meta">
                    <i className="fa-solid fa-phone" aria-hidden="true" />
                    {lead.phone}
                  </span>
                </div>
              </div>
              <span className={`badge ${lead.badgeClass}`}>{lead.badge}</span>
            </div>
            <p className="result-summary">{lead.summary}</p>
          </article>
        ))}
      </div>

      <EmptyState icon="fa-solid fa-list-ul" text="Weitere Verlaufseinträge folgen nach der Logikmigration." />
    </section>
  );
}
