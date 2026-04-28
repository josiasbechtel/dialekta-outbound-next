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
    return lead.ansprechpartnerName || `${lead.firstName} ${lead.lastName}`.trim();
  }

  return `${lead.firstName} ${lead.lastName}`.trim();
}

export function getLeadDisplayPhone(lead: LeadLike) {
  if (hasReplacementContact(lead) && isDashboardLead(lead)) {
    return lead.ansprechpartnerPhone || lead.phone;
  }

  return lead.phone;
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
  const originalName = `${lead.firstName} ${lead.lastName}`.trim();

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

      {showContactLinks && (lead.email || lead.website) ? (
        <div className="lead-card-links">
          {lead.email ? (
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

      {replacement && showOldContact ? (
        <div className="old-contact-inline" aria-label="Vorheriger Kontakt, nicht zuständig">
          <div className="old-contact-person">
            <i className="fa-solid fa-user-xmark" aria-hidden="true" />
            <span>{originalName}</span>
          </div>
          {lead.phone ? (
            <div className="old-contact-phone">
              <i className="fa-solid fa-phone" aria-hidden="true" />
              <span>{lead.phone}</span>
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
