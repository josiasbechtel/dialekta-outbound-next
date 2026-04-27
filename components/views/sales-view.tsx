import { EmptyState } from "@/components/ui/empty-state";
import { SectionTitle } from "@/components/ui/section-title";
import { salesLeads } from "@/lib/demo-data";

export function SalesView() {
  return (
    <section className="view active">
      <div className="header-row">
        <SectionTitle icon="fa-solid fa-user-tie" title="Menschliche Übergabe" />
        <button className="segmented-toggle active" type="button">
          <span>Archiv</span>
          <div className="toggle-sm on" />
        </button>
      </div>
      <p className="sub-copy">Leads mit Interesse oder Rückrufwunsch für die manuelle Übernahme.</p>

      {salesLeads.map((lead) => (
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
        </article>
      ))}

      <EmptyState
        icon="fa-regular fa-face-smile"
        text="Swipe-Aktionen und Vertriebsarchiv kommen im nächsten Migrationsschritt in eigene Komponenten."
      />
    </section>
  );
}
