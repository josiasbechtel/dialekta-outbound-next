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
        <span className="badge detail-branch-pill">{lead.branch}</span>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${lead.company} ${lead.location}`)}`}
          target="_blank"
          className="badge detail-location-pill"
        >
          <i className="fa-solid fa-location-dot" aria-hidden="true" />
          <span>{lead.location}</span>
        </a>
      </div>

      {lead.appointmentDate ? (
        <div className="detail-block">
          <label>Termin</label>
          <div className="val">
            <i className="fa-regular fa-calendar-check" aria-hidden="true" />
            <span>{lead.appointmentDate}</span>
          </div>
        </div>
      ) : null}

      {lead.summary ? (
        <div className="detail-block">
          <label>Zusammenfassung vom Anruf</label>
          <div className="val detail-long-text">
            <i className="fa-solid fa-clipboard-list" aria-hidden="true" />
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
          <a className="val" href={websiteUrl} target="_blank">
            <i className="fa-solid fa-globe" aria-hidden="true" />
            <span>{lead.website}</span>
          </a>
        </div>
      ) : null}

      {lead.ansprechpartnerName && lead.status !== "not_reached" ? (
        <div className="detail-block">
          <label>Vorheriger Kontakt (Nicht zuständig)</label>
          <div className="detail-old-contact">
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
    </SheetOverlay>
  );
}
