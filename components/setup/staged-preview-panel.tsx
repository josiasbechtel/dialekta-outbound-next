import { StagedLead } from "@/types/setup";

type StagedPreviewPanelProps = {
  groupedPreview: Record<string, StagedLead[]>;
};

export function StagedPreviewPanel({ groupedPreview }: StagedPreviewPanelProps) {
  const branches = Object.entries(groupedPreview);

  if (branches.length === 0) {
    return null;
  }

  return (
    <section className="card preview-panel">
      <div className="preview-panel-header">
        <div>
          <h3>Importierte Liste</h3>
          <p>Vorschau vor der Übernahme ins System</p>
        </div>
      </div>

      <div className="preview-branch-stack">
        {branches.map(([branch, leads]) => (
          <div className="preview-branch" key={branch}>
            <div className="preview-branch-head">
              <strong>{branch}</strong>
              <span>{leads.length} Kontakte</span>
            </div>
            <div className="preview-lead-list">
              {leads.map((lead) => (
                <article className="preview-lead-row" key={lead.id}>
                  <div className="preview-lead-main">
                    <div className="company-text">
                      <i className="fa-solid fa-building" aria-hidden="true" />
                      <span>{lead.company}</span>
                    </div>
                    <div className="preview-lead-name">
                      {lead.firstName} {lead.lastName}
                    </div>
                    <div className="preview-lead-meta">
                      <span>
                        <i className="fa-solid fa-phone" aria-hidden="true" />
                        {lead.phone}
                      </span>
                      <span>
                        <i className="fa-solid fa-location-dot" aria-hidden="true" />
                        {lead.location}
                      </span>
                    </div>
                  </div>
                  <div className="preview-lead-side">
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
                </article>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
