"use client";

import { SheetOverlay } from "@/components/ui/sheet-overlay";
import { statusMeta } from "@/lib/dashboard-data";
import { Lead } from "@/types/dashboard";

type LeadDetailSheetProps = {
  isOpen: boolean;
  lead: Lead | null;
  onClose: () => void;
};

export function LeadDetailSheet({ isOpen, lead, onClose }: LeadDetailSheetProps) {
  if (!lead) {
    return null;
  }

  const hasReplacementContact = Boolean(lead.ansprechpartnerName && lead.status !== "not_reached");
  const displayName = hasReplacementContact
    ? lead.ansprechpartnerName!
    : `${lead.firstName} ${lead.lastName}`.trim();
  const phoneToUse = hasReplacementContact ? lead.ansprechpartnerPhone || lead.phone : lead.phone;
  const oldContactName = `${lead.firstName} ${lead.lastName}`.trim();
  const websiteUrl = lead.website
    ? lead.website.startsWith("http")
      ? lead.website
      : `https://${lead.website}`
    : null;

  return (
    <SheetOverlay
      isOpen={isOpen}
      title={displayName}
      onClose={onClose}
      footer={
        <a className="call-btn-action" href={`tel:${phoneToUse.replace(/\s/g, "")}`}>
          <i className="fa-solid fa-phone" aria-hidden="true" />
          <span>{phoneToUse}</span>
        </a>
      }
    >
      <div className="detail-header-company">
        <i className="fa-solid fa-building" aria-hidden="true" />
        <span>{lead.company || "Firma unbekannt"}</span>
      </div>

      <div className="detail-pill-row">
        <span className={`badge ${statusMeta[lead.status].className}`}>{statusMeta[lead.status].label || "OFFEN"}</span>
        <span className="badge detail-branch-pill">
          <i className="fa-solid fa-tag" aria-hidden="true" />
          {lead.branch}
        </span>
        {lead.location ? (
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${lead.company} ${lead.location}`)}`}
            target="_blank"
            className="badge detail-location-pill"
          >
            <i className="fa-solid fa-location-dot" aria-hidden="true" />
            <span>{lead.location}</span>
            <i className="fa-solid fa-arrow-up-right-from-square detail-location-external" aria-hidden="true" />
          </a>
        ) : null}
      </div>

      {lead.appointmentDate ? (
        <div className="termin-block-nice">
          <i className="fa-regular fa-calendar-check" aria-hidden="true" />
          <div>
            <div className="termin-block-time">{lead.appointmentDate}</div>
            {lead.appointmentContext ? <div className="termin-block-context">{lead.appointmentContext}</div> : null}
          </div>
        </div>
      ) : null}

      {lead.summary ? (
        <div className="detail-block detail-summary-block">
          <label>
            <i className="fa-solid fa-clipboard-list" aria-hidden="true" />
            Zusammenfassung vom Anruf
          </label>
          <div className="val detail-long-text">
            <span>{lead.summary}</span>
          </div>
        </div>
      ) : null}

      {lead.email ? (
        <div className="detail-block detail-contact-link-block">
          <a className="val" href={`mailto:${lead.email}`}>
            <i className="fa-solid fa-envelope" aria-hidden="true" />
            <span>{lead.email}</span>
          </a>
        </div>
      ) : null}

      {websiteUrl ? (
        <div className="detail-block detail-contact-link-block">
          <a className="val" href={websiteUrl} target="_blank">
            <i className="fa-solid fa-globe" aria-hidden="true" />
            <span>{lead.website}</span>
          </a>
        </div>
      ) : null}

      {hasReplacementContact ? (
        <div className="detail-block detail-old-contact-block">
          <label>Vorheriger Kontakt (Nicht zuständig)</label>
          <div className="detail-old-contact">
            <div className="detail-old-contact-name">
              <i className="fa-solid fa-user-xmark" aria-hidden="true" />
              <span>{oldContactName}</span>
            </div>
            {lead.phone ? (
              <div className="detail-old-contact-phone">
                <i className="fa-solid fa-phone" aria-hidden="true" />
                <span>{lead.phone}</span>
              </div>
            ) : null}
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
    </SheetOverlay>
  );
}
