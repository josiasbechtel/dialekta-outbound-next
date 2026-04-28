"use client";

import { SheetOverlay } from "@/components/ui/sheet-overlay";
import { statusMeta } from "@/lib/dashboard-data";
import { Lead } from "@/types/dashboard";

type LeadDetailSheetProps = {
  isOpen: boolean;
  lead: Lead | null;
  onClose: () => void;
};

function joinName(firstName?: string, lastName?: string) {
  return `${firstName ?? ""} ${lastName ?? ""}`.trim();
}

export function LeadDetailSheet({ isOpen, lead, onClose }: LeadDetailSheetProps) {
  if (!lead) return null;

  const hasReplacementContact = Boolean(lead.ansprechpartnerName && lead.status !== "not_reached");
  const oldContactName = joinName(lead.firstName, lead.lastName) || "Bisheriger Kontakt";
  const displayName = hasReplacementContact
    ? lead.ansprechpartnerName!
    : joinName(lead.firstName, lead.lastName) || "Allgemeiner Kontakt";
  const phoneToUse = hasReplacementContact ? lead.ansprechpartnerPhone || lead.phone : lead.phone;
  const websiteUrl = lead.website ? (lead.website.startsWith("http") ? lead.website : `https://${lead.website}`) : null;

  const headerBadge = hasReplacementContact ? (
    <span className="badge badge-new-ap detail-header-badge">NEUE ANSPRECHPERSON</span>
  ) : (
    <span className={`badge ${statusMeta[lead.status].className} detail-header-badge`}>{statusMeta[lead.status].label}</span>
  );

  return (
    <SheetOverlay
      isOpen={isOpen}
      title={lead.branch}
      onClose={onClose}
      headerAside={headerBadge}
      footer={
        phoneToUse ? (
          <a className="call-btn-action detail-call-button" href={`tel:${phoneToUse.replace(/\s/g, "")}`}>
            <i className="fa-solid fa-phone" aria-hidden="true" />
            <span>{phoneToUse}</span>
          </a>
        ) : null
      }
    >
      <div className="detail-contact-card">
        <div className="detail-card-top">
          <div className="detail-card-heading">
            <div className="detail-header-company">
              <i className="fa-solid fa-building" aria-hidden="true" />
              <span>{lead.company || "Firma unbekannt"}</span>
              {lead.location ? (
                <span
                  className="detail-location-chip compact"
                  style={{ marginLeft: 10, minHeight: 30, padding: "6px 11px", fontSize: "0.72rem" }}
                >
                  <i className="fa-solid fa-location-dot" aria-hidden="true" />
                  <span>{lead.location}</span>
                </span>
              ) : null}
            </div>

            <div className="detail-contact-main-line">
              <span className="detail-contact-name">{displayName}</span>
              {phoneToUse ? (
                <a className="detail-contact-phone-inline" href={`tel:${phoneToUse.replace(/\s/g, "")}`}>
                  <i className="fa-solid fa-phone" aria-hidden="true" />
                  <span>{phoneToUse}</span>
                </a>
              ) : null}
            </div>
          </div>
        </div>

        {(lead.email && !hasReplacementContact) || websiteUrl ? (
          <div className="detail-primary-links">
            {lead.email && !hasReplacementContact ? (
              <a href={`mailto:${lead.email}`}>
                <i className="fa-solid fa-envelope" aria-hidden="true" />
                <span>{lead.email}</span>
              </a>
            ) : null}
            {websiteUrl ? (
              <a href={websiteUrl}>
                <i className="fa-solid fa-globe" aria-hidden="true" />
                <span>{lead.website}</span>
              </a>
            ) : null}
          </div>
        ) : null}

        {hasReplacementContact ? (
          <details className="detail-old-contact-disclosure" style={{ marginTop: 16, paddingTop: 14, borderTop: "1px dashed var(--border)" }}>
            <summary style={{ display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer", color: "var(--primary)", fontWeight: 800 }}>
              <i className="fa-solid fa-circle-info" aria-hidden="true" />
              Ursprüngliche Ansprechperson
            </summary>
            <div className="detail-old-contact-inline" style={{ marginTop: 10, paddingTop: 0, borderTop: 0 }}>
              <div className="detail-old-contact-main">
                <div className="detail-old-contact-person">
                  <i className="fa-solid fa-user-xmark" aria-hidden="true" />
                  <span>{oldContactName}</span>
                </div>
                {lead.email ? (
                  <div className="detail-old-contact-email">
                    <i className="fa-solid fa-envelope" aria-hidden="true" />
                    <span>{lead.email}</span>
                  </div>
                ) : null}
              </div>
              {lead.phone ? (
                <div className="detail-old-contact-phone">
                  <i className="fa-solid fa-phone" aria-hidden="true" />
                  <span>{lead.phone}</span>
                </div>
              ) : null}
            </div>
          </details>
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
