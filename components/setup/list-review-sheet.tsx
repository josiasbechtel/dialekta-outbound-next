import { SheetOverlay } from "@/components/ui/sheet-overlay";
import { StagedLead } from "@/types/setup";

type ListReviewSheetProps = {
  isOpen: boolean;
  title: string;
  leads: StagedLead[];
  onClose: () => void;
  onLeadClick?: (lead: StagedLead) => void;
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
        {leads.map((lead) => (
          <article
            className={`result-item ${onLeadClick ? "clickable" : ""}`}
            key={lead.id}
            onClick={onLeadClick ? () => onLeadClick(lead) : undefined}
          >
            <div className="result-topline">
              <div>
                <div className="company-text">
                  <i className="fa-solid fa-building" aria-hidden="true" />
                  <span>{lead.company}</span>
                </div>
                <div className="result-name-line">
                  <span className="result-name">
                    {lead.firstName} {lead.lastName}
                  </span>
                  <span className="result-meta">
                    <i className="fa-solid fa-phone" aria-hidden="true" />
                    {lead.phone}
                  </span>
                  <span className="result-meta">
                    <i className="fa-solid fa-location-dot" aria-hidden="true" />
                    {lead.location}
                  </span>
                </div>
              </div>
              <span className="badge badge-accent">{lead.branch}</span>
            </div>
            {(lead.email || lead.website) && (
              <div className="preview-lead-side preview-side-inline">
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
            )}
          </article>
        ))}
      </div>
    </SheetOverlay>
  );
}
