import { EmptyState } from "@/components/ui/empty-state";
import { SectionTitle } from "@/components/ui/section-title";
import { appointmentLeads } from "@/lib/demo-data";

export function AppointmentsView() {
  return (
    <section className="view active">
      <div className="header-row">
        <SectionTitle icon="fa-regular fa-calendar-check" title="Anstehende Termine" />
        <button className="segmented-toggle" type="button">
          <span>Vergangenheit</span>
          <div className="toggle-sm" />
        </button>
      </div>
      <p className="sub-copy">Alle bestätigten Termine aus dem automatischen Durchlauf.</p>

      {appointmentLeads.map((lead) => (
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
              <div className="appointment-time">
                <i className="fa-regular fa-clock" aria-hidden="true" />
                {lead.time}
              </div>
            </div>
            <span className="badge s-appointment">TERMIN</span>
          </div>
        </article>
      ))}

      <EmptyState
        icon="fa-regular fa-calendar-check"
        text="Terminlisten und Archivumschaltung sind jetzt sauber als eigene View vorbereitet."
      />
    </section>
  );
}
