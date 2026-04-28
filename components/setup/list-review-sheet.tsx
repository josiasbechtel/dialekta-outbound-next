import { SheetOverlay } from "@/components/ui/sheet-overlay";
import { Lead } from "@/types/dashboard";
import { StagedLead } from "@/types/setup";
import { LeadContactCardLines, hasReplacementContact } from "@/components/shared/lead-contact-card-lines";

type ListReviewSheetProps = {
  isOpen: boolean;
  title: string;
  leads: Array<Lead | StagedLead>;
  onClose: () => void;
  onLeadClick?: (lead: Lead | StagedLead) => void;
};

function getSheetTitleMeta(title: string) {
  if (title.includes("(Neue AP)")) {
    return {
      cleanTitle: title.replace(" (Neue AP)", "").replace("(Neue AP)", "").trim(),
      badge: "NEUE ANSPRECHPERSON",
    };
  }

  if (title.includes("(2. Versuch)")) {
    return {
      cleanTitle: title.replace(" (2. Versuch)", "").replace("(2. Versuch)", "").trim(),
      badge: "2. VERSUCH",
    };
  }

  return { cleanTitle: title, badge: null as string | null };
}

export function ListReviewSheet({
  isOpen,
  title,
  leads,
  onClose,
  onLeadClick,
}: ListReviewSheetProps) {
  const { cleanTitle, badge } = getSheetTitleMeta(title);

  return (
    <SheetOverlay
      isOpen={isOpen}
      title={cleanTitle}
      onClose={onClose}
      headerAside={badge ? <span className="badge badge-new-ap detail-header-badge">{badge}</span> : null}
    >
      <div className="sheet-list-stack">
        {leads.map((lead) => {
          const replacement = hasReplacementContact(lead);
          return (
            <article
              className={`result-item ${replacement ? "result-item-new-ap" : ""} ${onLeadClick ? "clickable" : ""}`}
              key={lead.id}
              onClick={onLeadClick ? () => onLeadClick(lead) : undefined}
            >
              <div className="result-topline">
                <div>
                  <div className="company-text">
                    <i className="fa-solid fa-building" aria-hidden="true" />
                    <span>{lead.company}</span>
                  </div>
                  <LeadContactCardLines lead={lead} />
                </div>
                {!badge ? (
                  <span className={`badge ${replacement ? "badge-new-ap" : "badge-accent"}`}>
                    {replacement ? "NEUE AP" : lead.branch}
                  </span>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </SheetOverlay>
  );
}
