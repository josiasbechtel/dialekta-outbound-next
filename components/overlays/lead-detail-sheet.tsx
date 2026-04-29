"use client";

import { useState } from "react";
import { SheetOverlay } from "@/components/ui/sheet-overlay";
import {
  getLeadDisplayName,
  getLeadDisplayPhone,
  getLeadOriginalName,
  hasReplacementContact,
} from "@/components/shared/lead-contact-card-lines";
import { statusMeta } from "@/lib/dashboard-data";
import { isSupabaseConfigured, supabase } from "@/lib/supabase-client";
import { Lead } from "@/types/dashboard";

type LeadDetailSheetProps = {
  isOpen: boolean;
  lead: Lead | null;
  onClose: () => void;
};

export function LeadDetailSheet({ isOpen, lead, onClose }: LeadDetailSheetProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!lead) return null;

  const replacement = hasReplacementContact(lead);
  const displayName = getLeadDisplayName(lead);
  const phoneToUse = getLeadDisplayPhone(lead);
  const oldContactName = getLeadOriginalName(lead);
  const showOldContact = replacement && Boolean(oldContactName);
  const websiteUrl = lead.website ? (lead.website.startsWith("http") ? lead.website : `https://${lead.website}`) : null;

  const headerBadge = replacement ? (
    <span className="badge badge-new-ap detail-header-badge">NEUE ANSPRECHPERSON</span>
  ) : (
    <span className={`badge ${statusMeta[lead.status].className} detail-header-badge`}>
      {statusMeta[lead.status].label}
    </span>
  );

  async function handleDelete() {
    if (!lead || isDeleting) return;

    const confirmed = window.confirm(
      `Lead "${lead.company || displayName || lead.id}" wirklich löschen?`,
    );
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      if (isSupabaseConfigured && supabase) {
        await supabase.from("call_run_leads").delete().eq("lead_id", lead.id);
        await supabase.from("appointments").delete().eq("lead_id", lead.id);
        await supabase.from("staged_leads").delete().eq("id", lead.id);
        const result = await supabase.from("leads").delete().eq("id", lead.id);
        if (result.error) throw result.error;
      }

      onClose();
      window.setTimeout(() => window.location.reload(), 150);
    } catch (error) {
      console.error("Lead konnte nicht gelöscht werden", error);
      window.alert("Lead konnte nicht gelöscht werden. Bitte nochmals versuchen.");
      setIsDeleting(false);
    }
  }

  return (
    <SheetOverlay
      isOpen={isOpen}
      title={lead.branch}
      onClose={onClose}
      headerAside={headerBadge}
      footer={
        <div className="detail-footer-actions" style={{ display: "flex", gap: "0.75rem", width: "100%" }}>
          <button
            className="btn-secondary"
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            title="Lead löschen"
            style={{ flex: "0 0 auto" }}
          >
            <i className="fa-solid fa-trash-can" aria-hidden="true" />
          </button>
          {phoneToUse ? (
            <a
              className="call-btn-action detail-call-button"
              href={`tel:${phoneToUse.replace(/\s/g, "")}`}
              style={{ flex: 1 }}
            >
              <i className="fa-solid fa-phone" aria-hidden="true" />
              <span>{phoneToUse}</span>
            </a>
          ) : null}
        </div>
      }
    >
      <div className="detail-contact-card">
        <div className="detail-company-block">
          <div className="company-text company-text-row detail-company-row">
            <span className="company-text-main">
              <i className="fa-solid fa-building" aria-hidden="true" />
              <span>{lead.company || "Firma unbekannt"}</span>
            </span>
            {lead.location ? (
              <span className="location-chip-soft detail-location-chip compact">
                <i className="fa-solid fa-location-dot" aria-hidden="true" />
                {lead.location}
              </span>
            ) : null}
          </div>

          <div className="detail-contact-main-line detail-primary-line">
            <span className="detail-contact-name">{displayName}</span>
            {phoneToUse ? (
              <a className="detail-contact-phone-inline detail-primary-phone" href={`tel:${phoneToUse.replace(/\s/g, "")}`}>
                <i className="fa-solid fa-phone" aria-hidden="true" />
                <span>{phoneToUse}</span>
              </a>
            ) : null}
          </div>
        </div>

        {(lead.email && !replacement) || websiteUrl ? (
          <div className="detail-primary-links">
            {lead.email && !replacement ? (
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

        {showOldContact ? (
          <div className="detail-old-contact-inline" aria-label="Vorheriger Kontakt, nicht zuständig">
            <span>
              <i className="fa-solid fa-user-xmark" aria-hidden="true" />
              <span>{oldContactName}</span>
            </span>
            {lead.phone ? (
              <span>
                <i className="fa-solid fa-phone" aria-hidden="true" />
                <span>{lead.phone}</span>
              </span>
            ) : null}
            {lead.email ? (
              <span>
                <i className="fa-solid fa-envelope" aria-hidden="true" />
                <span>{lead.email}</span>
              </span>
            ) : null}
          </div>
        ) : null}
      </div>

      {lead.appointmentDate ? (
        <div className="termin-block-nice">
          <i className="fa-regular fa-calendar-check" aria-hidden="true" />
          <div>
            <div className="termin-block-time">{lead.appointmentDate}</div>
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
