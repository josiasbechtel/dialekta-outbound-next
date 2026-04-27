"use client";

import { statusMeta } from "@/lib/dashboard-data";
import { Lead } from "@/types/dashboard";

type LeadDetailSheetProps = {
  isOpen: boolean;
  lead: Lead | null;
  onClose: () => void;
};

export function LeadDetailSheet({ isOpen, lead, onClose }: LeadDetailSheetProps) {
  if (!lead || !isOpen) {
    return null;
  }

  const displayName =
    lead.ansprechpartnerName && lead.status !== "not_reached"
      ? lead.ansprechpartnerName
      : `${lead.firstName} ${lead.lastName}`.trim();
  const phoneToUse = lead.ansprechpartnerPhone || lead.phone;
  const websiteUrl = lead.website
    ? lead.website.startsWith("http")
      ? lead.website
      : `https://${lead.website}`
    : null;
  const showBadge = lead.status !== "wait" && lead.status !== "calling";

  return (
    <div className="overlay show" onClick={onClose} aria-hidden={!isOpen}>
      <div className="sheet detail-sheet" onClick={(event) => event.stopPropagation()}>
        <div className="sheet-drag-handle" />

        <div className="sheet-header detail-sheet-header">
          <button className="sheet-close-btn detail-sheet-close" type="button" onClick={onClose} aria-label="Schliessen">
            <i className="fa-solid fa-xmark" aria-hidden="true" />
          </button>

          <div className="detail-sheet-headline">
            <div className="detail-title-row">
              <h2 className="sheet-title">{displayName}</h2>
              <div className="detail-header-badge">
                {showBadge ? <span className={`badge ${statusMeta[lead.status].className}`}>{statusMeta[lead.status].label}</span> : null}
                {showBadge && lead.planInfo ? <div className="detail-plan-copy">(Geplant: {lead.planInfo})</div> : null}
              </div>
            </div>
            <div className="detail-header-company">
              <i className="fa-solid fa-building" aria-hidden="true" />
              <span>{lead.company || "Firma unbekannt"}</span>
            </div>
          </div>

          <div className="detail-pill-row">
            <span className="badge detail-branch-pill">
              <i className="fa-solid fa-tag" aria-hidden="true" />
              <span>{lead.branch}</span>
            </span>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${lead.company} ${lead.location}`)}`}
              target="_blank"
              className="badge detail-location-pill"
            >
              <i className="fa-solid fa-location-dot" aria-hidden="true" />
              <span>{lead.location}</span>
              <i className="fa-solid fa-arrow-up-right-from-square detail-external-icon" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="sheet-body">
          {lead.status === "appointment" && lead.appointmentDate ? (
            <div className="detail-appointment-block">
              <div className="detail-appointment-icon">
                <i className="fa-regular fa-calendar-check" aria-hidden="true" />
              </div>
              <div>
                <div className="detail-appointment-time">{lead.appointmentDate}</div>
                {lead.appointmentContext ? <div className="detail-appointment-context">{lead.appointmentContext}</div> : null}
              </div>
            </div>
          ) : null}

          {lead.summary ? (
            <div className="detail-block">
              <label className="detail-block-label">
                <i className="fa-solid fa-clipboard-list" aria-hidden="true" />
                Zusammenfassung vom Anruf
              </label>
              <div className="val detail-summary-box">
                <span>{lead.summary}</span>
              </div>
            </div>
          ) : null}

          {lead.email ? (
            <div className="detail-block">
              <a className="val" href={`mailto:${lead.email}`}>
                <i className="fa-solid fa-envelope" aria-hidden="true" />
                <span>{lead.email}</span>
              </a>
            </div>
          ) : null}

          {websiteUrl ? (
            <div className="detail-block">
              <a className="val detail-link-primary" href={websiteUrl} target="_blank">
                <i className="fa-solid fa-globe" aria-hidden="true" />
                <span>{lead.website}</span>
              </a>
            </div>
          ) : null}

          {lead.ansprechpartnerName && lead.status !== "not_reached" ? (
            <div className="detail-block">
              <label>Vorheriger Kontakt (Nicht zuständig)</label>
              <div className="detail-old-contact detail-old-contact-box">
                <div>
                  <i className="fa-solid fa-user-xmark" aria-hidden="true" />
                  <span>
                    {lead.firstName} {lead.lastName}
                  </span>
                </div>
                <div>
                  <i className="fa-solid fa-phone" aria-hidden="true" />
                  <span>{lead.phone}</span>
                </div>
              </div>
            </div>
          ) : null}

          {lead.notes ? (
            <div className="detail-block">
              <label>Notizen</label>
              <div className="val detail-long-text">
                <i className="fa-solid fa-align-left" aria-hidden="true" />
                <span>{lead.notes}</span>
              </div>
            </div>
          ) : null}
        </div>

        <div className="sheet-actions detail-actions">
          <a className="call-btn-action" href={`tel:${phoneToUse.replace(/\s/g, "")}`}>
            <i className="fa-solid fa-phone" aria-hidden="true" />
            <span>{phoneToUse}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
