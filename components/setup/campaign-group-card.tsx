import { SetupLeadGroup } from "@/types/setup";

type CampaignGroupCardProps = {
  group: SetupLeadGroup;
  onPreviewOpen: (group: SetupLeadGroup) => void;
  onPlanOpen: (group: SetupLeadGroup) => void;
};

export function CampaignGroupCard({
  group,
  onPreviewOpen,
  onPlanOpen,
}: CampaignGroupCardProps) {
  const isActionCard = group.kind !== "ready";

  return (
    <article className={`list-item ${isActionCard ? "action-card" : ""}`}>
      <div className={`list-info ${isActionCard ? "list-info-tight" : ""}`}>
        <div>
          <h3>
            {group.icon ? <i className={group.icon} aria-hidden="true" /> : null}
            {group.name}
          </h3>
          <p>{group.count} Kontakte bereit</p>
        </div>
        <div className="pill-row">
          {group.label ? <span className="badge badge-accent">{group.label}</span> : null}
          <button
            className={`icon-btn ${isActionCard ? "ghost accent" : "ghost"}`}
            type="button"
            onClick={() => onPreviewOpen(group)}
          >
            <i className="fa-solid fa-list-ul" aria-hidden="true" />
          </button>
        </div>
      </div>
      <div className="list-actions">
        <button className="btn btn-outline" type="button" onClick={() => onPlanOpen(group)}>
          <i className="fa-solid fa-clock" aria-hidden="true" />
          Planen
        </button>
        <button className="btn btn-primary" type="button">
          <i className="fa-solid fa-play" aria-hidden="true" />
          Starten
        </button>
      </div>
    </article>
  );
}
