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

export function ListReviewSheet({
  isOpen,
  title,
  leads,
  onClose,
  onLeadClick,
}: ListReviewSheetProps) {
  return (
    <SheetOverlay isOpen={isOpen} title={title} onClose={onClose}>
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
                <span className={`badge ${replacement ? "badge-new-ap" : "badge-accent"}`}>
                  {replacement ? "NEUE AP" : lead.branch}
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </SheetOverlay>
  );
}
