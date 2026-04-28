import { Lead } from "@/types/dashboard";
import { StagedLead } from "@/types/setup";

type LeadLike = Lead | StagedLead;

type LeadContactCardLinesProps = {
  lead: LeadLike;
  showOldContact?: boolean;
  strikeName?: boolean;
  showLocation?: boolean;
  showContactLinks?: boolean;
};

function isDashboardLead(lead: LeadLike): lead is Lead {
  return "status" in lead;
}

function fullName(lead: LeadLike) {
  return `${lead.firstName ?? ""} ${lead.lastName ?? ""}`.trim();
}

export function hasReplacementContact(lead: LeadLike): boolean {
  return Boolean(
    isDashboardLead(lead) &&
      lead.ansprechpartnerName &&
      lead.status !== "not_reached" &&
      lead.status !== "wait" &&
      lead.status !== "calling",
  );
}

export function getLeadDisplayName(lead: LeadLike) {
  if (hasReplacementContact(lead) && isDashboardLead(lead)) {
    return lead.ansprechpartnerName || fullName(lead) || "Allgemeiner Kontakt";
  }

  return fullName(lead) || "Allgemeiner Kontakt";
}

export function getLeadDisplayPhone(lead: LeadLike) {
  if (hasReplacementContact(lead) && isDashboardLead(lead)) {
    return lead.ansprechpartnerPhone || lead.phone;
  }

  return lead.phone;
}

export function getLeadOriginalName(lead: LeadLike) {
  return fullName(lead);
}

export function LeadContactCardLines({
  lead,
  showOldContact = true,
  strikeName = false,
  showLocation = true,
  showContactLinks = true,
}: LeadContactCardLinesProps) {
  const replacement = hasReplacementContact(lead);
  const displayName = getLeadDisplayName(lead);
  const displayPhone = getLeadDisplayPhone(lead);
  const originalName = getLeadOriginalName(lead);
  const showOldContactInfo = replacement && showOldContact && Boolean(originalName);

  return (
    <>
      <div className={`result-name-line${replacement ? " has-replacement-contact" : ""}`}>
        <span className={`result-name${strikeName ? " is-struck" : ""}`}>{displayName}</span>
        {displayPhone ? (
          <span className="result-meta primary-phone">
            <i className="fa-solid fa-phone" aria-hidden="true" />
            {displayPhone}
          </span>
        ) : null}
        {showLocation && lead.location ? (
          <span className="result-meta location-meta">
            <i className="fa-solid fa-location-dot" aria-hidden="true" />
            {lead.location}
          </span>
        ) : null}
      </div>

      {showOldContactInfo ? (
        <div className="old-contact-inline" aria-label="Vorheriger Kontakt, nicht zuständig">
          <span className="old-contact-person">
            <i className="fa-solid fa-user-xmark" aria-hidden="true" />
            <span>{originalName}</span>
          </span>
          {lead.phone ? (
            <span className="old-contact-phone">
              <i className="fa-solid fa-phone" aria-hidden="true" />
              <span>{lead.phone}</span>
            </span>
          ) : null}
          {lead.email ? (
            <span className="old-contact-email">
              <i className="fa-solid fa-envelope" aria-hidden="true" />
              <span>{lead.email}</span>
            </span>
          ) : null}
        </div>
      ) : null}

      {showContactLinks && (lead.email || lead.website) ? (
        <div className="lead-card-links">
          {lead.email && !replacement ? (
            <span>
              <i className="fa-solid fa-envelope" aria-hidden="true" />
              {lead.email}
            </span>
          ) : null}
          {lead.website ? (
            <span>
              <i className="fa-solid fa-globe" aria-hidden="true" />
              {lead.website}
            </span>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
