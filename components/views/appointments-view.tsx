"use client";

import { EmptyState } from "@/components/ui/empty-state";
import { SectionTitle } from "@/components/ui/section-title";
import { useDashboard } from "@/hooks/use-dashboard";

export function AppointmentsView() {
  const { appointmentLeads, termineTab, toggleTermineTab, openDetail } = useDashboard();

  return (
    <section className="view active">
      <div className="header-row">
        <SectionTitle
          icon={termineTab === "archiv" ? "fa-solid fa-clock-rotate-left" : "fa-regular fa-calendar-check"}
          title={termineTab === "archiv" ? "Vergangenheit" : "Anstehende Termine"}
        />
        <button className={`segmented-toggle ${termineTab === "archiv" ? "active" : ""}`} type="button" onClick={toggleTermineTab}>
          <span>Vergangenheit</span>
          <div className={`toggle-sm ${termineTab === "archiv" ? "on" : ""}`} />
        </button>
      </div>
      <p className="sub-copy">
        {termineTab === "archiv"
          ? "Vergangene Termine."
          : "Durch die KI gebuchte Termine für die Zukunft."}
      </p>

      {appointmentLeads.length === 0 ? (
        <EmptyState
          icon={termineTab === "archiv" ? "fa-regular fa-folder-open" : "fa-regular fa-calendar-check"}
          text={termineTab === "archiv" ? "Keine vergangenen Termine." : "Aktuell keine anstehenden Termine."}
        />
      ) : (
        appointmentLeads.map((lead) => (
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
                  <span className="result-meta">
                    <i className="fa-solid fa-location-dot" aria-hidden="true" />
                    {lead.location}
                  </span>
                </div>
                {lead.appointmentDate ? (
                  <div className="appointment-time">
                    <i className="fa-regular fa-clock" aria-hidden="true" />
                    {lead.appointmentDate}
                  </div>
                ) : null}
              </div>
              <span className="badge s-appointment">{termineTab === "archiv" ? "VERGANGEN" : "TERMIN"}</span>
            </div>
          </article>
        ))
      )}
    </section>
  );
}
