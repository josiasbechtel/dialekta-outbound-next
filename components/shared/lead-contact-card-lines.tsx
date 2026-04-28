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
  const originalName = fullName(lead) || "Bisheriger Kontakt";

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
          {!replacement && lead.email ? (
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
        <details
          className="old-contact-disclosure"
          style={{
            marginTop: 12,
            paddingTop: 10,
            borderTop: "1px dashed var(--border)",
            color: "var(--text-muted)",
            fontSize: "0.78rem",
          }}
        >
          <summary
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
              listStyle: "none",
              fontWeight: 800,
              color: "var(--primary)",
            }}
          >
            <i className="fa-solid fa-circle-info" aria-hidden="true" />
            Ursprüngliche Ansprechperson
          </summary>
          <div
            style={{
              marginTop: 9,
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              alignItems: "flex-start",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 7, textDecoration: "line-through", opacity: 0.72 }}>
                <i className="fa-solid fa-user-xmark" aria-hidden="true" />
                {originalName}
              </span>
              {lead.email ? (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 7, textDecoration: "line-through", opacity: 0.72 }}>
                  <i className="fa-solid fa-envelope" aria-hidden="true" />
                  {lead.email}
                </span>
              ) : null}
            </div>
            {lead.phone ? (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 7, textDecoration: "line-through", opacity: 0.72, whiteSpace: "nowrap" }}>
                <i className="fa-solid fa-phone" aria-hidden="true" />
                {lead.phone}
              </span>
            ) : null}
          </div>
        </details>
      ) : null}
    </>
  );
}
