import { Lead } from "@/types/dashboard";
import { StagedLead } from "@/types/setup";

type LeadLike = Lead | StagedLead;

type LeadContactCardLinesProps = {
  lead: LeadLike;
  showOldContact?: boolean;
  strikeName?: boolean;
  showLocation?: boolean;
};

function isDashboardLead(lead: LeadLike): lead is Lead {
  return "status" in lead;
}

function hasReplacementContact(lead: LeadLike): lead is Lead {
  return Boolean(
    isDashboardLead(lead) &&
      lead.ansprechpartnerName &&
      lead.status !== "not_reached" &&
      lead.status !== "wait" &&
      lead.status !== "calling",
  );
}

export function getLeadDisplayName(lead: LeadLike) {
  if (hasReplacementContact(lead)) {
    return lead.ansprechpartnerName;
  }

  return `${lead.firstName} ${lead.lastName}`.trim();
}

export function getLeadDisplayPhone(lead: LeadLike) {
  if (hasReplacementContact(lead)) {
    return lead.ansprechpartnerPhone || lead.phone;
  }

  return lead.phone;
}

export function LeadContactCardLines({
  lead,
  showOldContact = true,
  strikeName = false,
  showLocation = true,
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
